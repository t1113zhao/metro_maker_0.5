import { ADD_AGENCY, UNDO_ADD_AGENCY, EDIT_AGENCY, REMOVE_AGENCY, RESTORE_AGENCY } from './actionTypes'
import { getById, nextIDForArray } from '../utils/utils'

export function addAgency(name, color) {
    return {
        type: ADD_AGENCY,
        payload: {
            name: name,
            color: color
        }
    }
}

export function undoAddAgency(id, name, color) {
    return {
        type: UNDO_ADD_AGENCY,
        payload: {
            id: parseInt(id),
            name: name,
            color: color
        }
    }
}

export function editAgency(id, name, color) {
    return {
        type: EDIT_AGENCY,
        payload: {
            id: parseInt(id),
            name: name,
            color: color
        }
    }
}

export function removeAgency(id) {
    return {
        type: REMOVE_AGENCY,
        payload: {
            id: parseInt(id),
            deletedAt: new Date().toISOString()
        }
    }
}

export function restoreAgency(id) {
    return {
        type: RESTORE_AGENCY,
        payload: {
            id: parseInt(id)
        }
    }
}

export function getInverseAgencyActions(state, action) {
    switch (action.type) {
        default: {
            return { type: 'ERROR' }
        }
        case ADD_AGENCY: {
            return undoAddAgency(nextIDForArray(state), action.payload.name, action.payload.color)
        }
        case UNDO_ADD_AGENCY: {
            return addAgency(action.payload.name, action.payload.color)
        }
        case EDIT_AGENCY: {
            let targetAgency = getById(state, action.payload.id)
            return editAgency(targetAgency.id, targetAgency.name, targetAgency.color)
        }
        case REMOVE_AGENCY: {
            return restoreAgency(action.payload.id)
        }
        case RESTORE_AGENCY: {
            return removeAgency(action.payload.id)
        }
    }
}
