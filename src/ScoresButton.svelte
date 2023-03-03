<script>
    import Fa from "svelte-fa/src/fa.svelte";
    import { faCopy } from '@fortawesome/free-solid-svg-icons';
    import { faTrophy } from "@fortawesome/free-solid-svg-icons";
    import { Button, Modal } from "sveltestrap";
    import { scoreBoard } from "./services/stores";
    import { numberEmojis, clipboardShare } from "./services/DepartementService";
    import { config } from "./referentiel/departements.json"

    let isOpen = false;
    const toggle = () => (isOpen = !isOpen);

    const buildShareData = () => {
        let content = `Département game stats (${new Date().toLocaleDateString('fr-fr')}):\n`
        for(let i=0; i < $scoreBoard.length; i++) {
            if(i < config.max_tries) {
                content += `${numberEmojis[i]} : ${$scoreBoard[i]}\n`
            } else if (i == config.max_tries) {
                content += `☠️ : ${$scoreBoard[i]}`
            }
       }
       return content
    }
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
    <div class="text-center mt-3">
    <Button
        color="success"
        id="clipboard-scores"
        on:click={(e) => {clipboardShare(buildShareData, e.target.id )}}>
            Copier <Fa icon={faCopy} />
        </Button>
    </div>
</Modal>

<style>
    .text-center {
        width: 100%;
    }
</style>