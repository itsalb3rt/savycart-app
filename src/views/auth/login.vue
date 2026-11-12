<template>
	<v-container>
		<AuthShell :title="$t('auth.login_title')">
			<template v-slot:prelude>
				<v-row v-if="loginFailed">
					<v-col cols="12">
						<v-alert type="error" :value="true">{{ $t('auth.wrong_data') }}</v-alert>
					</v-col>
				</v-row>
				<v-row v-if="$route.query.create_user !== undefined">
					<v-col cols="12">
						<v-alert type="success" :value="true">{{ $t('auth.the_user_was_created') }}</v-alert>
					</v-col>
				</v-row>
			</template>
			<v-form method="POST" @submit.prevent="login">
				<v-row>
					<v-col cols="12">
						<v-text-field v-model="userName" :label="$t('auth.usernameOrEmail')" required></v-text-field>
						<v-text-field
							v-model="password"
							:type="showPassword ? 'text' : 'password'"
							:append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
							@click:append="showPassword = !showPassword"
							:label="$t('auth.password')"
							required
						></v-text-field>
					</v-col>
					<v-col cols="12">
						<v-btn
							color="primary"
							to="/auth/recovery"
							text
							small
						>{{ $t('auth.forgot_your_password') }}</v-btn>
					</v-col>
					<v-col cols="12">
						<v-btn :disabled="loading || userName === '' || password === ''" color="primary" type="submit" block>{{ $t('auth.login') }}</v-btn>
					</v-col>
					<v-col cols="12" class="pt-3">
						<v-btn color="primary" text to="/register">{{ $t('auth.create_an_account') }}</v-btn>
					</v-col>
				</v-row>
			</v-form>
		</AuthShell>
	</v-container>
</template>

<script>
import curriencies from '@/mixins/miscellany/currencies';
import jwt_decode from "jwt-decode";
import AuthShell from '@/components/auth/AuthShell';

export default {
	name: 'Login',
	components: { AuthShell },
	mixins: [curriencies],
	mounted: function() {
		if (this.$store.getters['auth/getIsLogged']) {
			this.$router.push('product/list');
		}
	},
	data: function() {
		return {
			userName: '',
			password: '',
			loginFailed: false,
			showPassword: false,
			loading:false
		};
	},
	methods: {
		login() {
			this.loading = true;
			this.$store
				.dispatch('auth/login', {
					user_name: this.userName,
					password: this.password
				})
				.then(response => {
					if (response.status === 200) {
						this.saveInIndexedDbCurrencies();
						const token = response.data.data;
						window.localStorage.setItem('token', token);

						const decoded = jwt_decode(token);
						window.localStorage.setItem('user', JSON.stringify(decoded));
						
						this.$store.commit('auth/SET_USER',decoded);
						this.$router.push('product/list');
					}
				})
				.catch(error => {
					console.log('login -> error', error);
					this.loginFailed = true;
					if (!error.response) {
						this.$store.commit('snackbar/setSnackbar', {
							show: true,
							message: this.$t('messages.server_error'),
							color: 'error',
							top: true
						});
					}
				}).finally(()=>{
					this.loading = false
				});
		}
	}
};
</script>
<style>
.form-responsiveness {
  max-width: 500px;
  margin: 0 auto;
}
</style>
