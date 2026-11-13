<template>
	<div class="auth-shell">
		<div class="auth-shell__container">
			<div class="auth-shell__brand">
				<div class="auth-shell__icon">
					<i class="fas fa-shopping-cart"></i>
				</div>
				<h1 class="auth-shell__name">{{ title }}</h1>
				<p v-if="subtitle" class="auth-shell__subtitle">{{ subtitle }}</p>
			</div>
			<slot name="prelude" />
			<slot />
		</div>
	</div>
</template>

<script>
export default {
	name: 'AuthShell',
	props: {
		title: { type: String, default: '' },
		subtitle: { type: String, default: '' },
		center: { type: Boolean, default: true }
	}
};
</script>

<style>
.auth-shell {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--ground);
	padding: 24px;
}

.auth-shell__container {
	width: 100%;
	max-width: 420px;
}

.auth-shell__brand {
	text-align: center;
	margin-bottom: 32px;
}

.auth-shell__icon {
	width: 56px;
	height: 56px;
	background: var(--primary);
	border-radius: 14px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 20px;
}

.auth-shell__icon i {
	font-size: 24px;
	color: var(--on-primary);
}

.auth-shell__name {
	margin: 0;
	font-size: 28px;
	font-weight: 700;
	line-height: 1.2;
	color: var(--text);
	letter-spacing: -0.5px;
}

.auth-shell__subtitle {
	margin: 8px 0 0;
	font-size: 15px;
	color: var(--muted);
	line-height: 1.4;
}
</style>
