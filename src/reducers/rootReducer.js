import { combineReducers } from 'redux';
import agencyReducer from '../reducers/agenciesReducer';
import { selectAllAgencies } from '../reducers/agenciesReducer';
import linesReducer from '../reducers/linesReducer';
import { selectLinesGivenAgencyId } from '../reducers/linesReducer';
import servicesReducer, { doAddService } from '../reducers/servicesReducer';
import { selectServicesGivenLineID } from '../reducers/servicesReducer';
import serviceRouteReducer, { doAddServiceRoute } from '../reducers/serviceRouteReducer';
import stationReducer, { selectStationsGivenStationIDs } from '../reducers/stationsReducer';
import { addStation, selectAllNodeIdsGivenStationIDs } from '../reducers/stationsReducer';
import { nextIDForArray } from '../utils/utils';
import {
    ADD_SERVICE,
    ADD_TRACK,
} from '../actions/actionTypes';
import trackReducer, { doAddTrack } from './trackReducer';
import trackRouteReducer, { doAddTrackRoute } from './trackRouteReducer'
import transferReducer from './transferReducer';

const combinedReducers = combineReducers({
    agencies: agencyReducer,
    lines: linesReducer,
    services: servicesReducer,
    serviceRoutes: serviceRouteReducer,
    stations: stationReducer,
    tracks: trackReducer,
    trackRoutes: trackRouteReducer,
    transfers: transferReducer
});

function crossSliceReducer(state, action) {
    switch (action.type) {
        case ADD_SERVICE: {
            return rootAddService(state, action)
        }
        case ADD_TRACK: {
            return rootAddTrack(state, action)
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

function rootAddService(state, action) {
    let serviceID = nextIDForArray(state.services);
    return {
        ...state,
        services: doAddService(state.services, action),
        serviceRoutes: doAddServiceRoute(state.serviceRoutes, serviceID)
    }
}

function rootAddTrack(state, action) {

    let stations = selectStationsGivenStationIDs(state.stations, action.payload.stationIDs)

    let trackID = nextIDForArray(state.tracks)
    return {
        ...state,
        tracks: doAddTrack(state.tracks, action),
        trackRoutes: doAddTrackRoute(
            state.trackRoutes,
            action,
            trackID,
            stations
        )
    }
}
