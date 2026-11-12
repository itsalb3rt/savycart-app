<template>
	<div class="page-header">
		<div class="page-header__row">
			<div class="page-header__text">
				<h1 class="page-header__title">{{ title }}</h1>
				<p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
			</div>
			<div v-if="$slots.actions" class="page-header__actions">
				<slot name="actions" />
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'PageHeader',
	props: {
		title: { type: String, required: true },
		subtitle: { type: String, default: '' }
	}
};
</script>

<style>
.page-header {
	margin-bottom: 20px;
}

.page-header__row {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 12px;
	flex-wrap: wrap;
}

.page-header__title {
	margin: 0;
	font-size: 24px;
	font-weight: 600;
	line-height: 1.3;
	color: var(--text);
	letter-spacing: 0;
}

.page-header__subtitle {
	margin: 4px 0 0;
	font-size: 14px;
	line-height: 1.5;
	color: var(--muted);
}

.page-header__actions {
	display: flex;
	align-items: center;
	gap: 8px;
	flex-shrink: 0;
}
</style>
