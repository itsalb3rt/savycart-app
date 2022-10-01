<template>
	<div>
		<v-row class="text-center">
			<v-col cols="12">
				<p class="display-2 primary--text">Sheiley Shop</p>
				<p class="warning--text">shopping registration application</p>
			</v-col>
		</v-row>
		<form @submit.prevent="registerUser">
			<v-row>
				<v-col cols="12">
					<h4 class="horizontal-line-text-main-container" style="font-weight: normal!important;">
						<span class="horizontal-line-text-container white" style="background-color:#fafafa">
							<span class="black--text">{{$t('auth.create_an_account')}}</span>
						</span>
					</h4>
				</v-col>
				<v-col cols="12">
					<v-text-field v-model="newUser.fullname" :label=" $t('auth.fullname') " required></v-text-field>
				</v-col>
				<v-col cols="12">
					<v-text-field
						v-model="newUser.email"
						@change="validatedEmail"
						:label=" $t('auth.email') "
						placeholder="jhon@domain.com"
						type="email"
						required
					></v-text-field>
					<div color="error" v-if="emailExits">
						<p class="error--text">{{ $t('auth.email_already_registered') }}</p>
					</div>
				</v-col>
				<v-col cols="12">
					<v-text-field
						v-model="newUser.password"
						:type="showPassword ? 'text' : 'password'"
						:append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
						@click:append="showPassword = !showPassword"
						:label=" $t('auth.password') "
						required
					></v-text-field>
					<v-text-field
						v-model="newUser.password2"
						:type="showPassword ? 'text' : 'password'"
						:append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
						@click:append="showPassword = !showPassword"
						:label=" $t('auth.second_password') "
						required
					></v-text-field>
				</v-col>
				<v-col cols="12">
					<v-btn
						type="submit"
						color="success"
						:disabled="userExitst === true || emailExits === true || disabledSubmitButton === true || newUser.fullname === '' || newUser.email === '' || newUser.password === '' || newUser.password2 === ''"
						block
					>{{ $t('auth.create_an_account') }}</v-btn>
				</v-col>
				<v-col cols="12" class="mt-4">
					{{ $t('auth.do_you_already_have_an_account') }}?
					<v-btn color="primary" text class="ma-0 pa-0" to="/login">{{ $t('auth.login') }}!</v-btn>
				</v-col>
			</v-row>
		</form>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import jwt_decode from "jwt-decode";
import curriencies from '@/mixins/miscellany/currencies';

export default {
	name: 'Register',
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
			userExitst: false,
			emailExits: false,
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
					this.emailExits = true;
				})
				.catch(error => {
					if (error.response.status === 404) {
						this.emailExits = false;
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
          console.log('🚀 ~ file: register.vue ~ line 126 ~ registerUser ~ error', error)
					this.$store.commit('snackbar/setSnackbar', {
						show: true,
						message: error.response.data && error.response.data.errors ? error.response.data.errors.toString() : 'Unknown error',
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