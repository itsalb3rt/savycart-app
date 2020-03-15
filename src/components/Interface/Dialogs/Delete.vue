<template>
	<div>
		<v-dialog v-model="show" persistent full-width>
			<v-card>
				<v-card-title class="headline">{{ $t('products.delete_product_modal_title') }}</v-card-title>
				<v-card-text>{{ $t('products.delete_product_modal_message') }}</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="error" @click="$emit('confirm')">{{ $t('call_action_buttons.delete') }}</v-btn>
					<v-btn color="primary" flat @click="$emit('cancel')">{{ $t('products.keep_item') }}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>
<script>
export default {
	props:['show']
};
</script>