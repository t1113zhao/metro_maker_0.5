import {
    ADD_SERVICETRACK_TWOWAY,
    ADD_SERVICETRACK_ONEWAY,
    SWITCH_ONEWAY_DIRECTION,
    ONEWAY_TO_TWOWAY,
    TWOWAY_TO_ONEWAY,
    CLEAR_SERVICE_ROUTE,
    UNDO_CLEAR_SERVICE_ROUTE,
    CLEAR_SERVICE_TRACK_BLOCK,
    UNDO_CLEAR_SERVICE_TRACK_BLOCK,
    REMOVE_SERVICE_TRACK_BLOCK,
    RESTORE_SERVICE_TRACK_BLOCK,
    REMOVE_STOP,
    RESTORE_STOP
} from '../actionTypes'
import * as actions from '../serviceRouteActions'

it('Add Two Way Service Action Creator', () => {
    let trackID = 0
    let serviceID = 0
    let stationA_ID = 0
    let stationB_ID = 1
    let index = 0

    expect(actions.addTwoWayService(
        trackID, serviceID, stationA_ID, stationB_ID, index
    )).toEqual({
        type: ADD_SERVICETRACK_TWOWAY,
        payload: {
            trackID: trackID,
            serviceID: serviceID,
            stationIDs: [stationA_ID, stationB_ID],
            index: index    
        }
    })
})

it('Add One Way Service Action Creator', () => {
    let trackID = 0
    let serviceID = 0
    let fromID = 0
    let toID = 1
    let index = 0

    expect(actions.addOneWayService(
        trackID, serviceID, fromID, toID, index
    )).toEqual({
        type: ADD_SERVICETRACK_ONEWAY,
        payload: {
            trackID: trackID,
            serviceID: serviceID,
            fromID: fromID,
            toID: toID,
            index: index    
        }
    })
})

it('Switch One Way Direction Action Creator', () => {
    let trackID = 0
    let serviceID = 0
    let index = 0

    expect(actions.switchOneWayDirection(trackID, serviceID, index)).toEqual({
        type: SWITCH_ONEWAY_DIRECTION,
        payload: {
            trackID: trackID,
            serviceID: serviceID,
            index: index
        }
    })
})

it('One Way to Two Way Service Action Creator', () => {
    let trackID = 0
    let serviceID = 0
    let index = 0

    expect(actions.oneWayToTwoWay(trackID, serviceID, index)).toEqual({
        type: ONEWAY_TO_TWOWAY,
        payload: {
            trackID: trackID,
            serviceID: serviceID,
            index: index
        }
    })
})

it('Two Way to One Way Service Action Creator', () => {
    let trackID = 0
    let serviceID = 0
    let index = 0

    expect(actions.twoWayToOneWay(trackID, serviceID, index)).toEqual({
        type: TWOWAY_TO_ONEWAY,
        payload: {
            trackID: trackID,
            serviceID: serviceID,
            index: index
        }
    })
})

it('Clear Service Route Action Creator', () => {
    let serviceID = 0
    expect(actions.clearServiceRoute(serviceID)).toEqual({
        type: CLEAR_SERVICE_ROUTE,
        payload: {
            serviceID: serviceID
        }
    })
})

it('Undo Clear Service Route Action Creator', () => {
    let serviceID = 0
    let stops = [0, 1, 2, 3, 4]
    let serviceTracks = [0, 1, 2, 3, 4]
    expect(actions.undoClearServiceRoute(serviceID, stops, serviceTracks)).toEqual({
        type: UNDO_CLEAR_SERVICE_ROUTE,
        payload: {
            serviceID: serviceID,
            stops: stops,
            serviceTracks: serviceTracks
        }
    })
})

it('Clear Track Block Action Creator', () => {
    let trackID = 0
    let serviceID = 0
    let index = 0
    expect(actions.clearTrackBlock(serviceID, trackID, index)).toEqual({
        type: CLEAR_SERVICE_TRACK_BLOCK,
        payload: {
            trackID: trackID,
            serviceID: serviceID,
            index: index
        }
    })
})

it('Undo Clear Track Block Action Creator', () => {
    let trackID = 0
    let serviceID = 0
    let index = 0
    let block = [0 ,1]
    expect(actions.undoClearTrackBlock(serviceID, trackID, index, block)).toEqual({
        type: UNDO_CLEAR_SERVICE_TRACK_BLOCK,
        payload: {
            trackID: trackID,
            serviceID: serviceID,
            index: index,
            block: block
        }
    })
})

it('Remove Track Block Action Creator', () => {
    let trackID = 0
    let serviceID = 0
    let index = 0
    expect(actions.removeTrackBlock(serviceID, trackID, index)).toEqual({
        type: REMOVE_SERVICE_TRACK_BLOCK,
        payload: {
            trackID: trackID,
            serviceID: serviceID,
            index: index
        }
    })
})

it('Restore Track Block Action Creator', () => {
    let trackID = 0
    let serviceID = 0
    let index = 0
    let block = [0, 1]
    expect(actions.restoreTrackBlock(serviceID, trackID, index, block)).toEqual({
        type: RESTORE_SERVICE_TRACK_BLOCK,
        payload: {
            trackID: trackID,
            serviceID: serviceID,
            index: index,
            block: block
        }
    })
})

it('Remove Stop Action Creator', () => {
    let serviceID = 0
    let stationID = 0
    expect(actions.removeStop(serviceID, stationID)).toEqual({
        type: REMOVE_STOP,
        payload: {
            serviceID: serviceID,
            stationID: stationID
        }
    })
})

it('Restore Stop Action Creator', () => {
    let serviceID = 0
    let stationID = 0
    expect(actions.restoreStop(serviceID, stationID)).toEqual({
        type: RESTORE_STOP,
        payload: {
            serviceID: serviceID,
            stationID: stationID
        }
    })
})