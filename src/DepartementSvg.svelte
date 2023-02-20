<script>
    import { Image } from 'sveltestrap'
    export let img;
</script>

<Image class="departement-image mb-3 mt-2" src="images/departements/{img}" alt="Departement of the day" />

<style>
    :global(.departement-image) {
        width: 100%;
    }
</style>