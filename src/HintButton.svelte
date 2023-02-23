<script>
    import Fa from "svelte-fa/src/fa.svelte";
    import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
    import { Button, Col, Modal, Row } from "sveltestrap";
    import { propositions, deptDuJour } from "./services/stores";
    import { numberEmojis } from "./services/DepartementService"

    export let departement
    export let number

    let isOpen = false;
    const toggle = () => (isOpen = !isOpen);
    

    const reject = () => {
        let dept = $deptDuJour
        dept.hintRejected = true
        deptDuJour.set(dept)
        isOpen = false
        return false
    }

    const hint = () => {
        let tmp = $propositions;
        let proposition = {};
        proposition.number = numberEmojis[number]
        proposition.hint = true
        proposition.departement = departement
        tmp.push(proposition)
        propositions.set(tmp)
        
        isOpen = false
    };
</script>
<div class="text-center">
<Button color="success" id="hint-button" on:click={toggle}>
    Révéler un indice <Fa icon={faLightbulb} {number} />
</Button>
</div>


<Modal body {isOpen} toggle={reject} header="Indice">
    <Row>
    Êtes-vous sûr de vouloir révéler un indice ? Cela comptera comme une tentative
    </Row>
    <Row class="text-center">
        <Col>
        <Button on:click={hint}>Oui</Button>
        </Col>
        <Col>
        <Button on:click={reject}>Non</Button>
    </Col>
    </Row>
</Modal>
