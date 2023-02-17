<script>
    export let proposition;
</script>


<div class="proposition">
    #{proposition.number} : {proposition.value}
    {#if proposition.distance > 0}
        : {Math.round(proposition.distance)} km,
    {/if}
    {proposition.arrow}
</div>

<style>
    div.proposition {
        border: 1px solid black;
        border-radius: 5px;
        padding: 3px 3px;
        margin-bottom: 2px;
    }
</style>