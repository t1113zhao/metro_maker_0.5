import { createSlice } from '@reduxjs/toolkit';
import { nextIDForArray } from './mapReducer.js'
import {lineIDsGivenOperatorId} from './linesReducer.js'

export const serviceSlice = createSlice({
    name: 'services',
    initialState: [],
    reducers: {
        addService: (state, action) => {
            return addService(state, action)
        },
        editService: (state, action) => {
            return editService(state, action)
        },
        removeService: (state, action) => {
            return removeServices(state, action)
        }
    }
})

export const {
    addService,
    editService,
    removeService
} = serviceSlice.actions;

export default serviceSlice.reducer;

function addService(state, action) {
    return [
        ...state,
        {
            id: nextIDForArray(state.services),
            lineID: action.payload.lineID,
            name: action.payload.name,
            serviceType: action.payload.serviceType,
            isBroken: false,
            deletedAt: null
        }
    ]
}

function editService(state, action) {
    return {
        ...state,
        services: services.map((item, index) => {
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
}

//Multiple Services are removed when lines and operators are removed
function removeServices(state, serviceIDs) {
    return {
        ...state,
        services: services.map((item) => {
            if (serviceIDs.has(item.id)) {
                return {
                    ...item,
                    deletedAt: action.payload.deletedAt
                }
            } else {
                return item
            }
        })
    }
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

export function selectServicesGivenOperatorID(state,operatorID){
    let lineIDs = lineIDsGivenOperatorId(state,operatorID)

    return state.services.filter(service =>{
        return lineIDs.has(service.lineID)
    })
}