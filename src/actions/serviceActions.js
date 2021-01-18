import {
    ADD_SERVICE,
    EDIT_SERVICE,
    REMOVE_SERVICE,
    UNDO_REMOVE_SERVICE
} from './actionTypes'

export function addService(lineID, name, serviceType){
    return{
        type: ADD_SERVICE,
        payload :{
            lineID: parseInt(lineID),
            name: name,
            serviceType: serviceType
        }
    }
}

export function editService(id, name, serviceType){
    return{
        type: EDIT_SERVICE,
        payload: {
            id: parseInt(id),
            name: name,
            serviceType: serviceType
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