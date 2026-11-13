<template>
	<div>
		<!-- Bottom navigation for main screens -->
		<BottomNavigation v-if="!this.$route.meta.isSubDir" />
	</div>
</template>

<script>
import BottomNavigation from '@/components/BottomNavigation.vue';

export default {
	components: {
		BottomNavigation
	},
	props: {
		title: ''
	}
};
</script>
<style lang="css">
/* TheMenu.vue now only wraps BottomNavigation component */
</style>
