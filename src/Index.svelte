<script>
    /**
     * https://svelte.dev/repl/5734f123973d4682978427024ca90850?version=3.29.0
     */
    import { departements, config } from "./referentiel/departements.json";
    import DepartementAutocomplete from "./DepartementAutocomplete.svelte";
    import { onMount } from "svelte";
    import { chooseDepartementOfDay, computeResult, findDeptByName } from "./services/DepartementService";
    import DepartementSvg from "./DepartementSvg.svelte";
    import { propositions, deptDuJour, scoreBoard } from "./services/stores";
    import Proposition from "./Proposition.svelte";
    import ShareButton from "./ShareButton.svelte";
    import Countdown from "./Countdown.svelte";
    import Fa from 'svelte-fa/src/fa.svelte'
    import { faComment } from '@fortawesome/free-solid-svg-icons'
    import { Button, Form, Input, ListGroup, Container, Row, Col } from 'sveltestrap'



    let searchInput;
    let inputValue;
    let hiLiteIndex;
    let victory = false
   
    let filteredDepartements = [];

    let numberEmojis = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣" ];

    $: if (!inputValue) {
        filteredDepartements = [];
        hiLiteIndex = null;
    } else {
        filterDepartements();
    }

    const setInputVal = (departementLabel) => {
        inputValue = departementLabel;
        filteredDepartements = [];
        hiLiteIndex = null;
        document.querySelector("#departement-input").focus();
    };

    const prepareMatch = (input, result) => {
        return result;
    };

    const updateVictory = () => {
        victory = false
        $propositions.forEach((proposition) => {
            if(proposition.victory) {
                victory = true
            }
        })
    }

    const filterDepartements = () => {
        let matches = [];
        if (inputValue) {
            departements.forEach((departement) => {
                if (
                    departement.name.toLowerCase().startsWith(inputValue.toLowerCase().replaceAll(' ', '-')) ||
                    departement.code.toString().startsWith(inputValue.toLowerCase())
                ) {
                    matches = [
                        ...matches,
                        prepareMatch(inputValue, departement.name),
                    ];
                }
            });
        }
        filteredDepartements = matches;
    };

    let departementDuJour;

    const prepareInput = () => {
        if($propositions.length < 5) {
            inputValue = null;
            document.getElementById("departement-input").focus()
        }
    }

    const handleButtonClick = () => {
        let deptSuggestion = findDeptByName(inputValue);
        if (deptSuggestion != null) {
            let [victory, distance, angle] = computeResult(deptSuggestion, departementDuJour);
            // console.log("distance=" + distance)
            // console.log("arrow=" + direction)
            let tmp = $propositions;
            let proposition = {};
            proposition.number = numberEmojis[tmp.length + 1];
            proposition.value = deptSuggestion.name;
            proposition.distance = distance;
            proposition.victory = victory;
            proposition.failure = (!victory && $propositions.length+1 == config.max_tries)
            proposition.angle = angle;
            tmp.push(proposition);
            propositions.set(tmp);
            updateVictory()
            prepareInput()

            if(victory) {
                $scoreBoard[tmp.length-1]++
            } else if($propositions.length == config.max_tries) {
                $scoreBoard[config.max_tries]++
            }
        }
    };

    onMount(async () => {
        departementDuJour = chooseDepartementOfDay();
        if (!$deptDuJour) {
            deptDuJour.set(departementDuJour);
            propositions.set([]);
        } else {
            // reset si département du jour a changé :
            if (
                $deptDuJour &&
                $deptDuJour.code != departementDuJour.code
            ) {
                console.log("Appel reset dept du jour et propositions");
                deptDuJour.set(departementDuJour);
                propositions.set([]);
            }
        }
        updateVictory()
        prepareInput()
        });
</script>

<Container>
    {#if departementDuJour}
    <Row>
        <Col>
            <DepartementSvg img={departementDuJour.svg} />
        </Col>
    </Row>
    {/if}
    {filteredDepartements.length}
{#if $propositions && $propositions.length > 0}
<Row>
    <Col>
<!-- <div class="bloc-propositions"> -->
    <ListGroup>
        {#each $propositions as proposition}
            <Proposition {proposition} />
        {/each}
    </ListGroup>
</Col>
</Row>
<!-- </div> -->
{/if}

{#if victory || $propositions.length == config.max_tries}
    <Countdown />
    <ShareButton propositions={$propositions} {victory}/>
{/if}

{#if $propositions.length < config.max_tries && !victory}
<Row class="mt-3">
    <Col>
    <Form autocomplete="off">
        {#if filteredDepartements.length > 0}
            <ul id="autocomplete-items-list">
                {#each filteredDepartements as departement}
                    <DepartementAutocomplete
                        itemLabel={departement}
                        on:click={() => {
                            setInputVal(departement);
                        }}
                    />
                {/each}
            </ul>
        {/if}
        <div class="autocomplete">
            <Input id="departement-input"
            type="text"
            placeholder="Nom du département"
            bind:this={searchInput}
            bind:value={inputValue}
            ></Input>

        </div>
        <Button type="submit" on:click={(event) => {
            event.preventDefault();
            handleButtonClick()
            }}>
            Proposer <Fa icon={faComment}/>
        </Button>

    </Form>
    </Col>
</Row>
{/if}
</Container>


<style>
    div.autocomplete {
        /*the container must be positioned relative:*/
        position: relative;
        display: inline-block;
        width: 50%;
    }
    div.bloc-propositions {
        margin-bottom: 15px;
    }
    input {
        border: 1px solid transparent;
        background-color: #f1f1f1;
        padding: 10px;
        font-size: 16px;
        margin: 0;
    }
    input[type="text"] {
        background-color: #f1f1f1;
        width: 100%;
    }

    #autocomplete-items-list {
        position: relative;
        z-index: 1000;
        margin: 0;
        padding: 0;
        top: 0;
        width: 297px;
        border: 1px solid #ddd;
        background-color: #ddd;
    }
</style>
