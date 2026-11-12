<template>
	<div v-hammer:swipe.right="onSwipeLeft">
		<v-app-bar app flat height="48" class="app-bar">
			<v-btn
				icon
				aria-label="Back"
				@click="goBack"
				v-if="this.$route.meta.isSubDir"
				class="mr-2"
			>
				<v-icon>fa-angle-left</v-icon>
			</v-btn>
			<v-app-bar-nav-icon
				aria-label="Menu"
				@click="drawer = !drawer"
				v-else
			></v-app-bar-nav-icon>
			<v-toolbar-title class="app-bar__title">{{ title }}</v-toolbar-title>
		</v-app-bar>
		<v-navigation-drawer app temporary v-model="drawer" width="256">
			<div class="drawer-brand">
				<span class="drawer-brand__mark" aria-hidden="true">S</span>
				<span class="drawer-brand__name">SavyCart</span>
			</div>
			<v-divider></v-divider>

			<v-list class="pt-0" nav>
				<v-list-item v-for="(item, index) in items" :key="index" :to="{ path: item.routePath }">
					<v-list-item-icon>
						<v-icon size="16" :color="item.iconColor">{{ item.icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ $t(`nav.${item.title}`) }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<v-list-group prepend-icon="fa-cog" no-action :value="false">
					<template v-slot:activator>
						<v-list-item-title>{{ $t('nav.settings') }}</v-list-item-title>
					</template>
					<v-list-item v-for="(item, index) in settings" :key="index" :to="{ path: item.routePath }" link
						class="drawer-settings-item">
						<v-list-item-icon>
							<v-icon size="16" :color="item.iconColor">{{ item.icon }}</v-icon>
						</v-list-item-icon>
						<v-list-item-title>{{$t(`nav.${item.title}`)}}</v-list-item-title>
					</v-list-item>
				</v-list-group>
			</v-list>

			<template v-slot:append>
				<v-divider></v-divider>
				<v-list nav>
					<v-list-item @click="$router.push('/user/profile')">
						<v-list-item-avatar :size="32" color="secondary">
							<v-icon small dark>fa-user</v-icon>
						</v-list-item-avatar>
						<v-list-item-content>
							<v-list-item-title>
								{{ $store.getters['auth/getUser'].first_name }} {{ $store.getters['auth/getUser'].last_name }}
							</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
					<v-list-item :to="{ path: logout[0].routePath }">
						<v-list-item-icon>
							<v-icon size="16" :color="logout[0].iconColor">{{ logout[0].icon }}</v-icon>
						</v-list-item-icon>

						<v-list-item-content>
							<v-list-item-title class="drawer-logout-label">{{ $t(`nav.${logout[0].title}`) }}</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list>
			</template>
		</v-navigation-drawer>
	</div>
</template>

<script>
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
html .theme--light.v-app-bar.app-bar,
html .theme--light.v-app-bar.app-bar.v-sheet {
	background-color: var(--surface);
	border-bottom: 1px solid var(--border);
	color: var(--text);
}

.app-bar__title {
	flex: 1 1 auto;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 16px;
	font-weight: 600;
	color: var(--text);
	letter-spacing: 0;
}

.drawer-brand {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 16px 16px 12px;
}

.drawer-brand__mark {
	width: 28px;
	height: 28px;
	border-radius: 6px;
	background: var(--primary);
	color: var(--on-primary);
	font-size: 14px;
	font-weight: 600;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex: none;
}

.drawer-brand__name {
	font-size: 16px;
	font-weight: 600;
	color: var(--text);
}

.drawer-settings-item {
	min-height: 40px;
	padding-left: 48px;
}

.drawer-logout-label {
	color: var(--negative);
}

/* neutral grey pill inset from drawer edges (app-screens §3.2) */
.v-navigation-drawer .v-list-item--active:not(.drawer-logout-label) {
	border-radius: var(--radius-control);
	margin-left: 8px;
	margin-right: 8px;
}
</style>
