<script>
    /**
     * https://svelte.dev/repl/5734f123973d4682978427024ca90850?version=3.29.0
     */
    import { departements, config } from "./referentiel/departements.json";
    import DepartementAutocomplete from "./DepartementAutocomplete.svelte";
    import { onMount } from "svelte";
    import { chooseDepartementOfDay, computeResult, findDeptByName, numberEmojis } from "./services/DepartementService";
    import DepartementSvg from "./DepartementSvg.svelte";
    import { propositions, deptDuJour, scoreBoard } from "./services/stores";
    import Proposition from "./Proposition.svelte";
    import ResultButtonBar from "./ResultButtonsBar.svelte";
    import Countdown from "./Countdown.svelte";
    import Fa from 'svelte-fa/src/fa.svelte'
    import { faComment } from '@fortawesome/free-solid-svg-icons'
    import { Form, Button, ListGroup, Container, Row, Col } from 'sveltestrap'
    import HintButton from "./HintButton.svelte";
    import Result from "./Result.svelte"

    let departementDuJour;
    let searchInput;
    let inputValue;
    let hiLiteIndex;
    let victory = false

    let filteredDepartements = [];

  

    $: if (!inputValue) {
        filteredDepartements = [];
        hiLiteIndex = null;
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

{#if $propositions && $propositions.length > 0}
<Row>
    <Col>
    <ListGroup>
        {#each $propositions as proposition}
            <Proposition {proposition} />
        {/each}
        {#if !victory && $propositions.length == config.max_tries}
            <Result />
        {/if}
    </ListGroup>
</Col>
</Row>
{/if}

{#if !victory && $propositions.length == config.hint_after && !$deptDuJour.hintRejected && $deptDuJour.displayHintButton}
<Row class="mt-1">
    <Col>
        <HintButton departement={departementDuJour} number={$propositions.length+1}/>
    </Col>
</Row>
{/if}

{#if victory || $propositions.length == config.max_tries}
    <Countdown />
    <div class="formControls">
        <ResultButtonBar propositions={$propositions} {victory}/>
    </div>
{/if}

{#if $propositions.length < config.max_tries && !victory}
{#if filteredDepartements.length > 0}
    <ul id="autocomplete-items-list">
        {#each filteredDepartements as departement, i}
        <!-- {#if i == config.hint_after }
            <Hint departement={departementDuJour} />
        {:else} -->
            <DepartementAutocomplete
                itemLabel={departement}
                on:click={() => {
                    setInputVal(departement);
                }}
            />
        <!-- {/if} -->
        {/each}
    </ul>
{/if}
<Row class="mt-3">
    <Col>
        <Form autocomplete="off">
            <div class="formControls">
            
                <div class="autocomplete">
                     <input
                     id="departement-input"
                     type="text"
                     class="form-control"
                     placeholder="Nom du département"
                     bind:this={searchInput}
                     bind:value={inputValue}
                     on:input={filterDepartements}
                 />
                </div>
                <Button type="button"
                        class="button btn btn-secondary"
                        on:click={(e) => {
                            e.preventDefault()
                            handleButtonClick()}} >
                    Proposer
                    <Fa icon={faComment}/>
                </Button>
            </div>
        </Form>
    </Col>
</Row>
{/if}
</Container>


<style>
    div.autocomplete {
        position: relative;
        display: inline-block;
        width: 50%;
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
    div.formControls {
        display: flex;
        align-items: center;
    }

    :global(.list-group-item:nth-of-type(odd)) {
      background-color: #eee;
    }

    :global(.list-group-item:nth-of-type(even)) {
      background-color: #fff;
    }
</style>
