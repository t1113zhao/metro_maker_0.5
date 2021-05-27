import {
    ADD_TRANSFER,
    EDIT_TRANSFER,
    REMOVE_TRANSFER,
    RESTORE_TRANSFER
} from './actionTypes'

export function addTransfer(stationA_ID, stationB_ID, type) {
    return {
        type: ADD_TRANSFER,
        payload: {
            stationIDs: [stationA_ID, stationB_ID],
            type: type
        }
    }
}

export function editTransfer(id, type) {
    return {
        type: EDIT_TRANSFER,
        payload: {
            id: parseInt(id),
            type: type
        }
    }
}

export function removeTransfer(id) {
    return {
        type: REMOVE_TRANSFER,
        payload: {
            id: parseInt(id),
            deletedAt: new Date().toISOString()
        }
    }
}

export function restoreTransfer(id) {
    return {
        type: RESTORE_TRANSFER,
        payload: {
            id: parseInt(id)
        }
    }
}
