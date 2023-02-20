<script>
    import ShareButton from "./ShareButton.svelte";
    import ScoresButton from "./ScoresButton.svelte";
    export let propositions;
    export let victory;
</script>

<div class="text-center mt-3">
    <ShareButton {propositions} {victory} />
    <ScoresButton />
</div>

<style>
    .text-center {
        width: 100%;
    }
</style>