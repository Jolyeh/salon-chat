<script>
	import favicon from "$lib/assets/favicon.ico";
	import app_touch from "$lib/assets/apple-touch-icon.png";
	import "../app.css";


	let { children } = $props();
</script>

<svelte:head>
	<link rel="shortcut icon" href="{favicon}" type="image/x-icon" />
	<link rel="apple-touch-icon" href="{app_touch}" />
	<link rel="rel" href="{favicon}" />
</svelte:head>

{@render children?.()}
