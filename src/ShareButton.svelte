<script>
    import seedrandom from "seedrandom"
    import { arrowDirection, clipboardShare } from "./services/DepartementService"
    import Fa from 'svelte-fa/src/fa.svelte'
    import { faCopy } from '@fortawesome/free-solid-svg-icons'
    import { Button } from 'sveltestrap'

    export let propositions
    export let victory

    const BEGIN_DATE = new Date(2023, 1, 14); // 1 is February ! Months begin at 0

    const gameNumber = () => {
        let now = new Date();
        let difference =Math.abs(now - BEGIN_DATE)
        let gameNumber = Math.ceil(difference / (1000 * 3600 * 24));
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
            if(proposition.hint) {
                content += `${proposition.number} : 💡 Indice révélé\n`
            } else {
                content += `${proposition.number} : `
                if(proposition.victory) {
                    content += `${emojiVictoryLost()} Victoire`
                } else {
                    content += `${Math.round(proposition.distance)} km : ${arrowDirection(proposition.angle)}\n`;
                }
            }
        });
        content += "\n";
        content += document.URL;

        return content
    }
</script>



        <Button
        color="success"
        id="clipboard-button"
            on:click={(e) => {clipboardShare(buildShareData, e.target.id )}}>
            Copier <Fa icon={faCopy} />
        </Button>

