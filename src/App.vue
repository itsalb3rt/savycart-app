<template>
	<v-app class="constrain main-app-container">
		<MenuComponent :title="$route.meta.title" v-if="$store.getters['auth/getIsLogged']" />
		<v-main>
			<transition
				:name="transitionName"
				mode="out-in"
				@beforeLeave="beforeLeave"
				@enter="enter"
				@afterEnter="afterEnter"
			>
				<v-container>
					<router-view />
				</v-container>
			</transition>
		</v-main>
		<!-- @detected-condition fires when the connectivity status of the device changes -->
		<offline @detected-condition="handleConnectivityChange"></offline>
		<v-snackbar
			:value="$store.state.snackbar.snackbar.show"
			:multi-line="$store.state.snackbar.snackbar.multiLine"
			:top="$store.state.snackbar.snackbar.top === 'top'"
			:bottom="$store.state.snackbar.snackbar.bottom === 'bottom'"
			:color="$store.state.snackbar.snackbar.color"
		>
			{{ $store.state.snackbar.snackbar.message }}
			<v-btn v-if="$store.state.snackbar.snackbar.showClose" dark text @click="$store.commit('snackbar/setSnackbarShow', false)">Cerrar</v-btn>
		</v-snackbar>
	</v-app>
</template>

<script>
import MenuComponent from './components/TheMenu.vue';
import offline from 'v-offline';
import { mapMutations, mapState } from 'vuex';
import 'vue-loading-overlay/dist/vue-loading.css';
import i18n from './i18n';

const DEFAULT_TRANSITION = 'fade';

export default {
	created() {

		const localStorageLanguage = window.localStorage.getItem('language');
		if (!localStorageLanguage) {
			const userLanguage = navigator.language || navigator.userLanguage;
			if (userLanguage.includes('es')) {
				i18n.locale = 'es';
			} else {
				i18n.locale = 'en';
			}
		}

		this.$router.beforeEach((to, from, next) => {
			let transitionName = to.meta.transitionName || from.meta.transitionName;

			if (transitionName === 'slide') {
				const toDepth = to.path.split('/').length;
				const fromDepth = from.path.split('/').length;
				transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
			}

			this.transitionName = transitionName || DEFAULT_TRANSITION;

			next();
		});
	},
	components: {
		MenuComponent,
		offline
	},
	methods: {
		...mapMutations(['setOnline']),
		handleConnectivityChange(status) {
			this.setOnline(status);
		},
		beforeLeave(element) {
			this.prevHeight = getComputedStyle(element).height;
		},
		enter(element) {
			const { height } = getComputedStyle(element);

			element.style.height = this.prevHeight;

			setTimeout(() => {
				element.style.height = height;
			});
		},
		afterEnter(element) {
			element.style.height = 'auto';
		}
	},
	data() {
		return {
			transitionName: DEFAULT_TRANSITION
		};
	}
};
</script>
<style>
 * {
      touch-action: manipulation;
  }
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
	transition-duration: 0.2s;
	transition-property: height, opacity, transform;
	transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
	overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
	opacity: 0;
	transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
	opacity: 0;
	transform: translate(-2em, 0);
}
@font-face {
	font-family: Open-Sans;
	src: url('~@/assets/fonts/open_Sans/OpenSans-Regular.ttf'),
		url('~@/assets/fonts/open_Sans/OpenSans-Bold.ttf');
}
#app {
	font-family: Open-Sans;
}
.constrain{
	max-width: 900px;
	margin: auto;
}
.main-app-container{
    padding-top: 40px;
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
}
</style>