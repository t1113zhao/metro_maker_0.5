import {
    ADD_AGENCY,
    UNDO_ADD_AGENCY,
    EDIT_AGENCY,
    REMOVE_AGENCY,
    RESTORE_AGENCY
} from './actionTypes'
import store from '../app/store'

import { lineIDsGivenAgencyId } from '../reducers/linesReducer'
import { serviceIDsGivenAgencyID } from '../reducers/servicesReducer'
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

export function undoAddAgency(id) {
    return {
        type: UNDO_ADD_AGENCY,
        payload: {
            id: parseInt(id)
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
            deletedAt: new Date().toISOString(),
            lineIDs: lineIDsGivenAgencyId(store.getState(), parseInt(id), false),
            serviceIDs: serviceIDsGivenAgencyID(store.getState(), parseInt(id), false)
        }
    }
}

export function restoreAgency(id) {
    return {
        type: RESTORE_AGENCY,
        payload: {
            id: parseInt(id),
            lineIDs: lineIDsGivenAgencyId(store.getState(), parseInt(id), true),
            serviceIDs: serviceIDsGivenAgencyID(store.getState(), parseInt(id), true)
        }
    }
}

export function getInverseAgencyActions(state, action) {
    switch (action.type) {
        default: {
            return { type: "ERROR" }
        }
        case ADD_AGENCY: {
            return undoAddAgency(nextIDForArray(state))
        }
        case UNDO_ADD_AGENCY: {
            let targetAgency = getById(state, action.payload.id)
            return addAgency(targetAgency.name, targetAgency.color)
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
