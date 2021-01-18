import { nextIDForArray } from './mapReducer.js'
import {lineIDsGivenOperatorId} from './linesReducer.js'
import {ADD_SERVICE,
    EDIT_SERVICE,
    REMOVE_SERVICE,
    UNDO_REMOVE_SERVICE,
    REMOVE_LINE,
    UNDO_REMOVE_LINE,
    REMOVE_OPERATOR,
    UNDO_REMOVE_OPERATOR} from '../actions/actionTypes'
import { selectOperatorsGivenId } from './operatorsReducer.js';

const initialServicesState = []

export default function serviceReducer(state = initialServicesState, action){
    switch(action.type){
        case ADD_SERVICE:{
            return doAddService(state,action);
        }
        case EDIT_SERVICE:{
            return doEditService(state,action);
        }
        case REMOVE_OPERATOR:
        case REMOVE_LINE:
        case REMOVE_SERVICE:{
            return doRemoveServices(state,action);
        }
        case UNDO_REMOVE_OPERATOR:
        case UNDO_REMOVE_LINE:
        case UNDO_REMOVE_SERVICE:{
            return doUnRemoveServices(state,action);
        }
        default:
            return state;
    }
}

function doAddService(state, action) {
    return [
        ...state,
        {
            id: nextIDForArray(state),
            lineID: parseInt(action.payload.lineID),
            name: action.payload.name,
            serviceType: action.payload.serviceType,
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
                serviceType: action.payload.serviceType
            }
        })
}

//Multiple Services are removed when lines and operators are removed
function doRemoveServices(state, action) {
    var serviceIDSet = new Set(action.payload.serviceIDs)
    return state.map((item) => {
            if (serviceIDSet.has(item.id)) {
                return {
                    ...item,
                    deletedAt: action.payload.deletedAt
                }
            } else {
                return item
            }   
        })
}
  
function doUnRemoveServices(state, action) {
    var serviceIDSet = new Set(action.payload.serviceIDs)
    return state.map((item) => {
            if (serviceIDSet.has(item.id)) {
                return {
                    ...item,
                    deletedAt: null
                }
            } else {
                return item
            }
        })
}


export function selectAllServices(state){
    return state.services;
}

export function selectServiceGivenID(state,id){
    return state.services.filter(service =>{
        return service.id == id
    })
}

export function selectServicesGivenLineID(state,lineID){
    return state.services.filter(service =>{
        return service.lineID == lineID
    })
}

export function serviceIDsGivenLineID(state,lineID){
    return selectServicesGivenLineID(state,lineID).map(service =>{
        return service.id
    })
}

export function selectServicesGivenOperatorID(state,operatorID){
    let lineIDs = new Set(lineIDsGivenOperatorId(state,operatorID))

    return state.services.filter(service =>{
        return lineIDs.has(service.lineID)
    })
}

export function serviceIDsGivenOperatorID(state,operatorID){
    return selectServicesGivenOperatorID(state,operatorID).map(service =>{
        return service.id
    })
}