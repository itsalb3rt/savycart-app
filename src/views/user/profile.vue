<template>
	<div class="profile-page">
		<div class="profile-page__header">
			<button class="profile-page__back-btn" @click="$router.back()" type="button">
				<v-icon>fa-chevron-left</v-icon>
			</button>
			<h1 class="profile-page__title">{{ $t('page_titles.user_profile') }}</h1>
		</div>

		<div v-if="online" class="profile-page__form">
			<div class="profile-page__section">
				<h2 class="profile-page__section-title">{{ $t('messages.basic') }}</h2>
				<div class="profile-page__field">
					<label class="profile-page__label">{{ $t('auth.fullname') }}</label>
					<input
						class="profile-page__input"
						id="fullname"
						v-model="localUser.fullname"
						placeholder="Albert Eduardo"
					>
				</div>
				<div class="profile-page__field">
					<label class="profile-page__label">{{ $t('auth.email') }}</label>
					<input
						class="profile-page__input"
						id="email"
						type="email"
						v-model="localUser.email"
						placeholder="alhidalgo@domain.com"
					>
				</div>
			</div>

			<div class="profile-page__section">
				<h2 class="profile-page__section-title">{{ $t('messages.security') }}</h2>
				<p class="profile-page__section-hint">{{ $t('messages.password_change_instructions') }}</p>
				<div class="profile-page__field">
					<label class="profile-page__label">{{ $t('auth.password') }}</label>
					<input
						class="profile-page__input"
						id="password"
						type="password"
						v-model="localUser.password"
						placeholder="********"
					>
				</div>
				<div class="profile-page__field">
					<label class="profile-page__label">{{ $t('auth.second_password') }}</label>
					<input
						class="profile-page__input"
						id="password2"
						type="password"
						v-model="localUser.password2"
						placeholder="********"
					>
				</div>
			</div>

			<div class="profile-page__footer">
				<button
					class="profile-page__save-btn"
					:disabled="isLoading || (localUser.password !== '' && localUser.password !== localUser.password2)"
					@click="updateUser()"
					type="button"
				>
					{{ $t('products.save_changes') }}
				</button>
			</div>
		</div>

		<div v-else class="profile-page__offline">
			<offline-infomation />
		</div>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import Loading from 'vue-loading-overlay';
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
				fullname:'',
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
		...mapState(['online'])
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
					this.localUser.fullname = `${user.first_name} ${user.last_name}`;
					this.localUser.email = user.email;
					this.isLoading = false;
				})
				.catch(error => {
					this.isLoading = false;
					this.$store.commit('snackbar/setSnackbar', {
						show: true,
						message: this.$t('messages.server_error'),
						color: 'error',
						top: true
					});
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
					this.$store.commit('auth/SET_USER', response.data.data);
					window.localStorage.setItem('user', JSON.stringify(response.data.data));
					this.$store.commit('snackbar/setSnackbar', {
						show: true,
						message: this.$t('call_action_buttons.saved'),
						color: 'success',
						top: true
					});
				})
				.catch(error => {
					this.isLoading = false;
					if (error.response?.status === 409) {
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

<style>
.profile-page {
	padding-bottom: 80px;
}

.profile-page__header {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 24px;
}

.profile-page__back-btn {
	width: 36px;
	height: 36px;
	border: none;
	background: transparent;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--text);
	border-radius: 10px;
}

.profile-page__title {
	font-size: var(--fs-title);
	font-weight: 700;
	color: var(--text);
	margin: 0;
}

.profile-page__form {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.profile-page__section {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.profile-page__section-title {
	font-size: var(--fs-section);
	font-weight: 600;
	color: var(--text);
	margin: 0;
}

.profile-page__section-hint {
	font-size: var(--fs-body);
	color: var(--muted);
	margin: 0;
	line-height: 1.4;
}

.profile-page__field {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.profile-page__label {
	font-size: var(--fs-section);
	font-weight: 600;
	color: var(--text);
}

.profile-page__input {
	width: 100%;
	padding: 14px 16px;
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: var(--radius-control);
	font-size: var(--fs-body);
	color: var(--text);
	outline: none;
	transition: border-color 0.15s;
}

.profile-page__input:focus {
	border-color: var(--primary);
}

.profile-page__footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 16px;
	background: var(--surface);
	border-top: 1px solid var(--border);
}

.profile-page__save-btn {
	width: 100%;
	padding: 14px 24px;
	background: var(--primary);
	color: #fff;
	border: none;
	border-radius: var(--radius-control);
	font-size: var(--fs-body);
	font-weight: 600;
	cursor: pointer;
	transition: opacity 0.15s;
}

.profile-page__save-btn:hover {
	opacity: 0.9;
}

.profile-page__save-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.profile-page__offline {
	padding: 32px 0;
}
</style>