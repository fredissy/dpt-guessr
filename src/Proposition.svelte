<script>
    import { arrowDirection } from "./services/DepartementService"
    import { ListGroupItem } from 'sveltestrap'
    import Hint from "./Hint.svelte";
    export let proposition;
</script>


{#if proposition.hint}
    <Hint departement={proposition.departement} number={proposition.number}></Hint>
{:else}
    <ListGroupItem>
        <div class="w-100 justify-content-between">
            <span>
    #{proposition.number} : {proposition.value}
    {#if proposition.distance > 0}
        : {Math.round(proposition.distance)} km
    {/if}
</span>
<span>
    {#if proposition.victory}
        , Victoire 🎉 !
    {:else if proposition.failure}
        , Perdu 😓 !
    {:else}
        , {arrowDirection(proposition.angle)}
    {/if}
</span>
</div>
</ListGroupItem>

{/if}
