import { combineReducers } from 'redux';
import { agencyReducer, selectAllAgencies } from '../reducers/agenciesReducer';
import { linesReducer, selectLinesGivenAgencyId } from '../reducers/linesReducer';
import { servicesReducer, doAddService, selectServicesGivenLineID } from '../reducers/servicesReducer';
import { serviceRouteReducer, doAddServiceRoute } from './serviceRouteReducer'
import { nodesReducer, addNodeExtern } from '../reducers/nodesReducer';
import { stationReducer, addStation } from '../reducers/stationsReducer';
import { nextIDForArray } from '../utils/utils';
import { ADD_SERVICE } from '../actions/actionTypes';

const rootReducer = combineReducers({
    agencies: agencyReducer,
    lines: linesReducer,
    services: servicesReducer,
    serviceRoutes: serviceRouteReducer,
    nodes: nodesReducer,
    stations: stationReducer
});

function crossSliceReducer(state, action) {
    switch (action.type) {
        case ADD_STATION: {

            let nodeID = nextIDForArray(state.nodes);
            return {
                ...state,
                nodes: addNodeExtern(state.nodes, action),
                stations: addStation(state.stations, nodeID, action)
            }
        }
        default:
            return state
    }
}

export default function rootReducer(state, action) {
    const intermediateState = rootReducer(state, action);
    const finalState = crossSliceReducer(intermediateState, action);
    return finalState;
}

export function selectAgenciesLinesAndServicesAsTreeObject(state, isSelectable) {
    return selectAllAgencies(state,false).map(agency => {
        return {
            title: agency.name,
            key: agency.id,
            children: selectLinesAndServicesAsTreeObject(state, false, agency.id),
            selectable: isSelectable
        }
    })
}

export function selectLinesAndServicesAsTreeObject(state, isSelectable, agencyID) {
    return selectLinesGivenAgencyId(state, agencyID, false).map(line => {
        return {
            title: line.name,
            key: agencyID + "-" + line.id,
            children: selectServicesAsTreeObject(state, false, agencyID, line.id),
            selectable: isSelectable
        }
    })
}

export function selectServicesAsTreeObject(state, isSelectable, agencyID, lineID) {
    return selectServicesGivenLineID(state, lineID, false).map(service => {
        return {
            title: service.name,
            key: agencyID + "-" + lineID + "-" + service.id,
            isLeaf: true,
            selectable: isSelectable
        }
    })
}
