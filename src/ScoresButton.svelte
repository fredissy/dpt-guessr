<script>
    import Fa from "svelte-fa/src/fa.svelte";
    import { faTrophy } from "@fortawesome/free-solid-svg-icons";
    import { Button, Modal } from "sveltestrap";
    import { scoreBoard } from "./services/stores";
    import { numberEmojis } from "./services/DepartementService";
    import { config } from "./referentiel/departements.json"

    let isOpen = false;
    const toggle = () => (isOpen = !isOpen);
</script>

<Button color="success" id="clipboard-button" on:click={toggle}>
    Voir les scores <Fa icon={faTrophy} />
</Button>

<Modal body {isOpen} {toggle} header="Historique des scores">
    {#each $scoreBoard as valeur, i }
        {#if i < config.max_tries }
            {numberEmojis[i+1]} : {valeur}
        {:else if i == config.max_tries}
        ☠️ : {valeur}
        {/if}
        <br/>
    {/each}
</Modal>
