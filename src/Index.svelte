<script>
    /**
     * https://svelte.dev/repl/5734f123973d4682978427024ca90850?version=3.29.0
     */
    import { departements } from "./referentiel/departements.json";
    import DepartementAutocomplete from "./DepartementAutocomplete.svelte";
    import { onMount } from "svelte";
    import { chooseDepartementOfDay, computeResult, findDeptByName } from "./services/DepartementService";
    import DepartementSvg from "./DepartementSvg.svelte";
    import { propositions, deptDuJour } from "./services/stores";
    import Proposition from "./Proposition.svelte";

    let searchInput;
    let inputValue;
    let hiLiteIndex;

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

    const filterDepartements = () => {
        let matches = [];
        if (inputValue) {
            departements.forEach((departement) => {
                if (
                    departement.name.toLowerCase().startsWith(inputValue.toLowerCase()) ||
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

    const handleButtonClick = () => {
        let deptSuggestion = findDeptByName(inputValue);
        if (deptSuggestion != null) {
            let [victory, distance, direction] = computeResult(deptSuggestion, departementDuJour);
            // console.log("distance=" + distance)
            // console.log("arrow=" + direction)
            let tmp = $propositions;
            let proposition = {};
            proposition.number = numberEmojis[tmp.length + 1];
            proposition.value = deptSuggestion.name;
            proposition.distance = distance;
            proposition.victory = victory;
            proposition.arrow = direction;
            tmp.push(proposition);
            propositions.set(tmp);

            if(victory) {
                init()
                loop()
            }
        }
    };

    onMount(async () => {
        departementDuJour = chooseDepartementOfDay();
        console.log(departementDuJour);
        console.log($deptDuJour);

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
    });
</script>

<svelte:window on:keydown={navigateList} />

{#if departementDuJour}
    <DepartementSvg img={departementDuJour.svg} />
{/if}

{#each $propositions as proposition}
    <Proposition {proposition} />
{/each}

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
    <input type="submit" on:click|preventDefault={handleButtonClick} />

</form>

<style>
    div.autocomplete {
        /*the container must be positioned relative:*/
        position: relative;
        display: inline-block;
        width: 300px;
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
    input[type="submit"] {
        background-color: DodgerBlue;
        color: #fff;
    }

    #autocomplete-items-list {
        position: relative;
        margin: 0;
        padding: 0;
        top: 0;
        width: 297px;
        border: 1px solid #ddd;
        background-color: #ddd;
    }
</style>
