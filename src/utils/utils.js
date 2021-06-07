/** 
 * A class to contain random utility functions
*/

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

export function genericMultiRestore(array, ids) {
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

//basically get
export function filterById(array, id) {
    return array.filter(item => {
        return item.id === id
    })
}

export function filterOutById(array, id) {
    return array.filter(item => {
        return item.id !== id
    })
}

export function idCompareDsc(a,b) {
    if(a.id < b.id) {
        return 1;
    }
    if(a.id> b.id) {
        return -1
    }
    return 0
}

export function idCompareAsc(a,b) {
    if(a.id < b.id) {
        return -1;
    }
    if(a.id> b.id) {
        return 1
    }
    return 0
}

export function filterOutByIds(array, ids) {
    var idset = new Set(ids)

    return array.filter(item => {
        return !idset.has(item.id)
    })
}


export function haversineMidpoint(node_A, node_B) {
    const R = 6371e3
    function toRad(x) {
        return x * Math.PI / 180
    }

    //http://jsfiddle.net/c1s6xgab/
    let lat1 = toRad(node_A.latitude)
    let lng1 = toRad(node_A.longitude)

    let lat2 = toRad(node_B.latitude)
    let lng2 = toRad(node_B.longitude)

    let dLng = (lng2 - lng1)

    var bX = Math.cos(lat2) * Math.cos(dLng);
    var bY = Math.cos(lat2) * Math.sin(dLng);

    var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
    var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

    //Convert back into degrees
    lat3 = lat3 * 180 / Math.PI
    lng3 = lng3 * 180 / Math.PI

    lng3 = ( lng3 + 540 ) % 360 - 180

    // 6 digits of precision is precision at worst of 11cm at equator 
    return {
        latitude: parseFloat(lat3.toFixed(6)) ,
        longitude: parseFloat(lng3.toFixed(6)) 
    }
}
