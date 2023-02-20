<script>
    import { Image } from 'sveltestrap'
    export let img;
</script>

<Image class="departement-image" src="images/departements/{img}" alt="Departement of the day" />

<!-- <img class="departement-image" src="images/departements/{img}" alt="Departement of the day" /> -->

<style>
    :global(.departement-image) {
        width: 100%;
    }
</style>