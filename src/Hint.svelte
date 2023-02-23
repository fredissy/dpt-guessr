<script>
    import { arrowDirection } from "./services/DepartementService"
    import { ListGroupItem } from "sveltestrap";

    export let number;
    export let departement;
</script>

<ListGroupItem>
    <div class="w-100 justify-content-between">
        <span>
            #{number} : 💡 Indice : {departement.name.substring(0, 1)}{" .".repeat(departement.name.length - 1)}
        </span>
        <span>

        </span>
    </div>
</ListGroupItem>
