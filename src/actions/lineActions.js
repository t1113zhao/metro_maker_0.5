import { ADD_LINE, UNDO_ADD_LINE, EDIT_LINE, REMOVE_LINE, RESTORE_LINE } from './actionTypes'

import { serviceIDsGivenLineID } from '../reducers/servicesReducer'
import { nextIDForArray, getById } from '../utils/utils'

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

export function undoAddLine(id, agencyID, name, color, linetype) {
    return {
        type: UNDO_ADD_LINE,
        payload: {
            id: parseInt(id),
            agencyID: agencyID,
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
            deletedAt: new Date().toISOString()
        }
    }
}

export function restoreLine(id) {
    return {
        type: RESTORE_LINE,
        payload: {
            id: parseInt(id)
        }
    }
}

export function getInverseLineActions(state, action) {
    switch (action.type) {
        default: {
            return { type: 'ERROR' }
        }
        case ADD_LINE: {
            return undoAddLine(
                nextIDForArray(state),
                action.payload.agencyID,
                action.payload.name,
                action.payload.color,
                action.payload.linetype
            )
        }
        case UNDO_ADD_LINE: {
            return addLine(action.payload.agencyID, action.payload.name, action.payload.color, action.payload.linetype)
        }
        case EDIT_LINE: {
            let targetLine = getById(state, action.payload.id)
            return editLine(targetLine.id, targetLine.name, targetLine.color, targetLine.linetype)
        }
        case REMOVE_LINE: {
            return restoreLine(action.payload.id)
        }
        case RESTORE_LINE: {
            return removeLine(action.payload.id)
        }
    }
}
