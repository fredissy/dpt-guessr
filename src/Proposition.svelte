<script>
    import { arrowDirection } from "./services/DepartementService"
    export let proposition;
</script>


<div class="proposition">
    #{proposition.number} : {proposition.value}
    {#if proposition.distance > 0}
        : {Math.round(proposition.distance)} km,
    {/if}
    {#if proposition.victory}
        🎉
    {:else}
        {arrowDirection(proposition.angle)}
    {/if}
</div>

<style>
    div.proposition {
        border: 1px solid #405d27;
        border-radius: 5px;
        padding: 3px 3px;
        margin-bottom: 2px;
        background-color: #82b74b;
    }
</style>