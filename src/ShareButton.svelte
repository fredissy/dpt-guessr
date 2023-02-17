<script>
    export let propositions;

    const BEGIN_DATE = new Date(2023, 1, 14); // 1 is February ! Months begin at 0

    const gameNumber = () => {
        let now = new Date(new Date().toDateString());
        let difference = now.getTime() - BEGIN_DATE.getTime();
        console.log(difference);
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
    on:click={() => {
        share();
    }}>Partager mon résultat</button
>

<style>
    button {
        letter-spacing: 1px;
        border-style: none;
        text-shadow: 0 0 0 rgba(0, 0, 0, 0);
        font-size: 1.125rem;
        font-weight: 600;
        text-transform: uppercase;
        margin: 0.5em 0 auto;
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: center;
        background-color: #405d27;
        color: #ffffff;
        border-radius: 4px;
    }
</style>
