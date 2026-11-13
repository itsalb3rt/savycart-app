<template>
	<div class="recoveryNewPassword">
		<div class="recoveryNewPassword__back" @click="$router.push('/login')">
			<i class="fas fa-chevron-left"></i>
		</div>
		<AuthShell :title="invalidToken ? '' : $t('auth.recovery_title')" :subtitle="invalidToken ? '' : $t('auth.new_password_information')">
			<template v-if="invalidToken">
				<div class="recoveryNewPassword__error">
					<div class="recoveryNewPassword__error-icon">
						<i class="fas fa-exclamation-triangle"></i>
					</div>
					<p class="recoveryNewPassword__error-text">{{ $t('messages.invalid_token') }}</p>
					<a href="#" @click.prevent="$router.push('/login')" class="auth-form__link">
						<i class="fas fa-arrow-left"></i>
					</a>
				</div>
			</template>
			<template v-if="!invalidToken">
				<div v-if="!passwordMatch && (passwordReset.password !== '' || passwordReset.password_confirm !== '')" class="auth-alert auth-alert--error">
					{{ $t('messages.password_not_match') }}
				</div>
				<v-form method="POST" ref="form" @submit.prevent="recoveryAccount" class="auth-form">
					<div class="auth-form__field">
						<label class="auth-form__label">{{ $t('auth.password') }}</label>
						<v-text-field
							v-model="passwordReset.password"
							:type="showPassword ? 'text' : 'password'"
							:append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
							@click:append="showPassword = !showPassword"
							placeholder="*********"
							:rules="passwordRules"
							persistent-clearable
							hide-details
							required
							class="auth-form__input"
						></v-text-field>
					</div>
					<div class="auth-form__field">
						<label class="auth-form__label">{{ $t('auth.second_password') }}</label>
						<v-text-field
							v-model="passwordReset.password_confirm"
							:type="showPassword ? 'text' : 'password'"
							:append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
							@click:append="showPassword = !showPassword"
							placeholder="*********"
							:rules="passwordRules"
							persistent-clearable
							hide-details
							required
							class="auth-form__input"
						></v-text-field>
					</div>
					<div class="auth-form__actions">
						<v-btn
							:loading="loading"
							color="primary"
							type="submit"
							block
							large
							:disabled="!passwordMatch"
							class="auth-form__submit"
						>
							{{ $t('auth.recovery_title') }}
						</v-btn>
					</div>
				</v-form>
			</template>
		</AuthShell>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import curriencies from '@/mixins/miscellany/currencies';
import jwt_decode from "jwt-decode";
import AuthShell from '@/components/auth/AuthShell';

export default {
	name: 'RecoveryAccountNewPassword',
	components: { AuthShell },
	mixins: [curriencies],
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
				v => v.length >= 8 || this.$t('messages.password_min_length')
			]
		};
	},
	computed: {
		passwordMatch() {
			if (this.passwordReset.password === '' || this.passwordReset.password_confirm === '') {
				return false;
			}
			if (this.passwordReset.password !== this.passwordReset.password_confirm) {
				return false;
			}
			return true;
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
					this.$store.commit('snackbar/setSnackbar', {
						show: true,
						message: this.$t('messages.saved'),
						color: 'success',
						top: true
					});

					setTimeout(() => {
						this.saveInIndexedDbCurrencies();
						const token = response.data.data;
						window.localStorage.setItem('token', token);

						const decoded = jwt_decode(token);
						window.localStorage.setItem('user', JSON.stringify(decoded));

						this.$store.commit('auth/SET_USER',decoded);
						this.$router.push('product/list');
					}, 1000);
				})
				.catch(error => {
					this.loading = false;
					if (!error.response) {
						this.$store.commit('snackbar/setSnackbar', {
							show: true,
							message: this.$t('messages.server_error'),
							color: 'error',
							top: true
						});
					} else if (error.response?.status === 401) {
						this.invalidToken = true;
						this.$store.commit('snackbar/setSnackbar', {
							show: true,
							message: this.$t('messages.invalid_token'),
							color: 'error',
							top: true
						});
					} else if (error.response?.status === 409) {
						this.$store.commit('snackbar/setSnackbar', {
							show: true,
							message: this.$t('messages.password_not_match'),
							color: 'error',
							top: true
						});
					}
					console.log(error);
				});
		}
	}
};
</script>
<style>
.recoveryNewPassword {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background: var(--ground);
}

.recoveryNewPassword__back {
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: var(--text);
	margin: 24px auto 0;
}

.recoveryNewPassword__back i {
	font-size: 18px;
}

.recoveryNewPassword__error {
	text-align: center;
	padding: 32px 0;
}

.recoveryNewPassword__error-icon {
	width: 80px;
	height: 80px;
	background: var(--negative);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 20px;
}

.recoveryNewPassword__error-icon i {
	font-size: 36px;
	color: var(--on-primary);
}

.recoveryNewPassword__error-text {
	font-size: 15px;
	color: var(--muted);
	line-height: 1.5;
	margin: 0 0 20px;
	padding: 0 16px;
}

.auth-form {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.auth-form__field {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.auth-form__label {
	font-size: 14px;
	font-weight: 500;
	color: var(--muted);
	margin: 0;
}

.auth-form__input {
	border-radius: var(--radius-control) !important;
}

.auth-form__actions {
	margin-top: 8px;
}

.auth-form__submit {
	border-radius: var(--radius-button) !important;
	height: 48px !important;
	font-size: 16px !important;
	font-weight: 600 !important;
	text-transform: none !important;
	letter-spacing: 0 !important;
}

.auth-form__link {
	color: var(--accent);
	text-decoration: underline;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	background: none;
	border: none;
	padding: 0;
}

.auth-form__link:hover {
	color: var(--primary-hover);
}

.auth-alert {
	padding: 12px 16px;
	border-radius: var(--radius-control);
	font-size: 14px;
	margin-bottom: 16px;
}

.auth-alert--error {
	background: var(--pill-negative-bg);
	color: var(--pill-negative-ink);
	border: 1px solid var(--negative);
}
</style>
