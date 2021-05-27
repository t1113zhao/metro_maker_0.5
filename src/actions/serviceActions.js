import {
    ADD_SERVICE,
    EDIT_SERVICE,
    REMOVE_SERVICE,
    RESTORE_SERVICE
} from './actionTypes'

export function addService(lineID, name, servicePeriod, frequency) {
    return {
        type: ADD_SERVICE,
        payload: {
            lineID: parseInt(lineID),
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
            id: parseInt(id),
        }
    }
}
