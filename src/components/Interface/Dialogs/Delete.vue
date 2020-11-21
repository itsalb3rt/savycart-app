<template>
	<v-dialog max-width="400px" v-model="show" persistent>
		<v-card>
			<v-card-title class="headline">{{ $t('products.delete_product_modal_title') }}</v-card-title>
			<v-card-text>{{ $t('products.delete_product_modal_message') }}</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="error" @click="$emit('confirm')">{{ $t('call_action_buttons.delete') }}</v-btn>
				<v-btn color="primary" text @click="$emit('cancel')">{{ $t('products.keep_item') }}</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
export default {
	props:['show']
};
</script>