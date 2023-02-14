<script>
    /**
     * https://svelte.dev/repl/5734f123973d4682978427024ca90850?version=3.29.0
     */
    import { departements } from "./referentiel/departements.json";
    import DepartementAutocomplete from "./DepartementAutocomplete.svelte";
    import { onMount } from "svelte";
    import { chooseDepartementOfDay, computeResult, findDeptByName } from "./services/DepartementService";
    import DepartementPng from "./DepartementPng.svelte";

    let searchInput;
    let inputValue;
    let hiLiteIndex;

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

    const filterDepartements = () => {
        let matches = [];
        if (inputValue) {
            departements.forEach((departement) => {
                if (
                    departement.name
                        .toLowerCase()
                        .startsWith(inputValue.toLowerCase())
                        ||
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
        let deptSuggestion = findDeptByName(inputValue)
        if(deptSuggestion != null) {
            let [victory, distance, direction] = computeResult(deptSuggestion, departementDuJour)
            console.log("distance=" + distance)
            console.log("arrow=" + direction)
        }
    }


    onMount(async () => {
        departementDuJour = chooseDepartementOfDay();
        console.log(departementDuJour);
    });
</script>

<svelte:window on:keydown={navigateList} />

{#if departementDuJour}
    <DepartementPng img={departementDuJour.svg} />
{/if}
<form autocomplete="off">
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
    <input type="submit" on:click|preventDefault={handleButtonClick}/>
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
