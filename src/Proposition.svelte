<script>
    export let proposition;
</script>

<div>
    #{proposition.number} : {proposition.value}
    {#if proposition.distance > 0}
        : {Math.round(proposition.distance)} km,
    {/if}
    {proposition.arrow}
</div>
