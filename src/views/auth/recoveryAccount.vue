<template>
	<div class="recoveryAccount_container">
		<AuthShell :title="recoveryWasRequested ? '' : $t('auth.recovery_title')">
			<template v-slot:prelude>
				<v-row v-if="loginFailed">
					<v-col cols="12">
						<v-alert type="error" :value="true">{{ $t('auth.wrong_data') }}</v-alert>
					</v-col>
				</v-row>
				<v-row v-if="recoveryWasRequested">
					<v-col cols="12" class="text-center">
						<p>
							<v-avatar size="80" color="success" class="mb-4 mt-4">
								<v-icon x-large dark>fa-check</v-icon>
							</v-avatar>
						</p>
						<p>{{ $t('auth.account_recovery_information') }}</p>
						<v-btn color="primary" text to="/login">
							<v-icon>fa-arrow-left</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</template>
			<template v-if="!recoveryWasRequested">
				<v-row v-if="emailNotExits">
					<v-col cols="12">
						<v-alert type="error" :value="true">{{ $t('auth.email_not_register') }}</v-alert>
					</v-col>
				</v-row>
				<v-form method="POST" ref="form" @submit.prevent="recoveryAccount">
					<v-row>
						<v-col cols="12">
							<p>{{ $t('auth.account_recovery_description') }}</p>
						</v-col>
						<v-col cols="12">
							<v-text-field
								:rules="emailRules"
								v-model="email"
								type="email"
								:label=" $t('auth.email') "
								placeholder="jhon@domain.com"
								required
							></v-text-field>
						</v-col>
						<v-col cols="12">
							<v-btn :loading="loading" color="success" type="submit" block>{{ $t('auth.recovery_title') }}</v-btn>
						</v-col>
						<v-col cols="12" class="pt-3">
							<v-btn
								color="primary"
								text
								class="ma-0 pa-0"
								to="/register"
							>{{ $t('auth.create_an_account') }}</v-btn>
						</v-col>
					</v-row>
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
@media (min-width:950px) {
	.recoveryAccount_container {
		max-width: 500px;
		margin: auto;
	}
}
</style>
