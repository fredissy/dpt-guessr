<script>
    import Index from "./Index.svelte";
    import { Styles } from 'sveltestrap'
</script>

<div class="app">
    <Styles />
    <Index />
</div>

<style>
    @media screen and (min-width: 800px) {
        .app {
            width: 500px;
            margin: auto;
        }
    }
</style>
