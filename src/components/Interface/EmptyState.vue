<template>
	<div class="empty-state" :class="{ 'empty-state--inline': inline }">
		<v-icon v-if="icon" class="empty-state__icon" :size="inline ? 32 : 48">
			{{ icon }}
		</v-icon>
		<p class="empty-state__title">{{ title }}</p>
		<p v-if="$slots.default" class="empty-state__detail"><slot /></p>
		<div v-if="$slots.action" class="empty-state__action">
			<slot name="action" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'EmptyState',
	props: {
		icon: { type: String, default: '' },
		title: { type: String, required: true },
		inline: { type: Boolean, default: false }
	}
};
</script>

<style>
.empty-state {
	text-align: center;
	padding: 48px 16px;
	color: var(--muted);
}

.empty-state--inline {
	padding: 24px 16px;
}

.empty-state__icon {
	display: block;
	margin: 0 auto 12px;
	color: var(--muted);
	opacity: 0.7;
}

.empty-state__title {
	margin: 0;
	font-size: 16px;
	font-weight: 500;
	color: var(--muted);
}

.empty-state__detail {
	margin: 8px 0 0;
	font-size: 14px;
	color: var(--muted);
}

.empty-state__action {
	margin-top: 16px;
}
</style>
