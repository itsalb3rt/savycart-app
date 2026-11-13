<template>
	<div class="recoveryAccount">
		<div class="recoveryAccount__back" @click="$router.push('/login')">
			<i class="fas fa-chevron-left"></i>
		</div>
		<AuthShell :title="recoveryWasRequested ? '' : $t('auth.recovery_title')" :subtitle="recoveryWasRequested ? '' : $t('auth.account_recovery_description')">
			<template v-if="recoveryWasRequested">
				<div class="recoveryAccount__success">
					<div class="recoveryAccount__success-icon">
						<i class="fas fa-check"></i>
					</div>
					<p class="recoveryAccount__success-text">{{ $t('auth.account_recovery_information') }}</p>
					<a href="#" @click.prevent="$router.push('/login')" class="auth-form__link">
						<i class="fas fa-arrow-left"></i>
					</a>
				</div>
			</template>
			<template v-if="!recoveryWasRequested">
				<div v-if="loginFailed" class="auth-alert auth-alert--error">
					{{ $t('auth.wrong_data') }}
				</div>
				<div v-if="emailNotExits" class="auth-alert auth-alert--error">
					{{ $t('auth.email_not_register') }}
				</div>
				<v-form method="POST" ref="form" @submit.prevent="recoveryAccount" class="auth-form">
					<div class="auth-form__field">
						<label class="auth-form__label">{{ $t('auth.email') }}</label>
						<v-text-field
							:rules="emailRules"
							v-model="email"
							type="email"
							persistent-clearable
							hide-details
							required
							class="auth-form__input"
						></v-text-field>
					</div>
					<div class="auth-form__actions">
						<v-btn
							:loading="loading"
							:disabled="loading || email === ''"
							color="primary"
							type="submit"
							block
							large
							class="auth-form__submit"
						>
							{{ $t('auth.send_recovery_email') }}
						</v-btn>
					</div>
					<div class="auth-form__footer">
						<span>{{ $t('auth.new_here') }}</span>
						<a href="#" @click.prevent="$router.push('/register')" class="auth-form__link">
							{{ $t('auth.create_an_account') }}
						</a>
					</div>
				</v-form>
			</template>
		</AuthShell>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import AuthShell from '@/components/auth/AuthShell';

export default {
	components: { AuthShell },
	mounted: function() {
		if (this.$store.getters['auth/getIsLogged']) {
			this.$router.push('product/list');
		}
	},
	data: function() {
		return {
			email: '',
			loginFailed: false,
			loading: false,
			emailRules: [
				v => !!v || this.$t('auth.email_required'),
				v => /.+@.+/.test(v) || this.$t('auth.email_invalid')
			],
			recoveryWasRequested: false,
			emailNotExits: false
		};
	},
	methods: {
		recoveryAccount() {
			this.emailNotExits = false;
			if (!this.$refs.form.validate()) {
				return false;
			}

			this.loading = true;

			this.$store
				.dispatch('auth/recoveryAccount', { email: this.email })
				.then(() => {
					this.recoveryWasRequested = true;
				})
				.catch(error => {
					console.log('recoveryAccount -> error', error);
					if (!error.response) {
						this.$store.commit('snackbar/setSnackbar', {
							show: true,
							message: this.$t('messages.server_error'),
							color: 'error',
							top: true
						});
					}
				})
				.finally(() => {
					this.loading = false;
				});
		}
	}
};
</script>
<style>
.recoveryAccount {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background: var(--ground);
}

.recoveryAccount__back {
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: var(--text);
	margin: 24px auto 0;
}

.recoveryAccount__back i {
	font-size: 18px;
}

.recoveryAccount__success {
	text-align: center;
	padding: 32px 0;
}

.recoveryAccount__success-icon {
	width: 80px;
	height: 80px;
	background: var(--positive);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 20px;
}

.recoveryAccount__success-icon i {
	font-size: 36px;
	color: var(--on-primary);
}

.recoveryAccount__success-text {
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

.auth-form__footer {
	text-align: center;
	font-size: 14px;
	color: var(--muted);
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4px;
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
