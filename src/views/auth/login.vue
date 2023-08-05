<template>
	<v-container>
		<v-row>
			<v-col cols="12">
				<p class="display-2 primary--text text-center">SavyCart</p>
				<p class="warning--text text-center">shopping registration application</p>
			</v-col>
			<v-col cols="12" class="white--text" v-if="loginFailed">
				<v-alert type="error" :value="true">{{ $t('auth.wrong_data') }}</v-alert>
			</v-col>
			<v-col cols="12" class="white--text" v-if="this.$route.query.create_user !== undefined">
				<v-alert type="success" :value="true">{{ $t('auth.the_user_was_created') }}</v-alert>
			</v-col>
			<v-col cols="12" class="form-responsiveness">
				<v-form method="POST" @submit.prevent="login">
					<v-row>
						<v-col cols="12">
							<h4 class="horizontal-line-text-main-container" style="font-weight: normal!important;">
								<span
									class="horizontal-line-text-container font-weight-bold"
									style="background-color:#fafafa"
								>
									<span class="black--text">{{ $t('auth.login_title') }}</span>
								</span>
							</h4>
						</v-col>
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
								href="#"
							>{{ $t('auth.forgot_your_password') }}</v-btn>
						</v-col>
						<v-col cols="12">
							<v-btn :disabled="loading" color="primary" type="submit" block>{{ $t('auth.login') }}</v-btn>
						</v-col>
						<v-col cols="12" class="pt-3">
							<v-btn color="primary" text to="/register">{{ $t('auth.create_an_account') }}</v-btn>
						</v-col>
					</v-row>
				</v-form>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import curriencies from '@/mixins/miscellany/currencies';
import jwt_decode from "jwt-decode";

export default {
	name: 'Login',
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
				}).finally(()=>{
					this.loading = false
				});
		}
	}
};
</script>
<style>
.horizontal-line-text-main-container {
	width: 100%;
	text-align: center;
	border-bottom: 1px solid lightgray;
	line-height: 0.1em;
	margin: 10px 0 20px;
}

.horizontal-line-text-main-container .horizontal-line-text-container {
	padding: 0 10px;
}

.form-responsiveness {
  max-width: 500px;
  margin: 0 auto;
}
</style>
