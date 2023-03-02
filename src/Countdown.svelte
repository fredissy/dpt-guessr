<script>

    let now = new Date();
    let tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    let tomorrowTIme = tomorrow.getTime()
    let diff = 0

    setInterval(() => {
        diff = Math.floor((tomorrowTIme - new Date().getTime()) / 1000);
    }, 1000);

    $: hours = Math.floor(diff / 3600);
    $: minutes = Math.floor((diff - hours * 3600)/60);
    $: secondes = Math.floor(diff - hours*3600 - minutes*60);

    $: hoursLabel = hours > 1 ? "heures" : "heure";
    $: minsLabel = minutes > 1 ? "minutes" : "minute";
    $: secLabel = secondes > 1 ? "secondes" : "seconde";
</script>



{#if diff > 0}
<div class="countdown">
    Prochain jeu disponible dans:
    <br>
    {#if hours > 0}
        {hours} {hoursLabel}
    {/if}
    {minutes} {minsLabel} {secondes} {secLabel}
    
</div>
{/if}

<style>
    .countdown {
        text-align: center;
    }
</style>
