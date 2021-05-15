import { Provider } from "react-redux"

export function nextIDForArray(array) {
    const maxID = array.reduce((maxID, element) => Math.max(element.id, maxID), -1)
    return maxID + 1
};

export function genericSingleDelete(array, id, deletedAt) {
    return array.map(item => {
        if (item.id !== id) {
            return item
        }
        return {
            ...item,
            deletedAt: deletedAt
        }
    })
}

export function genericSingleRestore(array, id) {
    return array.map(item => {
        if (item.id !== id) {
            return item
        }
        return {
            ...item,
            deletedAt: null
        }
    })
}

export function genericMultiDelete(array, ids, deletedAt) {
    var removeSet = new Set(ids)

    return array.map((item) => {
        if (removeSet.has(item.id)) {
            return {
                ...item,
                deletedAt: deletedAt
            }
        } else {
            return item
        }
    })
}

export function genericMultiRestore(array, ids, deletedAt) {
    var restoreSet = new Set(ids)

    return array.map((item) => {
        if (restoreSet.has(item.id)) {
            return {
                ...item,
                deletedAt: null
            }
        } else {
            return item
        }
    })
}

export function filterDeleted(array, includeDeleted) {
    if (includeDeleted === true) {
        return array
    }
    return array.filter(item => {
        return !item.deletedAt
    })
}

export function filterByIds(array, ids) {
    var idset = new Set(ids)
    return array.filter(item => {
        return idset.has(item.id)
    })
}

export function filterById(array, id) {
    return array.filter(item => {
        return item.id === id
    })
}

export function haversineMidpoint(node_A, node_B) {

    //http://jsfiddle.net/c1s6xgab/
    let lat1 = node_A.latitude
    let lng1 = node_A.longitude

    let lat2 = node_B.latitude
    let lng2 = node_B.longitude

    let dLng = (lng2-lng1)

    var bX = Math.cos(lat2) * Math.cos(dLng);
    var bY = Math.cos(lat2) * Math.sin(dLng);

    var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
    var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

    //Convert back into degrees
    lat3 = lat3 * 180 / Math.PI
    lng3 = lng3 * 180 / Math.PI

    // -220 = +140
    if(lat3 < -180){
        lat3 = -360 - lat3
    } else if (lat3> 180){
        lat3 = 360 - lat3
    }

    if(lng3 < -180){
        lng3 = lng3 + 360
    } else if (lng3> 180){
        lng3 = lng3 - 360
    }

    return [
        lat3, lng3
    ]
}
