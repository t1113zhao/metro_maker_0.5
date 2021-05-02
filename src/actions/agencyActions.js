import {
    ADD_AGENCY,
    EDIT_AGENCY,
    REMOVE_AGENCY,
    RESTORE_AGENCY
} from './actionTypes'
import store from '../app/store'

import { lineIDsGivenAgencyId } from '../reducers/linesReducer'
import { serviceIDsGivenAgencyID } from '../reducers/servicesReducer'

export function addAgency(name, color) {
    return {
        type: ADD_AGENCY,
        payload: {
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

export function removeAgency(removeID) {
    return {
        type: REMOVE_AGENCY,
        payload: {
            id: parseInt(removeID),
            deletedAt: new Date().toISOString(),
            lineIDs: lineIDsGivenAgencyId(store.getState(), removeID),
            serviceIDs: serviceIDsGivenAgencyID(store.getState(), removeID)
        }
    }
}

export function restoreAgency(removeID) {
    return {
        type: RESTORE_AGENCY,
        payload: {
            id: parseInt(removeID),
            lineIDs: lineIDsGivenAgencyId(store.getState(), removeID),
            serviceIDs: serviceIDsGivenAgencyID(store.getState(), removeID)
        }
    }
}
