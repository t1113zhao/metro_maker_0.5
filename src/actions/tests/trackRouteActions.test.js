import {
    ADD_STRAIGHT_SEGMENT,
    ADD_CURVED_SEGMENT,
    STRAIGHT_TO_CURVED,
    CURVED_TO_STRAIGHT,
    BREAK_SEGMENT,
    REMOVE_SEGMENT,
    RESTORE_SEGMENT
} from '../actionTypes'
import * as actions from '../trackRouteActions'

it('Add Straight Track Segment Action Creator', () => {
    let latA = 43
    let lngA = -76
    let latB = 44
    let lngB = -78

    let node_A_ID = 0
    let node_B_ID = 1
    let trackID = 0

    expect(actions.addStraightSegment(
        latA, lngA, latB, lngB, node_A_ID, node_B_ID, trackID
    )).toEqual({
        type: ADD_STRAIGHT_SEGMENT,
        payload: {
            latitudes: [latA, latB],
            longitudes: [lngA, lngB],
            nodeIDs: [node_A_ID, node_B_ID],
            trackID: trackID
        }
    })
})

it('Add Curved Track Segment Action Creator', () => {
    let latA = 43
    let lngA = -76
    let latB = 44
    let lngB = -78
    let latC = 45
    let lngC = -77

    let node_A_ID = 0
    let node_B_ID = 1
    let node_C_ID = 2
    let trackID = 0

    expect(actions.addCurvedSegment(
        latA, lngA, latB, lngB, latC, lngC, node_A_ID, node_B_ID, node_C_ID, trackID
    )).toEqual({
        type: ADD_CURVED_SEGMENT,
        payload: {
            latitudes: [latA, latB, latC],
            longitudes: [lngA, lngB, lngC],
            nodeIDs: [node_A_ID, node_B_ID, node_C_ID],
            trackID: trackID
        }
    })
})

it('Straight to Curved Segment Action Creator', () => {
    let segmentID = 0
    let trackID = 0

    expect(actions.straightToCurved(segmentID, trackID)).toEqual({
        type: STRAIGHT_TO_CURVED,
        payload: {
            id: segmentID,
            trackID: trackID
        }
    })
})

it('Curved to Straight Segment Action Creator', () => {
    let segmentID = 0
    let trackID = 0

    expect(actions.curvedToStraight(segmentID, trackID)).toEqual({
        type: CURVED_TO_STRAIGHT,
        payload: {
            id: segmentID,
            trackID: trackID
        }
    })
})

it('Break Segment Action Creator', () => {
    let segmentID = 0
    let trackID = 0

    expect(actions.breakSegment(segmentID, trackID)).toEqual({
        type: BREAK_SEGMENT,
        payload: {
            id: segmentID,
            trackID: trackID
        }
    })
})

it('Remove Segment Action Creator', () => {
    let segmentID = 0
    let trackID = 0

    expect(actions.removeSegment(segmentID, trackID)).toEqual({
        type: REMOVE_SEGMENT,
        payload: {
            id: segmentID,
            trackID: trackID
        }
    })
})

it('Restore Segment Action Creator', () => {
    let segmentID = 0
    let trackID = 0
    let restoreSegment = { id: 3, endNodes: [3, 4], controlPoint: null }
    let nodesToRestore = [
        { id: 4, stationID: null, latitude: 43.72, longitude: -79.485 },
    ]


    expect(actions.restoreSegment(segmentID, trackID, restoreSegment, nodesToRestore)).toEqual({
        type: RESTORE_SEGMENT,
        payload: {
            id: segmentID,
            trackID: trackID,
            segmentToRestore: restoreSegment,
            nodesToRestore: nodesToRestore
        }
    })
})
