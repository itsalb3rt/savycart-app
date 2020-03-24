<template>
	<div>
		<v-row class="text-center">
			<v-col cols="12">
				<p class="display-2 primary--text">Sheiley Shop</p>
				<p class="warning--text">shopping registration application</p>
			</v-col>
		</v-row>
		<v-row v-if="invalidToken">
			<v-col cols="12" class="text-center">
				<p>
					<v-avatar size="80" color="error" class="mb-4 mt-4">
						<v-icon x-large dark>fa-car-crash</v-icon>
					</v-avatar>
				</p>
				<p>{{$t('messages.invalid_token')}}</p>
				<v-col cols="12">
					<v-btn color="primary" text to="/login">
						<v-icon>fa-arrow-left</v-icon>
					</v-btn>
				</v-col>
			</v-col>
		</v-row>
		<v-form v-else method="POST" ref="form" @submit.prevent="recoveryAccount">
			<v-row>
				<v-col cols="12">
					<h4 class="horizontal-line-text-main-container" style="font-weight: normal!important;">
						<span
							class="horizontal-line-text-container font-weight-bold"
							style="background-color:#fafafa"
						>
							<span class="black--text">{{ $t('auth.recovery_title') }}</span>
						</span>
					</h4>
				</v-col>
				<v-col cols="12" class="white--text" v-if="!passwordMatch">
					<v-alert type="error" :value="true">{{ $t('messages.password_not_match') }}</v-alert>
				</v-col>
				<v-col cols="12">
					<p>{{$t('auth.new_password_information')}}</p>
				</v-col>
				<v-col cols="12">
					<v-text-field
						v-model="passwordReset.password"
						:type="showPassword ? 'text' : 'password'"
						:append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
						@click:append="showPassword = !showPassword"
						:label=" $t('auth.password') "
						placeholder="*********"
						:rules="passwordRules"
						required
					></v-text-field>
					<v-text-field
						v-model="passwordReset.password_confirm"
						:type="showPassword ? 'text' : 'password'"
						:append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
						@click:append="showPassword = !showPassword"
						:label=" $t('auth.second_password') "
						placeholder="*********"
						:rules="passwordRules"
						required
					></v-text-field>
				</v-col>
				<v-col cols="12">
					<v-btn
						:loading="loading"
						color="success"
						type="submit"
						block
						:disabled="!passwordMatch"
					>{{ $t('auth.recovery_title') }}</v-btn>
				</v-col>
			</v-row>
		</v-form>
		<v-snackbar :multi-line="snackbarMultiLine" v-model="snackbarShow" :color="snackbarColor">
			{{snackbarMessage}}
			<v-btn dark flat @click="snackbarShow = false">Cerrar</v-btn>
		</v-snackbar>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	mounted: function() {
		if (this.$route.query.token === undefined) {
			this.$router.push('/login');
		}

		if (this.$store.getters['auth/getIsLogged']) {
			this.$router.push('product/list');
		}

		this.passwordReset.token = this.$route.query.token;
	},
	data: function() {
		return {
			passwordReset: {
				password: '',
				password_confirm: '',
				token: ''
			},
			showPassword: false,
			loginFailed: false,
			loading: false,
			invalidToken: false,
			passwordRules: [
				v => !!v || this.$t('messages.invalid_input'),
				v => v.length >= 8 || 'Password must be less than 8 characters'
			],
			snackbarShow: false,
			snackbarMessage: '',
			snackbarColor: '',
			snackbarMultiLine: true
		};
	},
	computed: {
		...mapState(['user']),
		passwordMatch() {
			if (this.passwordReset.password !== this.passwordReset.password_confirm) {
				return false;
			} else {
				return true;
			}
		}
	},
	methods: {
		recoveryAccount() {
			if (!this.$refs.form.validate()) {
				return false;
			}
			this.loading = true;

			this.$store
				.dispatch('auth/passwordReset', this.passwordReset)
				.then(response => {
					this.snackbarShow = true;
					this.snackbarMessage = this.$t('messages.saved');
					this.snackbarColor = 'success';

					setTimeout(() => {
						this.$router.push('/login');
					}, 1000);
				})
				.catch(error => {
					this.loading = false;
					if (error.response.status === 401) {
						this.invalidToken = true;
					} else if (error.response.status === 409) {
						console.log('the password not match');
					}
					console.log(error);
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
</style>
