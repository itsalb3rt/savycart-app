<template>
	<div>
		<v-row class="text-center">
			<v-col cols="12">
				<p class="display-2 primary--text">Sheiley Shop</p>
				<p class="warning--text">shopping registration application</p>
			</v-col>
		</v-row>
		<v-col cols="12" class="white--text" v-if="loginFailed">
			<v-alert type="error" :value="true">{{ $t('auth.wrong_data') }}</v-alert>
		</v-col>
		<v-col cols="12" v-if="recoveryWasRequested">
			<p class="text-center">
				<v-avatar size="80" color="success" class="mb-4 mt-4">
					<v-icon x-large dark>fa-check</v-icon>
				</v-avatar>
			</p>
			<p class="text-xs-center">{{$t('auth.account_recovery_information')}}</p>
			<v-col cols="12">
				<v-btn color="primary" text to="/login">
					<v-icon>fa-arrow-left</v-icon>
				</v-btn>
			</v-col>
		</v-col>
		<v-col cols="12" v-else>
			<v-col cols="12" class="white--text" v-if="emailNotExits">
				<v-alert type="error" :value="true">{{ $t('auth.email_not_register') }}</v-alert>
			</v-col>
			<v-form method="POST" ref="form" @submit.prevent="recoveryAccount">
				<v-row>
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
						<v-col cols="12">
							<p>{{$t('auth.account_recovery_description')}}</p>
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
				</v-row>
			</v-form>
		</v-col>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
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
	computed: {
		...mapState(['user'])
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
				.then(response => {
					this.loading = false;
					this.recoveryWasRequested = true;
				})
				.catch(function(error) {
					console.log(error);
				})
				.finally(() => {
					this.loading = false;
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
