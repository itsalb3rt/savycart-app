<template>
	<AuthShell :title="$t('auth.register_title')" :subtitle="$t('auth.register_subtitle')">
		<form @submit.prevent="registerUser" class="auth-form">
			<div class="auth-form__field">
				<label class="auth-form__label">{{ $t('auth.fullname') }}</label>
				<v-text-field
					v-model="newUser.fullname"
					persistent-clearable
					hide-details
					required
					class="auth-form__input"
				></v-text-field>
			</div>
			<div class="auth-form__field">
				<label class="auth-form__label">{{ $t('auth.email') }}</label>
				<v-text-field
					v-model="newUser.email"
					@change="validatedEmail"
					placeholder="jhon@domain.com"
					type="email"
					persistent-clearable
					hide-details
					required
					:class="{ 'auth-form__input--error': emailExists }"
					class="auth-form__input"
				></v-text-field>
				<p v-if="emailExists" class="auth-form__error">{{ $t('auth.email_already_registered') }}</p>
			</div>
			<div class="auth-form__field">
				<label class="auth-form__label">{{ $t('auth.password') }}</label>
				<v-text-field
					v-model="newUser.password"
					:type="showPassword ? 'text' : 'password'"
					:append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
					@click:append="showPassword = !showPassword"
					persistent-clearable
					hide-details
					required
					class="auth-form__input"
				></v-text-field>
			</div>
			<div class="auth-form__field">
				<label class="auth-form__label">{{ $t('auth.second_password') }}</label>
				<v-text-field
					v-model="newUser.password2"
					:type="showPassword ? 'text' : 'password'"
					:append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
					@click:append="showPassword = !showPassword"
					persistent-clearable
					hide-details
					required
					class="auth-form__input"
				></v-text-field>
			</div>
			<div class="auth-form__actions">
				<v-btn
					type="submit"
					color="primary"
					:disabled="userExists === true || emailExists === true || disabledSubmitButton === true || newUser.fullname === '' || newUser.email === '' || newUser.password === '' || newUser.password2 === '' || newUser.password !== newUser.password2"
					block
					large
					class="auth-form__submit"
				>
					{{ $t('auth.create_an_account') }}
				</v-btn>
			</div>
			<div class="auth-form__footer">
				<span>{{ $t('auth.do_you_already_have_an_account') }}</span>
				<a href="#" @click.prevent="$router.push('/login')" class="auth-form__link">
					{{ $t('auth.login') }}
				</a>
			</div>
		</form>
	</AuthShell>
</template>
<script>
import { mapState } from 'vuex';
import jwt_decode from "jwt-decode";
import curriencies from '@/mixins/miscellany/currencies';
import AuthShell from '@/components/auth/AuthShell';

export default {
	name: 'Register',
	components: { AuthShell },
	mixins: [curriencies],
	mounted: function() {
		if (this.$store.getters['auth/getIsLogged']) {
			this.$router.push('product/list');
		}
	},
	data: function() {
		return {
			newUser: {
				password: '',
				password2: '',
				fullname: '',
				email: ''
			},
			userExists: false,
			emailExists: false,
			disabledSubmitButton: false,
			showPassword: false,
			regex: '^[a-z0-9_-]{3,15}$'
		};
	},
	methods: {
		validatedEmail() {
			this.$store
				.dispatch('auth/checkIsEmailExists', { email: this.newUser.email })
				.then(() => {
     this.emailExists = true;
				})
				.catch(error => {
					if (!error.response) {
						this.$store.commit('snackbar/setSnackbar', {
							show: true,
							message: this.$t('messages.server_error'),
							color: 'error',
							top: true
						});
					} else if (error.response?.status === 404) {
      this.emailExists = false;
					}
				});
		},
		registerUser() {
			this.disabledSubmitButton = true;

			this.$store
				.dispatch('auth/register', this.newUser)
				.then(response => {
						this.saveInIndexedDbCurrencies();
						const token = response.data.data;
						window.localStorage.setItem('token', token);

						const decoded = jwt_decode(token);
						window.localStorage.setItem('user', JSON.stringify(decoded));
						
						this.$store.commit('auth/SET_USER',decoded);
						this.$router.push('product/list');
				})
  		.catch((error) => {
	        console.log('🚀 ~ file: register.vue ~ line 126 ~ registerUser ~ error', error) // taste-skill-ignore
		this.$store.commit('snackbar/setSnackbar', {
			show: true,
			message: error.response?.data?.errors ? error.response.data.errors.toString() : this.$t('messages.server_error'),
			color: 'error',
			top: true,
			close: false,
			showClose: false
		});
	})
				.finally(() => {
					this.disabledSubmitButton = false;
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

.auth-form__input--error {
	border-color: var(--negative) !important;
}

.auth-form__input--error .v-input__control .v-input__slot {
	border-color: var(--negative) !important;
}

.auth-form__error {
	margin: 0;
	font-size: 13px;
	color: var(--negative);
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
</style>
