import { nextIDForArray, getById } from '../utils/utils'
import { ADD_TRANSFER, UNDO_ADD_TRANSFER, EDIT_TRANSFER, REMOVE_TRANSFER, RESTORE_TRANSFER } from './actionTypes'

export function addTransfer(stationA_ID, stationB_ID, type) {
    return {
        type: ADD_TRANSFER,
        payload: {
            stationIDs: [stationA_ID, stationB_ID],
            type: type
        }
    }
}

export function undoAddTransfer(id, stationA_ID, stationB_ID, type) {
    return {
        type: UNDO_ADD_TRANSFER,
        payload: {
            id: parseInt(id),
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

export function getInverseTransferActions(state, action) {
    switch (action.type) {
        default: {
            return { type: 'ERROR' }
        }
        case ADD_TRANSFER: {
            return undoAddTransfer(
                nextIDForArray(state),
                action.payload.stationIDs[0],
                action.payload.stationIDs[1],
                action.payload.type
            )
        }
        case UNDO_ADD_TRANSFER: {
            return addTransfer(action.payload.stationIDs[0], action.payload.stationIDs[1], action.payload.type)
        }
        case EDIT_TRANSFER: {
            let targetTransfer = getById(state, action.payload.id)
            return editTransfer(targetTransfer.id, targetTransfer.type)
        }
        case REMOVE_TRANSFER: {
            return restoreTransfer(action.payload.id)
        }
        case RESTORE_TRANSFER: {
            return removeTransfer(action.payload.id)
        }
    }
}
