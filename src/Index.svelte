<script>
    /**
     * https://svelte.dev/repl/5734f123973d4682978427024ca90850?version=3.29.0
     */
    import { departements } from "./referentiel/departements.json";
    import DepartementAutocomplete from "./DepartementAutocomplete.svelte";
    import { onMount } from "svelte";
    import { chooseDepartementOfDay, computeResult, findDeptByName, MAX_TRIES } from "./services/DepartementService";
    import DepartementSvg from "./DepartementSvg.svelte";
    import { propositions, deptDuJour, scoreBoard } from "./services/stores";
    import Proposition from "./Proposition.svelte";
    import ShareButton from "./ShareButton.svelte";
    import Countdown from "./Countdown.svelte";

    let searchInput;
    let inputValue;
    let hiLiteIndex;
    let victory = false
   
    let filteredDepartements = [];

    let numberEmojis = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣" ];

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

    const navigateList = (e) => {
        if (
            e.key === "ArrowDown" &&
            hiLiteIndex <= filteredCountries.length - 1
        ) {
            hiLiteIndex === null ? (hiLiteIndex = 0) : (hiLiteIndex += 1);
        } else if (e.key === "ArrowUp" && hiLiteIndex !== null) {
            hiLiteIndex === 0
                ? (hiLiteIndex = filteredCountries.length - 1)
                : (hiLiteIndex -= 1);
        } else if (e.key === "Enter") {
            setInputVal(filteredCountries[hiLiteIndex]);
        } else {
            return;
        }
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
            proposition.angle = angle;
            tmp.push(proposition);
            propositions.set(tmp);
            updateVictory()
            prepareInput()

            if(victory) {
                $scoreBoard[tmp.length-1]++
            } else if($propositions.length == MAX_TRIES) {
                $scoreBoard[MAX_TRIES]++
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

<svelte:window on:keydown={navigateList} />


{#if departementDuJour}
    <DepartementSvg img={departementDuJour.svg} />
{/if}
<div class="bloc-propositions">
{#each $propositions as proposition}
    <Proposition {proposition} />
{/each}
</div>

{#if victory || $propositions.length == MAX_TRIES}
    <Countdown />
    <ShareButton propositions={$propositions} {victory}/>
{/if}

{#if $propositions.length < MAX_TRIES && !victory}
    
    <form autocomplete="off">
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
            <input
                id="departement-input"
                type="text"
                placeholder="Nom du département"
                bind:this={searchInput}
                bind:value={inputValue}
                on:input={filterDepartements}
            />
        </div>
        <button type="submit" class="button" on:click|preventDefault={handleButtonClick} >Proposer</button>
    </form>
{/if}


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
