export function nextIDForArray(array){
    const maxID = array.reduce((maxID, element) => Math.max(element.id, maxID),-1)
    return maxID + 1
};

export function genericSingleDelete(array, id, deletedAt){
    return array.map(item => {
        if (item.id != id) {
            return item
        }
        return {
            ...item,
            deletedAt: deletedAt
        }
    })
}

export function genericSingleRestore(array, id){
    return array.map(item => {
        if (item.id != id) {
            return item
        }
        return {
            ...item,
            deletedAt: null
        }
    })
}

export function genericMultiDelete(array, ids, deletedAt){
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

export function genericMultiRestore(array, ids){
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
