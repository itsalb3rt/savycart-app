<template>
	<v-dialog max-width="400px" v-model="show" persistent>
		<v-card>
			<v-card-title class="headline">{{headerMessage || $t('products.delete_product_modal_title') }}</v-card-title>
			<v-card-text>{{ bodyMessage || $t('products.delete_product_modal_message') }}</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn class="delete" color="error" @click="$emit('confirm')">{{ confirmMessage || $t('call_action_buttons.delete') }}</v-btn>
				<v-btn class="cancel" color="primary" text @click="$emit('cancel')">{{ cancelMessage || $t('products.keep_item') }}</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
export default {
	props:['show','headerMessage', 'bodyMessage', 'confirmMessage', 'cancelMessage'],
};
</script>