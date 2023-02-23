<script>
    import { deptDuJour } from "./services/stores";
    import { ListGroupItem } from 'sveltestrap'
</script>

<ListGroupItem>
    <div class="w-100 justify-content-between">
        <span>
            📌 {$deptDuJour.name}
        </span>
    </div>
</ListGroupItem>
