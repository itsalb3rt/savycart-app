<template>
	<AuthShell :title="$t('auth.login_title')" :subtitle="$t('auth.login_subtitle')">
		<template v-slot:prelude>
			<div v-if="loginFailed" class="auth-alert auth-alert--error">
				{{ $t('auth.wrong_data') }}
			</div>
			<div v-if="$route.query.create_user !== undefined" class="auth-alert auth-alert--success">
				{{ $t('auth.the_user_was_created') }}
			</div>
		</template>
		<v-form method="POST" @submit.prevent="login" class="auth-form">
			<div class="auth-form__field">
				<label class="auth-form__label">{{ $t('auth.usernameOrEmail') }}</label>
				<v-text-field
					v-model="userName"
					persistent-clearable
					hide-details
					required
					class="auth-form__input"
				></v-text-field>
			</div>
			<div class="auth-form__field">
				<label class="auth-form__label">{{ $t('auth.password') }}</label>
				<v-text-field
					v-model="password"
					:type="showPassword ? 'text' : 'password'"
					:append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
					@click:append="showPassword = !showPassword"
					persistent-clearable
					hide-details
					required
					class="auth-form__input"
				></v-text-field>
			</div>
			<div class="auth-form__forgot">
				<a href="#" @click.prevent="$router.push('/auth/recovery')" class="auth-form__link">
					{{ $t('auth.forgot_your_password') }}
				</a>
			</div>
			<div class="auth-form__actions">
				<v-btn
					:disabled="loading || userName === '' || password === ''"
					color="primary"
					type="submit"
					block
					large
					class="auth-form__submit"
				>
					{{ $t('auth.login') }}
				</v-btn>
			</div>
			<div class="auth-form__footer">
				<span>{{ $t('auth.new_here') }}</span>
				<a href="#" @click.prevent="$router.push('/register')" class="auth-form__link">
					{{ $t('auth.create_an_account') }}
				</a>
			</div>
		</v-form>
	</AuthShell>
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

.auth-form__input .v-input__control {
	border-radius: var(--radius-control);
}

.auth-form__input .v-text-field__slot {
	border-radius: var(--radius-control);
}

.auth-form__forgot {
	text-align: left;
}

.auth-form__link {
	color: var(--accent);
	text-decoration: underline;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
}

.auth-form__link:hover {
	color: var(--primary-hover);
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

.auth-alert--success {
	background: var(--pill-positive-bg);
	color: var(--pill-positive-ink);
	border: 1px solid var(--positive);
}
</style>
