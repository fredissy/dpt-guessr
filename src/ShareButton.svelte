<script>
    import seedrandom from "seedrandom"
    import { arrowDirection } from "./services/DepartementService"
    import Fa from 'svelte-fa/src/fa.svelte'
    import { faCopy } from '@fortawesome/free-solid-svg-icons'
    import { Button } from 'sveltestrap'

    export let propositions
    export let victory

    const BEGIN_DATE = new Date(2023, 1, 14); // 1 is February ! Months begin at 0

    const gameNumber = () => {
        let now = new Date(new Date().toDateString());
        let difference = now.getTime() - BEGIN_DATE.getTime();
        let gameNumber = difference / (1000 * 3600 * 24);
        return gameNumber;
    };

    export const emojiVictoryLost = () => {
        let emojiVictory = ["😁", "🤩", "😍", "😎", "🏆", "🥇"]
        let emojiLost = ["🥴", "😵‍💫", "🥺", "😭", "☠️", "💩"]

        let emojiSet = victory?emojiVictory:emojiLost;

        let random = seedrandom(2+new Date().toLocaleDateString('fr-fr'))
        let rand = Math.floor(emojiSet.length * random())
        // console.log("Département du jour=" + departements[rand].name)
        return emojiSet[rand]
    }

    const buildShareData = () => {
        let content = `Département game #${gameNumber()} (${new Date().toLocaleDateString("fr-FR")}) ${emojiVictoryLost()}\n`;
        propositions.forEach((proposition) => {
            content += `${proposition.number} : `
            if(proposition.victory) {
                content += emojiVictoryLost()
            } else {
                content += `${Math.round(proposition.distance)} km : ${arrowDirection(proposition.angle)}\n`;
            }
        });
        content += "\n";
        content += document.URL;

        return content
    }

    const clipboardShare = () => {
        let content = buildShareData()

        let button = document.getElementById('clipboard-button')
        // on supprime l'icône du bouton copier :
        if(button.firstElementChild) {
            button.removeChild(button.firstElementChild)
        }

        navigator.clipboard.writeText(content).then(
            () => {
                document.getElementById('clipboard-button').firstChild.data='Copié dans le presse-papier'
            },
            () => {
                document.getElementById('clipboard-button').firstChild.data='Erreur lors de la copie dans le presse-papier'
            }
        )
    };
</script>

    <div class="text-center mt-3">

        <Button
        color="success"
        id="clipboard-button"
            on:click={() => {
                clipboardShare();
            }}>
            Copier <Fa icon={faCopy} />
        </Button>

</div>

<style>
    .text-center {
        width: 100%;
    }
</style>