import {
    ADD_SERVICE,
    EDIT_SERVICE,
    REMOVE_SERVICE,
    UNDO_REMOVE_SERVICE
} from './actionTypes'

export function addService(lineID, name, servicePeriod,frequency){
    return{
        type: ADD_SERVICE,
        payload :{
            lineID: parseInt(lineID),
            name: name,
            servicePeriod: servicePeriod,
            frequency: frequency
        }
    }
}

export function editService(id, name, servicePeriod,frequency){
    return{
        type: EDIT_SERVICE,
        payload: {
            id: parseInt(id),
            name: name,
            servicePeriod: servicePeriod,
            frequency: frequency
        }
    }
}

export function removeService(removeId){
    let serviceIDs = [parseInt(removeId)];
    return {
        type: REMOVE_SERVICE,
        payload: {
            serviceIDs:serviceIDs,
            deletedAt: new Date().toISOString()
        }
    }
}

export function undoRemoveService(removeId){
    let serviceIDs = [parseInt(removeId)]

    return {
        type: UNDO_REMOVE_SERVICE,
        payload: {
            serviceIDs:serviceIDs
        }
    }
 
}