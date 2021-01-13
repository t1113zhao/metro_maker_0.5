import { createSlice } from '@reduxjs/toolkit';


export const mapSlice = createSlice({
    name: 'map',
    initialState:{
        operators:[],
        lines:[],
        services:[],
        passThrough:[],
        stopped:[],
        serviceTrack:[],
        stations:[],
        transfers:[],
        tracks:[],
        trackSegments:[],
        segments:[],
        nodes:[]
    },
    reducers:{
        addOperator: (state, action) => {
            return addOperator(state,action);
        },
        editOperator:(state,action) =>{
            return editOperator(state,action);
        },
        removeOperator:(state,action) =>{
            return removeOperator(state,action)
        },
        addLine: (state,action)=>{
            return addLine(state,action)
        },
        editLine: (state,action)=>{
            return editLine(state,action)
        },
        //Create a set containing only the id of this one set
        removeLine: (state,action)=>{
            let lineToRemove = new Set()
            lineToRemove.add(action.payload.id)
            return removeLines(state,lineToRemove)
        },
        addService:(state,action)=>{
            return addService(state,action)
        },
        editService:(state,action)=>{
            return editService(state,action)
        },
        removeService:(state,action)=>{
            let serviceToRemove = new Set()
            serviceToRemove.add(action.payload.id)
            return removeServices(state,lineToRemove)
        }
    }
});

export const {addOperator, 
    editOperator, 
    removeOperator, 
    addLine, 
    editLine, 
    removeLines, 
    addService, 
    editService, 
    removeService} = mapSlice.actions;

export default mapSlice.reducer;

export function nextIDForArray(array){
    const maxID = array.reduce((maxID, element) => Math.max(element.id, maxID),-1)
    return maxID + 1
};

/**
function updateObject(oldObject, newValues) {
    // Encapsulate the idea of passing a new object as the first parameter
    // to Object.assign to ensure we correctly copy data instead of mutating
    return Object.assign({}, oldObject, newValues)
}

function updateItemInArray(array, itemId, updateItemCallback){
    const updatedItems = array.map(item => {
        if(item.id!== itemId) {
            return item
        }

        const updatedItem = updateItemCallback(item)
        return updatedItem
    })
    return updatedItems
}

function removeItemsInArray(array, idSet, removeItemCallback){
    const updatedItems = array.map(item =>{
        if(idSet.has(item.id)){
            const removedItem = removeItemCallback(item)
            return removedItem
        }
        return item
    })
    return updatedItems
}*/
