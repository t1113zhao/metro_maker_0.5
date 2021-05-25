import { filterById, filterDeleted, genericMultiDelete, genericMultiRestore, genericSingleDelete, genericSingleRestore, nextIDForArray } from '../utils/utils'
import {
    ADD_LINE,
    EDIT_LINE,
    REMOVE_LINE,
    RESTORE_LINE,
    REMOVE_AGENCY,
    RESTORE_AGENCY
} from '../actions/actionTypes'

const initialLineState = [];

export default function lineReducer(state = initialLineState, action) {
    switch (action.type) {
        case ADD_LINE: {
            return doAddLine(state, action);
        }
        case EDIT_LINE: {
            return doEditLine(state, action);
        }
        case REMOVE_AGENCY: {
            return genericMultiDelete(
                state,
                action.payload.lineIDs,
                action.payload.deletedAt
            )
        }
        case REMOVE_LINE: {
            return genericSingleDelete(
                state,
                action.payload.id,
                action.payload.deletedAt
            )
        }
        case RESTORE_AGENCY: {
            return genericMultiRestore(
                state,
                action.payload.lineIDs
            )
        }
        case RESTORE_LINE: {
            return genericSingleRestore(
                state,
                action.payload.id
            )
        }
        default:
            return state;
    }
}

function doAddLine(state, action) {
    return [
        ...state,
        {
            id: nextIDForArray(state),
            agencyID: action.payload.agencyID,
            name: action.payload.name,
            color: action.payload.color,
            linetype: action.payload.linetype,
            deletedAt: null
        }
    ]
}

function doEditLine(state, action) {
    return state.map(item => {
        if (item.id != action.payload.id) {
            return item
        }
        return {
            ...item,
            name: action.payload.name,
            color: action.payload.color,
            linetype: action.payload.linetype
        }
    })
}

export function selectAllLines(state, includeDeleted) {
    let output = state.lines
    filterDeleted(output, includeDeleted)
    return output
}

export function selectLineGivenID(state, id, includeDeleted) {
    let output = filterById(state.lines, id)
    filterDeleted(output, includeDeleted)
    return output
}

export function selectLinesGivenAgencyId(state, agencyID, includeDeleted) {
    let output = state.lines.filter(line => {
        return line.agencyID === agencyID
    })
    output = filterDeleted(output, includeDeleted)
    return output
}

export function lineIDsGivenAgencyId(state, agencyID, includeDeleted) {
    return selectLinesGivenAgencyId(state, agencyID, includeDeleted).map(line => {
        return line.id
    })
}
