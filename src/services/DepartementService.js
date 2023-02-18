import seedrandom from "seedrandom"
import { departements } from "../referentiel/departements.json"

export const chooseDepartementOfDay = () => {
    let random = seedrandom(new Date().toLocaleDateString('fr-fr'))
    let rand = Math.floor(departements.length * random())
    // console.log("Département du jour=" + departements[rand].name)
    return departements[rand]
}

const radians = (n) => {
    return Math.PI * n / 180
}
const degrees = (n) => {
    return n * 180 / Math.PI
}

/**
 * Computes distance between 2 points
 * @param {*} lat1 
 * @param {*} lng1 
 * @param {*} lat2 
 * @param {*} lng2 
 * @returns distance in km
 */
const computeDistance = (lat1, lng1, lat2, lng2) => {
    const EARTH_DIAMETER = 6371

    let part1 = Math.sin(radians(lat1)) * Math.sin(radians(lat2))
    let part2 = Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.cos(radians(lng1 - lng2))
    let acos = Math.acos(part1 + part2)

    let result = acos * EARTH_DIAMETER
    // console.log("distance = " + result)

    return result
}

/*
 * Inspired from https://www.movable-type.co.uk/scripts/latlong.html
 */
const computeBearing = (lat1, lng1, lat2, lng2) => {
    lat1 = radians(lat1)
    lng1 = radians(lng1)
    lat2 = radians(lat2)
    lng2 = radians(lng2)
    const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
    const b = Math.atan2(y, x);
    const brng = (b * 180 / Math.PI + 360) % 360; // in degrees

    // console.log("bearing = " + brng)

    return brng;
}

export const arrowDirection = (angle) => {
    let arrows = ["⬆️", "↗️", "➡️", "↘️", "⬇️", "↙️", "⬅️", "↖️"]
    angle += 360 / (arrows.length * 2)
    angle %= 360
    let index = Math.floor(angle / (360 / arrows.length))
    return arrows[index]

}

/**
 * 
 * @param {*} dep1 first departement
 * @param {*} dep2 second departement
 * @returns array with [victory(boolean), distance km(number), angle(number)]
 */
export const computeResult = (dep1, dep2) => {
    if (dep1.latitude == dep2.latitude && dep1.longitude == dep2.longitude) {
        return [true, 0, null];
    } else {
        let distance = computeDistance(dep1.latitude, dep1.longitude, dep2.latitude, dep2.longitude)
        let angle = computeBearing(dep1.latitude, dep1.longitude, dep2.latitude, dep2.longitude)
        return [false, distance, angle]
    }
}

export const findDeptByName = (name) => {
    let matches = departements.filter((item => { return item.name === name }))
    if (matches.length == 1) {
        return matches[0];
    } else {
        return null;
    }
}