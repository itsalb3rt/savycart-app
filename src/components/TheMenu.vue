<template>
	<div v-hammer:swipe.right="onSwipeLeft">
		<v-toolbar flat color="white">
			<v-icon @click="goBack" v-if="this.$route.meta.isSubDir" class="mr-2">fa-angle-left</v-icon>
			<v-app-bar-nav-icon @click="drawer = !drawer" v-else></v-app-bar-nav-icon>
			<v-toolbar-title class="primary--text">{{ title }}</v-toolbar-title>
		</v-toolbar>
		<v-navigation-drawer app temporary v-model="drawer">
			<v-row class="mt-2">
				<v-col cols="12" class="text-center" @click="$router.push('/user/profile')">
					<v-avatar :size="80" color="indigo" style="cursor:pointer;" @click="$router.push('/user/profile')">
						<v-icon large dark>fa-user</v-icon>
					</v-avatar>
				</v-col>
				<v-col cols="12" class="text-center">
					<p class="headline primary--text" style="cursor:pointer;" @click="$router.push('/user/profile')">
						{{ $store.getters['auth/getUser'].first_name }} {{ $store.getters['auth/getUser'].last_name }}
					</p>
				</v-col>
			</v-row>

			<v-list class="pt-0" nav>
				<v-divider></v-divider>

				<v-list-item v-for="(item, index) in items" :key="index" :to="{ path: item.routePath }">
					<v-list-item-icon>
						<v-icon :color="item.iconColor">{{ item.icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content :class="$t(`nav.${item.title}`)">
						<v-list-item-title>{{ $t(`nav.${item.title}`) }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<v-list-group prepend-icon="fa-cog" no-action :value="false">
					<template v-slot:activator>
						<v-list-item-title>{{ $t('nav.settings') }}</v-list-item-title>
					</template>
					<v-list-item v-for="(item, index) in settings" :key="index" :to="{ path: item.routePath }" link
						style="height: auto; padding-left: 10%; display: inline-flex;">
						<v-list-item-icon>
							<v-icon :color="item.iconColor">{{ item.icon }}</v-icon>
						</v-list-item-icon>
						<v-list-item-title v-text="$t(`nav.${item.title}`)"></v-list-item-title>
					</v-list-item>
				</v-list-group>
				<v-divider></v-divider>
				<v-list-item :to="{ path: logout[0].routePath }">
					<v-list-item-icon>
						<v-icon :color="logout[0].iconColor">{{ logout[0].icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ $t(`nav.${logout[0].title}`) }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	props: {
		title: ''
	},
	data() {
		return {
			dark: false,
			drawer: false,
			items: [
				{
					title: 'my_list',
					icon: 'fa-clipboard-list',
					iconColor: '',
					routePath: '/product/list'
				},
				{
					title: 'logger_purchase',
					icon: 'fa-shopping-cart',
					iconColor: '',
					routePath: '/shop/registation'
				},
				{
					title: 'shopping_history',
					icon: 'fa-history',
					iconColor: '',
					routePath: '/analysis/shopping_history'
				}
			],
			settings: [
				{
					title: 'measurement_unit',
					icon: 'fa-balance-scale',
					iconColor: '',
					routePath: '/measurement_units'
				},
				{
					title: 'categories',
					icon: 'fa-list-ul',
					iconColor: '',
					routePath: '/categories'
				},
				{
					title: 'more_settings',
					icon: 'fa-cog',
					iconColor: '',
					routePath: '/settings'
				}
			],
			logout: [
				{
					title: 'logout',
					icon: 'fa-sign-out-alt',
					iconColor: 'error',
					routePath: '/auth/logout'
				}
			]
		};
	},
	methods: {
		goBack() {
			window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
		},
		onSwipeLeft() {
			this.drawer = true;
		}
	}
};
</script>
<style lang="css">
.v-list-item--active .v-list-item__content,
.v-list-item--active .v-list-item__icon {
	color: var(--v-primary-base) !important;
}
</style>
