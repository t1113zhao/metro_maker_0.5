import { genericMultiDelete, genericMultiRestore, genericSingleDelete, genericSingleRestore, nextIDForArray } from '../utils/utils'
import { lineIDsGivenOperatorId } from './linesReducer.js'
import {
    ADD_SERVICE,
    EDIT_SERVICE,
    REMOVE_SERVICE,
    RESTORE_SERVICE,
    REMOVE_LINE,
    RESTORE_LINE,
    REMOVE_OPERATOR,
    RESTORE_OPERATOR
} from '../actions/actionTypes'

const initialServicesState = []

export default function serviceReducer(state = initialServicesState, action) {
    switch (action.type) {
        case EDIT_SERVICE: {
            return doEditService(state, action);
        }
        case REMOVE_OPERATOR:
        case REMOVE_LINE: {
            return genericMultiDelete(
                state,
                action.payload.serviceIDs,
                action.payload.deletedAt
            )
        }
        case REMOVE_SERVICE: {
            return genericSingleDelete(
                state,
                action.payload.id,
                action.payload.deletedAt
            )
        }
        case RESTORE_OPERATOR:
        case RESTORE_LINE: {
            return genericMultiRestore(
                state,
                action.payload.serviceIDs
            )
        }

        case RESTORE_SERVICE: {
            return genericSingleRestore(
                state,
                action.payload.id
            )
        }
        default:
            return state;
    }
}

export function doAddService(state, action) {
    return [
        ...state,
        {
            id: nextIDForArray(state),
            lineID: action.payload.lineID,
            name: action.payload.name,
            servicePeriod: action.payload.servicePeriod,
            frequency: action.payload.frequency,
            deletedAt: null
        }
    ]
}

function doEditService(state, action) {
    return state.map((item, index) => {
        if (index !== action.payload.id) {
            return item
        }
        return {
            ...item,
            name: action.payload.name,
            servicePeriod: action.payload.serviceType,
            frequency: action.payload.frequency
        }
    })
}

export function selectAllServices(state) {
    return state.services.filter(service => {
        return !service.deletedAt
    });
}

export function selectServiceGivenID(state, id) {
    return state.services.filter(service => {
        return service.id == id && !service.deletedAt
    })
}

export function selectServicesGivenLineID(state, lineID) {
    return state.services.filter(service => {
        return service.lineID == lineID && !service.deletedAt
    })
}

export function serviceIDsGivenLineID(state, lineID) {
    return selectServicesGivenLineID(state, lineID).map(service => {
        return service.id
    })
}

export function selectServicesGivenOperatorID(state, operatorID) {
    let lineIDs = new Set(lineIDsGivenOperatorId(state, operatorID))

    return state.services.filter(service => {
        return lineIDs.has(service.lineID)
    })
}

export function serviceIDsGivenOperatorID(state, operatorID) {
    return selectServicesGivenOperatorID(state, operatorID).map(service => {
        return service.id
    })
}
