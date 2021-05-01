import _ from 'underscore';
import { genericMultiDelete, genericMultiRestore, genericSingleDelete, genericSingleRestore, nextIDForArray } from '../utils/utils'

import {
    ADD_TRANSFER,
    EDIT_TRANSFER,
    REMOVE_TRANSFER,
    UNDO_REMOVE_TRANSFER,
    REMOVE_STATION,
    UNDO_REMOVE_STATION,
    REMOVE_NODE,
    UNDO_REMOVE_NODE,
} from './actionTypes'

const initialState = []

export default function transferReducer(state = initialState, action) {
    switch (action.type){
        case ADD_TRANSFER: {
            return doAddTransfer(state, action);
        }
        case EDIT_TRANSFER: {
            return doEditTransfer(state, action);
        }
        case REMOVE_NODE: {
            if(action.payload.stationID){
                return genericMultiDelete(
                    state,
                    selectAllTransfersGivenStationID(
                        state,
                        action.payload.stationID
                    ),
                    action.payload.deletedAt
                )
            }
        }
        case REMOVE_STATION: {
            return genericMultiDelete(
                state,
                selectAllTransfersGivenStationID(
                    state,
                    action.payload.id
                ),
                action.payload.deletedAt
            )
        }
        case REMOVE_TRANSFER:{
            return genericSingleDelete(
                state,
                action.payload.id,
                action.payload.deletedAt)
        }
        case UNDO_REMOVE_NODE: {
            if(action.payload.stationID){
                return genericMultiRestore(
                    state,
                    selectAllTransfersGivenStationID(
                        state,
                        action.payload.stationID
                    )
                )
            }
        }
        case UNDO_REMOVE_STATION:{
            return genericMultiRestore(
                state,
                selectAllTransfersGivenStationID(
                    state,
                    action.payload.id
                )
            )
        }
        case UNDO_REMOVE_TRANSFER:{
            return genericSingleRestore(
                state,
                action.payload.id
            )
        }
        case REMOVE_NODE: {
            return doUndoRemoveTransferDirect(state, action);
        }
            
    }
}

function doAddTransfer(state, action){
    return [
        ...state,
        {
            id: nextIDForArray(state),
            stationIDs: action.stationIDs,
            type: action.type,
            deletedAt: null
        }
    ]
}

function doEditTransfer(state, action){
    return state.map(item => {
        if(item.id!= action.payload.id) {
            return item
        }
        return {
            ...item,
            type: action.type
        }
    })
}

//Deleting a transfer that connects to a deleted station
function doRemoveTransferStation(state, action){
    return state.map(transfer =>{
        if(transfer.stationIDs.contains(action.payload.stationID)){
            return {
                ...transfer,
                deletedAt: action.payload.deletedAt
            }
        }
    })
}

//Deleting exactly 1 transfer
function doRemoveTransferDirect(state, action) {
    return state.map(item =>{
        if(item.id != action.payload.id ){
            return item
        }
        return {
            ...item,
            deletedAt: action.payload.deletedAt
        }
    })
}

function doUndoRemoveTransferStation(state, action){
    return state.map(transfer =>{
        if(transfer.stationIDs.contains(action.payload.stationID) 
            && transfer.deletedAt !== null){
            return {
                ...transfer,
                deletedAt: null
            }
        }
    })
}

//UnDeleting exactly one transfer
function doUndoRemoveTransferDirect(state, action) {
    return state.map(item =>{
        if(item.id != action.payload.id ){
            return item
        }
        return {
            ...item,
            deletedAt: null
        }
    })
}

export function selectAllConnectedStations(state, stationID){
    //for each transfer, create hashmap of station to station
    //then do a BFS search

    let map = new Map();
    state.foreach(element => {
        let A = element.stationIDs[0];
        let B = element.stationIDs[1];

        if(!map.has(A)){
            map.set(A,[B]);
        } else if(!map.get(A).includes(B)){
            map.get(A).push(B);
        }

        if(!map.has(B)){
            map.set(B,[A]);
        } else if(!map.get(B).includes(A)){
            map.get(B).push(A);
        }
    })

    let connectedIDs = [];
    let searchQueue = [];

    searchQueue.push(stationID);
    while(searchQueue.length()>0){
        let cur = searchQueue.shift();

        let connected = map.get(cur);
        connected.foreach(element =>{
            searchQueue.push(element);
            connectedIDs.push(element);
        })
    }

    return connectedIDs
}

export function selectAllTransfersGivenStationID(state, stationID) {
    return state.filter(item =>{
        return (transfer.stationIDs.contains(stationID)).map(transfer =>{
                return transfer.id
            })
    })
}
