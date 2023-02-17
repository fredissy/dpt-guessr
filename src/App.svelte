<script>
    import Index from "./Index.svelte";
</script>

<div class="container">
    <div class="app">
        <Index />
    </div>
    <canvas id="canvas"></canvas>
</div>

<style>
    .container {
        position: relative;
    }
    .app, canvas {
        position: absolute;
    }
</style>
