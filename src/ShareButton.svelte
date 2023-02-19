<script>
    import seedrandom from "seedrandom"
    import { arrowDirection } from "./services/DepartementService"

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
    const share = () => {
        let shareData = {
            title: "Guess département",
            text: buildShareData(),
            url: document.URL
        }

        navigator.share(shareData).then(
            () => {
                document.getElementById('share-button').firstChild.data='Partagé'
            },
            () => {
                document.getElementById('share-button').firstChild.data='Erreur lors de l\'appel du partage'
            }
        )
    }

    const clipboardShare = () => {
        let content = buildShareData()

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

{#if navigator.share }
    <button
    class="button"
    id="share-button"
        on:click={() => {
            share();
        }}>Partager mon résultat</button
    >   
{/if}

<button
class="button"
id="clipboard-button"
    on:click={() => {
        clipboardShare();
    }}>Copier</button
>
