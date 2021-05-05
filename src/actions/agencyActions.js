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
