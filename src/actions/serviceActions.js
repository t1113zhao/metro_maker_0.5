import { ADD_SERVICE, UNDO_ADD_SERVICE, EDIT_SERVICE, REMOVE_SERVICE, RESTORE_SERVICE } from './actionTypes'

import { getById, nextIDForArray } from '../utils/utils'

export function addService(lineID, agencyID, name, servicePeriod, frequency) {
    return {
        type: ADD_SERVICE,
        payload: {
            lineID: parseInt(lineID),
            agencyID: parseInt(agencyID),
            name: name,
            servicePeriod: servicePeriod,
            frequency: frequency // trains per hour
        }
    }
}

export function undoAddService(id, lineID, agencyID, name, servicePeriod, frequency) {
    return {
        type: UNDO_ADD_SERVICE,
        payload: {
            id: parseInt(id),
            lineID: parseInt(lineID),
            agencyID: parseInt(agencyID),
            name: name,
            servicePeriod: servicePeriod,
            frequency: frequency // trains per hour
        }
    }
}

export function editService(id, name, servicePeriod, frequency) {
    return {
        type: EDIT_SERVICE,
        payload: {
            id: parseInt(id),
            name: name,
            servicePeriod: servicePeriod,
            frequency: frequency
        }
    }
}

export function removeService(id) {
    return {
        type: REMOVE_SERVICE,
        payload: {
            id: parseInt(id),
            deletedAt: new Date().toISOString()
        }
    }
}

export function restoreService(id) {
    return {
        type: RESTORE_SERVICE,
        payload: {
            id: parseInt(id)
        }
    }
}

export function getInverseServiceActions(state, action) {
    switch (action.type) {
        default: {
            return { type: 'ERROR' }
        }
        case ADD_SERVICE: {
            return undoAddService(
                nextIDForArray(state),
                action.payload.lineID,
                action.payload.agencyID,
                action.payload.name,
                action.payload.servicePeriod,
                action.payload.frequency
            )
        }
        case UNDO_ADD_SERVICE: {
            return addService(
                action.payload.lineID,
                action.payload.agencyID,
                action.payload.name,
                action.payload.servicePeriod,
                action.payload.frequency
            )
        }
        case EDIT_SERVICE: {
            let targetService = getById(state, action.payload.id)
            return editService(
                targetService.id,
                targetService.name,
                targetService.servicePeriod,
                targetService.frequency
            )
        }
        case REMOVE_SERVICE: {
            return restoreService(action.payload.id)
        }
        case RESTORE_SERVICE: {
            return removeService(action.payload.id)
        }
    }
}
