<script>
    export let propositions;

    const BEGIN_DATE = new Date(2023, 1, 14); // 1 is February ! Months begin at 0

    const gameNumber = () => {
        let now = new Date(new Date().toDateString());
        let difference = now.getTime() - BEGIN_DATE.getTime();
        let gameNumber = difference / (1000 * 3600 * 24);
        return gameNumber;
    };

    const share = () => {
        let content = `Département game #${gameNumber()} (${new Date().toLocaleDateString(
            "fr-FR"
        )})\n`;
        propositions.forEach((proposition) => {
            content += `${proposition.number} : ${Math.round(
                proposition.distance
            )} : ${proposition.arrow}\n`;
        });
        content += "\n";
        content += document.URL;

        // console.log(content);

        navigator.clipboard.writeText(content);
    };
</script>

<button
class="button"
    on:click={() => {
        share();
    }}>Partager mon résultat</button
>
