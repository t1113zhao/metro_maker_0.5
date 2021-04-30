import {combineReducers} from 'redux';
import operatorReducer from '../reducers/operatorsReducer';
import linesReducer from '../reducers/linesReducer';
import servicesReducer from '../reducers/servicesReducer';
import {nodesReducer, addNodeExtern}from '../reducers/nodesReducer';
import {stationReducer, addStation} from '../reducers/stationsReducer';
import { nextIDForArray } from '../utils/utils';

const rootReducer = combineReducers({
    operators: operatorReducer,
    lines: linesReducer,
    services: servicesReducer,
    nodes: nodesReducer,
    stations: stationReducer
});

function crossSliceReducer(state, action){
    switch(action.type) {
        case ADD_STATION:{

            let nodeID = nextIDForArray(state.nodes);
            return{
                ...state,
                nodes: addNodeExtern(state.nodes,action),
                stations: addStation(state.stations,nodeID,action)
            }
        } 
        default:
            return state
    }
}

export default function rootReducer(state, action){
    const intermediateState = rootReducer(state,action);
    const finalState = crossSliceReducer(intermediateState,action);
    return finalState;
}

export function selectOperatorsLinesAndServicesAsTreeObject(state, isSelectable){
    return state.operators.map( operator =>{
        return {
            title: operator.name,
            key: operator.id,
            children: selectLinesAndServicesAsTreeObject(state, false,operator.id),
            selectable: isSelectable
        }
    })
}

export function selectLinesAndServicesAsTreeObject(state, isSelectable, operatorID){
    return state.lines.filter(line =>{
        return line.operatorID === operatorID
    }).map(line =>{
        return {
            title: line.name,
            key: operatorID + "-" + line.id,
            children:selectServicesAsTreeObject(state,false,operatorID,line.id),
            selectable: isSelectable
        }
    })
}

export function selectServicesAsTreeObject(state, isSelectable,operatorID,lineID){
    return state.services.filter(service=>{
        return service.lineID === lineID
    }).map(service=>{
        return{
            title: service.name,
            key: operatorID + "-" + lineID + "-" + service.id,
            isLeaf: true,
            selectable: isSelectable
        }
    })
}
