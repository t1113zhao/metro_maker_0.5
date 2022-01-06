import {
    filterDeleted,
    filterOutById,
    genericMultiDelete,
    genericMultiRestore,
    genericSingleDelete,
    genericSingleRestore,
    nextIDForArray
} from '../utils/utils'

import {
    ADD_TRANSFER,
    UNDO_ADD_TRANSFER,
    EDIT_TRANSFER,
    REMOVE_TRANSFER,
    RESTORE_TRANSFER,
    REMOVE_STATION,
    RESTORE_STATION
} from '../actions/actionTypes'

const initialState = []

export default function transferReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_TRANSFER: {
            return doAddTransfer(state, action)
        }
        case UNDO_ADD_TRANSFER: {
            return filterOutById(state, action.payload.id)
        }
        case EDIT_TRANSFER: {
            return doEditTransfer(state, action)
        }
        case REMOVE_STATION: {
            let transferIDs = transferIDsGivenStationID(state, action.payload.id, false)
            return genericMultiDelete(state, transferIDs, action.payload.deletedAt)
        }
        case REMOVE_TRANSFER: {
            return genericSingleDelete(state, action.payload.id, action.payload.deletedAt)
        }
        case RESTORE_STATION: {
            let transferIDs = transferIDsGivenStationID(state, action.payload.id, true)
            return genericMultiRestore(state, transferIDs)
        }
        case RESTORE_TRANSFER: {
            return genericSingleRestore(state, action.payload.id)
        }
        default: {
            return state
        }
    }
}

function doAddTransfer(state, action) {
    return [
        ...state,
        {
            id: nextIDForArray(state),
            stationIDs: action.payload.stationIDs,
            type: action.payload.type,
            deletedAt: null
        }
    ]
}

function doEditTransfer(state, action) {
    return state.map(item => {
        if (item.id !== action.payload.id) {
            return item
        }
        return {
            ...item,
            type: action.payload.type
        }
    })
}

export function selectAllConnectedStations(state, stationID) {
    //for each transfer, create hashmap of station to station
    //then do a BFS search

    let map = new Map()
    state.foreach(element => {
        let A = element.stationIDs[0]
        let B = element.stationIDs[1]

        if (!map.has(A)) {
            map.set(A, [B])
        } else if (!map.get(A).includes(B)) {
            map.get(A).push(B)
        }

        if (!map.has(B)) {
            map.set(B, [A])
        } else if (!map.get(B).includes(A)) {
            map.get(B).push(A)
        }
    })

    let connectedIDs = []
    let searchQueue = []

    searchQueue.push(stationID)
    while (searchQueue.length() > 0) {
        let cur = searchQueue.shift()

        let connected = map.get(cur)
        connected.foreach(element => {
            searchQueue.push(element)
            connectedIDs.push(element)
        })
    }

    return connectedIDs
}

export function selectAllTransfersGivenStationID(transfers, stationID, includeDeleted) {
    let output = transfers.filter(transfer => {
        return transfer.stationIDs[0] === stationID || transfer.stationIDs[1] === stationID
    })
    return filterDeleted(output, includeDeleted)
}

export function transferIDsGivenStationID(transfers, stationID, includeDeleted) {
    return selectAllTransfersGivenStationID(transfers, stationID, includeDeleted).map(transfer => {
        return transfer.id
    })
}
