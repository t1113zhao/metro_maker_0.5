import {
    ADD_LINE,
    EDIT_LINE,
    REMOVE_LINE,
    UNDO_REMOVE_LINE
} from './actionTypes'

import store from '../app/store'

import {serviceIDsGivenLineID} from '../reducers/servicesReducer'

export function addLine(operatorID, name, color, linetype){
    return{
        type: ADD_LINE,
        payload :{
            operatorID:parseInt(operatorID),
            name: name,
            color: color,
            linetype: linetype
        }
    }
}

export function editLine(lineID, name, color, linetype){
    return{
        type: EDIT_LINE,
        payload :{
            id: parseInt(lineID),
            name: name,
            color: color,
            linetype: linetype
        }
    }
}

export function removeLine(removeID){
    let lineIDs = [parseInt(removeID)]
    return{
        type:REMOVE_LINE,
        payload :{
            lineIDs: lineIDs,
            deletedAt: new Date().toISOString(),
            serviceIDs: serviceIDsGivenLineID(store.getState(),removeID)
        }
    }
}

export function undoRemoveLine(removeID){
    let lineIDs = [parseInt(removeID)]
    return{
        type:UNDO_REMOVE_LINE,
        payload :{
            lineIDs: lineIDs,
            serviceIDs: serviceIDsGivenLineID(store.getState(),removeID)
        }
    }
}