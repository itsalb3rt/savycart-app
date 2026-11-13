<template>
	<v-bottom-navigation
		v-model="active"
		color="primary"
		app
		class="bottom-navigation"
		grow
	>
		<v-btn to="/product/list" value="myList">
			<span>{{ $t('nav.my_list') }}</span>
			<v-icon>fa-clipboard-list</v-icon>
		</v-btn>

		<v-btn to="/shop/registation" value="logPurchase">
			<span>{{ $t('nav.logger_purchase') }}</span>
			<v-icon>fa-shopping-cart</v-icon>
		</v-btn>

		<v-btn to="/analysis/shopping_history" value="history">
			<span>{{ $t('nav.shopping_history') }}</span>
			<v-icon>fa-history</v-icon>
		</v-btn>

		<v-btn @click="showMoreMenu = !showMoreMenu" value="more">
			<span>{{ $t('nav.more') }}</span>
			<v-icon>fa-ellipsis-h</v-icon>
		</v-btn>

		<!-- More menu -->
		<v-menu
			v-model="showMoreMenu"
			:absolute="true"
			bottom
			right
			offset-y
			class="more-menu"
		>
			<template v-slot:activator="{ on, attrs }">
				<v-btn @click="showMoreMenu = !showMoreMenu" v-bind="attrs" v-on="on" style="display:none"></v-btn>
			</template>
			<v-card class="more-menu__card">
				<v-list nav>
					<v-list-item v-for="(item, index) in moreItems" :key="index" :to="{ path: item.routePath }">
						<v-list-item-icon>
							<v-icon size="16">{{ item.icon }}</v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title>{{ $t(`nav.${item.title}`) }}</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list>
				<v-divider></v-divider>
				<v-list nav>
					<v-list-item @click="$router.push('/user/profile')">
						<v-list-item-avatar :size="32" color="secondary">
							<v-icon small>fa-user</v-icon>
						</v-list-item-avatar>
						<v-list-item-content>
							<v-list-item-title>
								{{ ($store.getters['auth/getUser']?.first_name || '') + ' ' + ($store.getters['auth/getUser']?.last_name || '') }}
							</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
					<v-list-item @click="toggleTheme">
						<v-list-item-icon>
							<v-icon size="16">{{ isDark ? 'fa-sun' : 'fa-moon' }}</v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title>{{ $t('nav.theme_toggle') }}</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
					<v-list-item :to="{ path: '/auth/logout' }">
						<v-list-item-icon>
							<v-icon size="16" color="error">fa-sign-out-alt</v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title class="more-menu__logout">{{ $t('nav.logout') }}</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list>
			</v-card>
		</v-menu>
	</v-bottom-navigation>
</template>

<script>
export default {
	name: 'BottomNavigation',
	data() {
		return {
			active: 'myList',
			showMoreMenu: false,
			moreItems: [
				{
					title: 'measurement_unit',
					icon: 'fa-balance-scale',
					routePath: '/measurement_units'
				},
				{
					title: 'categories',
					icon: 'fa-list-ul',
					routePath: '/categories'
				},
				{
					title: 'more_settings',
					icon: 'fa-cog',
					routePath: '/settings'
				}
			]
		};
	},
	computed: {
		isDark() {
			return document.documentElement.getAttribute('data-theme') === 'dark';
		}
	},
	watch: {
		'$route.path'() {
			this.updateActive();
		}
	},
	mounted() {
		this.updateActive();
	},
	methods: {
		updateActive() {
			const path = this.$route.path;
			if (path.startsWith('/product')) {
				this.active = 'myList';
			} else if (path.startsWith('/shop')) {
				this.active = 'logPurchase';
			} else if (path.startsWith('/analysis')) {
				this.active = 'history';
			}
		},
		toggleTheme() {
			const current = document.documentElement.getAttribute('data-theme');
			const next = current === 'dark' ? 'light' : 'dark';
			document.documentElement.setAttribute('data-theme', next);
			localStorage.setItem('theme', next);
			this.$vuetify.theme.dark = next === 'dark';
			this.showMoreMenu = false;
		}
	}
};
</script>

<style>
.bottom-navigation {
	height: 56px;
	min-height: 56px;
	background: var(--surface);
	border-top: 1px solid var(--border);
}

.bottom-navigation .v-btn {
	padding-top: 4px;
	padding-bottom: 4px;
	min-height: 56px;
}

.bottom-navigation .v-btn__content span {
	font-size: 12px;
	font-weight: 500;
	color: var(--muted);
}

.bottom-navigation .v-btn--active .v-btn__content span {
	color: var(--primary);
	font-weight: 600;
}

.bottom-navigation .v-icon {
	font-size: 20px;
	color: var(--muted);
}

.bottom-navigation .v-btn--active .v-icon {
	color: var(--primary);
}

.more-menu__card {
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: var(--radius-card);
	min-width: 250px;
	box-shadow: var(--shadow-float);
}

.more-menu__card .v-list-item {
	padding-left: 16px;
	padding-right: 16px;
}

.more-menu__logout {
	color: var(--negative);
}
</style>
