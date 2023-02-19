const seedrandom = require('seedrandom')
const generator = seedrandom('[your seed here]')
const randomNumber = generator()

const json = require("../referentiel/departements.json")

let departements = json.departements

const chooseDepartementOfDay = (seed) => {
    console.log(seed)
    let random = seedrandom(seed)
    let rand = Math.floor(departements.length * random())
    // console.log("Département du jour=" + departements[rand].name)
    return departements[rand]
}

for(let i=0;i < 10; i++) {
    let seed = new Date()
    seed.setDate(seed.getDate() + i)
    console.log(chooseDepartementOfDay(seed.toLocaleDateString('fr-fr')).name)
    console.log("-----------");
}
