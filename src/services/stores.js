import { writable } from "svelte/store";
import ls from 'localstorage-slim';

const PROPOSITIONS_KEY = 'propositions-ls'
const DEPT_DU_JOUR = 'deptDuJour-ls'

ls.config.encrypt = isProduction
ls.config.decrypt = isProduction

// propositions pour le département du jour
export const propositions = writable(ls.get(PROPOSITIONS_KEY) != null ? ls.get(PROPOSITIONS_KEY) : [])

propositions.subscribe(val => {
    ls.set(PROPOSITIONS_KEY, val)

})

// département du jour
export const deptDuJour = writable(ls.get(DEPT_DU_JOUR) != null ? ls.get(DEPT_DU_JOUR) : {})

deptDuJour.subscribe(val => {
    ls.set(DEPT_DU_JOUR, val)
})
