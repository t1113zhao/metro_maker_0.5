import { genericSingleDelete, genericSingleRestore, nextIDForArray } from '../utils/utils'
import {
    ADD_AGENCY,
    EDIT_AGENCY,
    REMOVE_AGENCY,
    RESTORE_AGENCY
} from '../actions/actionTypes'
const initialState = []

export default function agencyReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_AGENCY: {
            return doAddAgency(state, action);
        }
        case EDIT_AGENCY: {
            return doEditAgency(state, action);
        }
        case REMOVE_AGENCY: {
            return genericSingleDelete(
                state,
                action.payload.id,
                action.payload.deletedAt
            );
        }
        case RESTORE_AGENCY: {
            return genericSingleRestore(
                state,
                action.payload.id
            );
        }
        default:
            return state;
    }
}

function doAddAgency(state, action) {
    return [
        ...state,
        {
            id: nextIDForArray(state),
            name: action.payload.name,
            color: action.payload.color,
            deletedAt: null
        }
    ]
}

function doEditAgency(state, action) {
    return state.map(item => {
        if (item.id != action.payload.id) {
            return item
        }
        return {
            ...item,
            name: action.payload.name,
            color: action.payload.color
        }
    })
}

export function selectAllAgencies(state) {
    return state.agencies.filter(agency => {
        return !agency.deletedAt
    })
}

export function selectAgenciesGivenId(state, id) {
    return state.agencies.filter(agency => {
        return agency.id == id && !agency.deletedAt
    })
}
