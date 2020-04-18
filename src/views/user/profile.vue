<template>
	<div>
		<v-row>
			<v-col cols="12" class="edit-form" v-if="online">
				<v-form autocomplete="off">
					<p class="mb-2 mt-2">{{ $t('messages.basic') }}</p>
					<v-text-field
						id="first-name"
						v-model="localUser.firstName"
						:label=" $t('auth.first_name') "
						placeholder="Albert Eduardo"
						required
					></v-text-field>
					<v-text-field
						id="last-name"
						v-model="localUser.lastName"
						:label=" $t('auth.last_name') "
						placeholder="Hidalgo Taveras"
						required
					></v-text-field>
					<v-text-field
						id="email"
						type="email"
						v-model="localUser.email"
						:label=" $t('auth.email') "
						placeholder="alhidalgo@domain.com"
						required
					></v-text-field>
					<p class="mb-2 mt-2">{{ $t('messages.security') }}</p>
					<p>{{ $t('messages.password_change_instructions') }}</p>
					<v-text-field
						id="password"
						type="password"
						v-model="localUser.password"
						:label=" $t('auth.password') "
						placeholder="********"
						required
					></v-text-field>
					<v-text-field
						id="password2"
						type="password"
						v-model="localUser.password2"
						:label=" $t('auth.second_password') "
						placeholder="********"
						required
					></v-text-field>
					<v-btn class="mr-0" color="success" @click="updateUser()">
						<v-icon class="mr-2">fa-save</v-icon>
						{{ $t('call_action_buttons.save') }}
					</v-btn>
				</v-form>
			</v-col>
			<v-col cols="12" v-else>
				<offline-infomation />
			</v-col>
		</v-row>
	</div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import OfflineInfomation from '@/components/Offline/OfflineInformation';

export default {
	mounted() {
		this.isLoading = true;
		this.requestUser();
	},
	data() {
		return {
			isLoading: false,
			localUser: {
				id_user: '',
				firstName: '',
				lastName: '',
				email: '',
				password: '',
				password2: ''
			}
		};
	},
	components: {
		Loading,
		OfflineInfomation
	},
	computed: {
		...mapState(['online', 'apiDomain'])
	},
	methods: {
		requestUser() {
			this.$store
				.dispatch('auth/user', {
					id: this.$store.getters['auth/getUser'].id_user
				})
				.then(response => {
					const user = response.data.data;

					this.localUser.id_user = user.id_user;
					this.localUser.firstName = user.first_name;
					this.localUser.lastName = user.last_name;
					this.localUser.email = user.email;
					this.isLoading = false;
				})
				.catch(function(error) {
					console.log(error);
				});
		},
		updateUser() {
			this.isLoading = true;
			this.$store
				.dispatch('auth/updateUser', {
					id: this.localUser.id_user,
					data: this.localUser
				})
				.then(response => {
					this.isLoading = false;
					this.localUser.email = this.localUser.email;
					this.localUser.first_name = this.localUser.firstName;
					this.localUser.last_name = this.localUser.lastName;

					this.$store.commit('snackbar/setSnackbar', {
						show: true,
						message: this.$t('call_action_buttons.saved'),
						color: 'success',
						top: true
					});
				})
				.catch(error => {
					this.isLoading = false;
					if (error.response.status === 409) {
						this.$store.commit('snackbar/setSnackbar', {
							show: true,
							message: this.$t('messages.password_not_match'),
							color: 'error',
							top: true
						});
					} else {
						this.$store.commit('snackbar/setSnackbar', {
							show: true,
							message: this.$t('messages.server_error'),
							color: 'error',
							top: true
						});
					}
				});
		}
	}
};
</script>