<script>
    export let itemLabel;
</script>

<li class="autocomplete-items" on:click>
    {@html itemLabel}
</li>

<style>
    li.autocomplete-items {
        list-style: none;
        border-bottom: 1px solid #d4d4d4;
        z-index: 99;
        /*position the autocomplete items to be the same width as the container:*/
        top: 100%;
        left: 0;
        right: 0;
        padding: 10px;
        cursor: pointer;
        background-color: #fff;
    }
    
    li.autocomplete-items:hover {
        /*when hovering an item:*/
        background-color: #88aadd;
        color: white;
    }
</style>
