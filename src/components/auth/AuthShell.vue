<template>
	<div class="auth-shell">
		<div class="auth-shell__brand" :class="{ 'auth-shell__brand--left': !center }">
			<h1 class="auth-shell__name">SavyCart</h1>
			<p class="auth-shell__tagline">{{ $t('auth.tagline') }}</p>
		</div>
		<slot name="prelude" />
		<div class="auth-shell__section">
			<h2 v-if="title" class="auth-shell__heading">
				<span class="auth-shell__heading-text">{{ title }}</span>
			</h2>
			<slot />
		</div>
	</div>
</template>

<script>
export default {
	name: 'AuthShell',
	props: {
		title: { type: String, default: '' },
		center: { type: Boolean, default: true }
	}
};
</script>

<style>
.auth-shell {
	/* no app-bar on auth routes — replaces the old .main-app-container top pad */
	padding-top: 40px;
}

.auth-shell__brand {
	text-align: center;
	margin-bottom: 8px;
}

.auth-shell__brand--left {
	text-align: left;
}

.auth-shell__name {
	margin: 0;
	font-size: 48px;
	font-weight: 400;
	line-height: 1.04;
	color: var(--primary);
	letter-spacing: 0;
}

.auth-shell__tagline {
	margin: 8px 0 0;
	font-size: 14px;
	color: var(--warning);
}

.auth-shell__section {
	max-width: 500px;
	margin: 0 auto;
}

.auth-shell__heading {
	width: 100%;
	margin: 24px 0 20px;
	padding: 0;
	line-height: 1;
	text-align: center;
	border-bottom: 1px solid var(--border);
	font-size: 14px;
	font-weight: 400;
	color: var(--text);
}

.auth-shell__heading-text {
	display: inline-block;
	padding: 0 12px;
	background: var(--ground);
	font-weight: 600;
	color: var(--text);
	transform: translateY(0.5em);
}
</style>
