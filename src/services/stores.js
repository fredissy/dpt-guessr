import { writable } from "svelte/store";

// propositions pour le département du jour
export const propositions = writable(localStorage.getItem("propositions") != null ? JSON.parse(localStorage.getItem("propositions")):[])

propositions.subscribe(val => localStorage.setItem("propositions", JSON.stringify(val)))

// département du jour
export const deptForPropositions = writable(localStorage.getItem("deptDuJour") || "")