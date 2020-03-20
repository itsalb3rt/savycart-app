<template>
	<div v-hammer:swipe.right="onSwipeLeft">
		<v-toolbar flat color="white">
			<v-icon @click="goBack" v-if="this.$route.meta.isSubDir">fa-angle-left</v-icon>
			<v-app-bar-nav-icon @click="drawer = !drawer" v-else></v-app-bar-nav-icon>
			<v-toolbar-title class="primary--text">{{title}}</v-toolbar-title>
		</v-toolbar>
		<v-navigation-drawer app temporary v-model="drawer">
			<v-row>
				<v-col cols="12" class="text-center" @click="$router.push('/user/profile')">
					<v-avatar :size="80" color="indigo">
						<v-icon large dark>fa-user</v-icon>
					</v-avatar>
				</v-col>
				<v-col cols="12">
					<p class="mt-3 headline primary--text">{{user.first_name}} {{user.last_name}}</p>
				</v-col>
			</v-row>

			<v-list class="pt-0" dense nav>
				<v-divider></v-divider>

				<v-list-item v-for="(item,index) in items" :key="index" :to="{path:item.routePath}">
					<v-list-item-icon>
						<v-icon :color="item.iconColor">{{ item.icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ $t(`nav.${item.title}`) }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<v-list-group prepend-icon="fa-cog" no-action :value="false">
					<template v-slot:activator>
						<v-list-item-title>{{ $t('nav.settings') }}</v-list-item-title>
					</template>
					<v-list-item v-for="(item,index) in settings" :key="index" :to="{path:item.routePath}" link>
						<v-list-item-icon>
							<v-icon :color="item.iconColor">{{ item.icon }}</v-icon>
						</v-list-item-icon>
						<v-list-item-title v-text="$t(`nav.${item.title}`)"></v-list-item-title>
					</v-list-item>
				</v-list-group>
				<v-divider></v-divider>
				<v-list-item :to="{path:logout[0].routePath}">
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
	computed: {
		...mapState(['user', 'online'])
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
				},
				{
					title: 'analysis',
					icon: 'fa-chart-bar',
					iconColor: '',
					routePath: '/none'
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
