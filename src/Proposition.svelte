<script>
    import { arrowDirection } from "./services/DepartementService"
    import { ListGroupItem } from 'sveltestrap'
    export let proposition;
</script>


<!-- <div class="proposition"> -->
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
<!-- </div> -->

<style>
    div.proposition {
        border: 1px solid #405d27;
        border-radius: 5px;
        padding: 3px 3px;
        margin-bottom: 2px;
        background-color: #82b74b;
    }
</style>