import { writable } from "svelte/store";
import { config } from "../referentiel/departements.json"

import ls from 'localstorage-slim';

const PROPOSITIONS_KEY = 'propositions-ls'
const DEPT_DU_JOUR_KEY = 'deptDuJour-ls'
const SCORES_KEY = 'scores-ls'

ls.config.encrypt = isProduction
ls.config.decrypt = isProduction

// propositions pour le département du jour
export const propositions = writable(ls.get(PROPOSITIONS_KEY) != null ? ls.get(PROPOSITIONS_KEY) : [])

propositions.subscribe(val => {
    ls.set(PROPOSITIONS_KEY, val)

})

// département du jour
export const deptDuJour = writable(ls.get(DEPT_DU_JOUR_KEY) != null ? ls.get(DEPT_DU_JOUR_KEY) : {})

deptDuJour.subscribe(val => {
    ls.set(DEPT_DU_JOUR_KEY, val)
})

// scores :
export const scoreBoard = writable(ls.get(SCORES_KEY) != null ? ls.get(SCORES_KEY) :new Array(config.max_tries + 1).fill(0)) //+1 to store nb of defeats

scoreBoard.subscribe(val => {
    ls.set(SCORES_KEY, val)
})
