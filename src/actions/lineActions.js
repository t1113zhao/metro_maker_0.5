import {
    ADD_LINE,
    EDIT_LINE,
    REMOVE_LINE,
    RESTORE_LINE
} from './actionTypes'

import store from '../app/store'

import { serviceIDsGivenLineID } from '../reducers/servicesReducer'

export function addLine(agencyID, name, color, linetype) {
    return {
        type: ADD_LINE,
        payload: {
            agencyID: parseInt(agencyID),
            name: name,
            color: color,
            linetype: linetype
        }
    }
}

export function editLine(lineID, name, color, linetype) {
    return {
        type: EDIT_LINE,
        payload: {
            id: parseInt(lineID),
            name: name,
            color: color,
            linetype: linetype
        }
    }
}

export function removeLine(id) {
    return {
        type: REMOVE_LINE,
        payload: {
            id: parseInt(id),
            deletedAt: new Date().toISOString(),
            serviceIDs: serviceIDsGivenLineID(store.getState(), parseInt(id), false)
        }
    }
}

export function restoreLine(id) {
    return {
        type: RESTORE_LINE,
        payload: {
            id: parseInt(id),
            serviceIDs: serviceIDsGivenLineID(store.getState(), parseInt(id), true)
        }
    }
}
