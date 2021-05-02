import {
    ADD_OPERATOR,
    EDIT_OPERATOR,
    REMOVE_OPERATOR,
    RESTORE_OPERATOR
} from './actionTypes'
import store from '../app/store'

import { lineIDsGivenOperatorId } from '../reducers/linesReducer'
import { serviceIDsGivenOperatorID } from '../reducers/servicesReducer'

export function addOperator(name, color) {
    return {
        type: ADD_OPERATOR,
        payload: {
            name: name,
            color: color
        }
    }
}

export function editOperator(id, name, color) {
    return {
        type: EDIT_OPERATOR,
        payload: {
            id: parseInt(id),
            name: name,
            color: color
        }
    }
}

export function removeOperator(removeID) {
    return {
        type: REMOVE_OPERATOR,
        payload: {
            id: parseInt(removeID),
            deletedAt: new Date().toISOString(),
            lineIDs: lineIDsGivenOperatorId(store.getState(), removeID),
            serviceIDs: serviceIDsGivenOperatorID(store.getState(), removeID)
        }
    }
}

export function restoreOperator(removeID) {
    return {
        type: RESTORE_OPERATOR,
        payload: {
            id: parseInt(removeID),
            lineIDs: lineIDsGivenOperatorId(store.getState(), removeID),
            serviceIDs: serviceIDsGivenOperatorID(store.getState(), removeID)
        }
    }
}
