import {
    ADD_STATION,
    EDIT_STATION,
    REMOVE_STATION,
    UNDO_REMOVE_STATION
} from './actionTypes'

export function addStation(description, name, latitude, longitude) {
    return {
        type: ADD_STATION,
        payload: {
            name: name,
            description: description
        }
    }
}

export function editStation(id, description, name) {
    return {
        type: EDIT_STATION,
        payload: {
            id: parseInt(id),
            name: name,
            description: description
        }
    }
}

export function removeNode(id) {
    return {
        type: REMOVE_STATION,
        payload: {
            id: parseInt(id),
            deletedAt: new Date().toISOString()
        }
    }
}

export function undoRemoveNode(id) {
    return {
        type: UNDO_REMOVE_STATION,
        payload: {
            id: parseInt(id)
        }
    }
}