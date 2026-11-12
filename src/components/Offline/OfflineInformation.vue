<template>
	<div class="offline-info text-center">
		<font-awesome-icon icon="wifi" class="offline-info__icon" />
		<p class="offline-info__title">{{ $t('messages.internet_conection_lost') }}</p>
		<p class="offline-info__detail">{{ $t('messages.intenet_required') }}</p>
	</div>
</template>

<style>
.offline-info {
	padding: 48px 16px;
	color: var(--muted);
}

.offline-info__icon {
	font-size: 40px;
	color: var(--muted);
	opacity: 0.7;
	margin-bottom: 12px;
}

.offline-info__title {
	margin: 0;
	font-size: 16px;
	font-weight: 500;
	color: var(--text);
}

.offline-info__detail {
	margin: 8px 0 0;
	font-size: 14px;
	color: var(--muted);
}
</style>
