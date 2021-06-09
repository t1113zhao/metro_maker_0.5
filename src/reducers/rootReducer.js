import { combineReducers } from 'redux';
import agencyReducer from '../reducers/agenciesReducer';
import { selectAllAgencies } from '../reducers/agenciesReducer';
import linesReducer from '../reducers/linesReducer';
import { selectLinesGivenAgencyId } from '../reducers/linesReducer';
import servicesReducer, { doAddService } from '../reducers/servicesReducer';
import { selectServicesGivenLineID } from '../reducers/servicesReducer';
import serviceRouteReducer, { doAddServiceRoute } from '../reducers/serviceRouteReducer';
import stationReducer from '../reducers/stationsReducer';
import { nextIDForArray } from '../utils/utils';
import {
    ADD_SERVICE
} from '../actions/actionTypes';
import trackRouteReducer from './trackRouteReducer'
import transferReducer from './transferReducer';

export const combinedReducers = combineReducers({
    agencies: agencyReducer,
    lines: linesReducer,
    services: servicesReducer,
    serviceRoutes: serviceRouteReducer,
    stations: stationReducer,
    tracks: trackRouteReducer,
    transfers: transferReducer
});

export function crossSliceReducer(state, action) {
    switch (action.type) {
        case ADD_SERVICE: {
            return rootAddService(state, action)
        }
        default:
            return state
    }
}

export default function rootReducer(state, action) {
    const intermediateState = combinedReducers(state, action);
    const finalState = crossSliceReducer(intermediateState, action);
    return finalState;
}

export function selectAgenciesLinesAndServicesAsTreeObject(state, isSelectable) {
    return selectAllAgencies(state, false).map(agency => {
        return {
            title: agency.name,
            key: agency.id + "",
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

function rootAddService(state, action) {
    let serviceID = nextIDForArray(state.services);
    return {
        ...state,
        services: doAddService(state.services, action),
        serviceRoutes: doAddServiceRoute(state.serviceRoutes, serviceID)
    }
}
