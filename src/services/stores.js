import { writable } from "svelte/store";

// propositions pour le département du jour
export const propositions = writable(localStorage.getItem("propositions") != null ? JSON.parse(localStorage.getItem("propositions")):[])

propositions.subscribe(val => localStorage.setItem("propositions", JSON.stringify(val)))

// département du jour
export const deptDuJour = writable(localStorage.getItem("deptDuJour") != null ? JSON.parse(localStorage.getItem("deptDuJour")):{})

deptDuJour.subscribe(val => localStorage.setItem("deptDuJour", JSON.stringify(val)))
