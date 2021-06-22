import {
    ADD_STRAIGHT_SEGMENT,
    ADD_CURVED_SEGMENT,
    STRAIGHT_TO_CURVED,
    CURVED_TO_STRAIGHT,
    BREAK_SEGMENT,
    UNDO_BREAK_SEGMENT,
    MERGE_SEGMENTS,
    UNDO_MERGE_SEGMENTS,
    REMOVE_SEGMENT,
    RESTORE_SEGMENT,
} from '../actionTypes'
import * as actions from '../trackRouteActions'

describe('track route action creators', () => {

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
                segmentID: segmentID,
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
                segmentID: segmentID,
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
                segmentID: segmentID,
                trackID: trackID
            }
        })
    })

    it('Unbreak Segment Action Creator', () => {
        let segmentA_ID = 0
        let segmentB_ID = 1
        let trackID = 2

        expect(actions.undoBreakSegment(
            segmentA_ID, segmentB_ID, trackID,
            { id: 5, stationID: null, latitude: 43.73, longitude: -79.48 },
            { id: 2, isCurved: true, endNodes: [2, 4], controlPoint: 5 }
        )).toEqual({
            type: UNDO_BREAK_SEGMENT,
            payload: {
                trackID: 2,
                segmentIDs: [segmentA_ID, segmentB_ID],
                nodeToRestore: { id: 5, stationID: null, latitude: 43.73, longitude: -79.48 },
                segmentToRestore: { id: 2, isCurved: true, endNodes: [2, 4], controlPoint: 5 }
            }
        })
    })

    it('Merge Segment Action Creator', () => {
        let segmentA_ID = 0
        let segmentB_ID = 1
        let trackID = 0

        expect(actions.mergeSegments(segmentA_ID, segmentB_ID, trackID)).toEqual({
            type: MERGE_SEGMENTS,
            payload: {
                segmentIDs: [segmentA_ID, segmentB_ID],
                trackID: trackID
            }
        })
    })

    it('UnMerge Segment Action Creator', () => {
        let trackID = 0
        let segmentToRemoveID = 1
        let segmentsToRestore = [
            { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
            { id: 2, isCurved: false, endNodes: [2, 4], controlPoint: null }
        ]
        let nodesToRestore = [
            { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
            { id: 4, stationID: null, latitude: 43.72, longitude: -79.485 },
        ]

        expect(actions.undoMergeSegment(
            trackID,
            segmentToRemoveID,
            segmentsToRestore,
            nodesToRestore
        )).toEqual({
            type: UNDO_MERGE_SEGMENTS,
            payload: {
                trackID: trackID,
                segmentToRemoveID: segmentToRemoveID,
                segmentsToRestore: segmentsToRestore,
                nodesToRestore: nodesToRestore,
            }
        })
    })

    it('Remove Segment Action Creator', () => {
        let segmentID = 0
        let trackID = 0

        expect(actions.removeSegment(segmentID, trackID)).toEqual({
            type: REMOVE_SEGMENT,
            payload: {
                segmentID: segmentID,
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
                segmentID: segmentID,
                trackID: trackID,
                segmentToRestore: restoreSegment,
                nodesToRestore: nodesToRestore
            }
        })
    })

    it('should get inverse trackroute actions', () => {
        let state = [
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.45 }
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 1], controlPoint: null }
                ],
                deletedAt: null
            },
            {
                id: 1,
                stationIDs: [1, 2],
                nodes: [
                    { id: 0, stationID: 1, latitude: 43.7, longitude: -79.45 },
                    { id: 1, stationID: 2, latitude: 43.7, longitude: -79.46 }
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 1], controlPoint: null }
                ],
                deletedAt: null
            },
        ]

        expect(actions.getInverseTrackRouteActions(state, {
            type: ADD_STRAIGHT_SEGMENT,
            payload: {
                latitudes: [43.72, 43.72],
                longitudes: [-79.46, -79.485],
                nodeIDs: [2, null],
                trackID: 0
            }
        })).toEqual({
            type: REMOVE_SEGMENT,
            payload: {
                segmentID: 1,
                trackID: 0,
            }
        })

        expect(actions.getInverseTrackRouteActions(state, {
            type: ADD_STRAIGHT_SEGMENT,
            payload: {
                latitudes: [43.72, 43.75, 43.725],
                longitudes: [-79.46, -79.47, -79.465],
                nodeIDs: [2, null, null],
                trackID: 0
            }
        })).toEqual({
            type: REMOVE_SEGMENT,
            payload: {
                segmentID: 1,
                trackID: 0,
            }
        })

        expect(actions.getInverseTrackRouteActions(state, {
            type: STRAIGHT_TO_CURVED,
            payload: {
                trackID: 1,
                segmentID: 0,
            }
        })).toEqual({
            type: CURVED_TO_STRAIGHT,
            payload: {
                trackID: 1,
                segmentID: 0,
            }
        })

        expect(actions.getInverseTrackRouteActions(state, {
            type: CURVED_TO_STRAIGHT,
            payload: {
                trackID: 1,
                segmentID: 0,
            }
        })).toEqual({
            type: STRAIGHT_TO_CURVED,
            payload: {
                trackID: 1,
                segmentID: 0,
            }
        })

        let breakState1 = [
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.45 }
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 1], controlPoint: null }
                ],
                deletedAt: null
            },
        ]

        let breakState2 = [
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.45 },
                    { id: 2, stationID: null, latitude: 43.8, longitude: -79.445 },
                ],
                segments: [
                    { id: 0, isCurved: true, endNodes: [0, 1], controlPoint: 2 }
                ],
                deletedAt: null
            },
        ]

        let mergeState1 = [
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.45 },
                    { id: 2, stationID: null, latitude: 43.7, longitude: -79.445 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [2, 1], controlPoint: null }
                ],
                deletedAt: null
            },
        ]

        let mergeState2 = [
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.45 },
                    { id: 2, stationID: null, latitude: 43.8, longitude: -79.445 },
                    { id: 3, stationID: null, latitude: 43.8, longitude: -79.44 },
                ],
                segments: [
                    { id: 0, isCurved: true, endNodes: [0, 2], controlPoint: 3 },
                    { id: 1, isCurved: false, endNodes: [2, 1], controlPoint: null }
                ],
                deletedAt: null
            },
        ]

        let mergeState3 = [
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.45 },
                    { id: 2, stationID: null, latitude: 43.8, longitude: -79.445 },
                    { id: 3, stationID: null, latitude: 43.8, longitude: -79.44 },
                    { id: 4, stationID: null, latitude: 43.8, longitude: -79.45 },
                ],
                segments: [
                    { id: 0, isCurved: true, endNodes: [0, 2], controlPoint: 3 },
                    { id: 1, isCurved: true, endNodes: [2, 1], controlPoint: 4 }
                ],
                deletedAt: null
            },
        ]

        expect(actions.getInverseTrackRouteActions(breakState1, {
            type: BREAK_SEGMENT,
            payload: {
                trackID: 0,
                segmentID: 0,
            }
        })).toEqual({
            type: UNDO_BREAK_SEGMENT,
            payload: {
                trackID: 0,
                segmentIDs: [0, 1],
                nodeToRestore: null,
                segmentToRestore: { id: 0, isCurved: false, endNodes: [0, 1], controlPoint: null }
            }
        })

        expect(actions.getInverseTrackRouteActions(breakState2, {
            type: BREAK_SEGMENT,
            payload: {
                trackID: 0,
                segmentID: 0,
            }
        })).toEqual({
            type: UNDO_BREAK_SEGMENT,
            payload: {
                trackID: 0,
                segmentIDs: [0, 1],
                nodeToRestore: { id: 2, stationID: null, latitude: 43.8, longitude: -79.445 },
                segmentToRestore: { id: 0, isCurved: true, endNodes: [0, 1], controlPoint: 2 }
            }
        })

        expect(actions.getInverseTrackRouteActions(mergeState1, {
            type: MERGE_SEGMENTS,
            payload: {
                trackID: 0,
                segmentIDs: [0, 1],
            }
        })).toEqual({
            type: UNDO_MERGE_SEGMENTS,
            payload: {
                trackID: 0,
                segmentToRemoveID: 0,
                segmentsToRestore: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [2, 1], controlPoint: null }
                ],
                nodesToRestore: [
                    { id: 2, stationID: null, latitude: 43.7, longitude: -79.445 },
                ]
            }
        })

        expect(actions.getInverseTrackRouteActions(mergeState2, {
            type: MERGE_SEGMENTS,
            payload: {
                trackID: 0,
                segmentIDs: [0, 1],
            }
        })).toEqual({
            type: UNDO_MERGE_SEGMENTS,
            payload: {
                trackID: 0,
                segmentToRemoveID: 0,
                segmentsToRestore: [
                    { id: 0, isCurved: true, endNodes: [0, 2], controlPoint: 3 },
                    { id: 1, isCurved: false, endNodes: [2, 1], controlPoint: null }
                ],
                nodesToRestore: [
                    { id: 2, stationID: null, latitude: 43.8, longitude: -79.445 },
                    { id: 3, stationID: null, latitude: 43.8, longitude: -79.44 },
                ]
            }
        })

        expect(actions.getInverseTrackRouteActions(mergeState3, {
            type: MERGE_SEGMENTS,
            payload: {
                trackID: 0,
                segmentIDs: [0, 1],
            }
        })).toEqual({
            type: UNDO_MERGE_SEGMENTS,
            payload: {
                trackID: 0,
                segmentToRemoveID: 0,
                segmentsToRestore: [
                    { id: 0, isCurved: true, endNodes: [0, 2], controlPoint: 3 },
                    { id: 1, isCurved: true, endNodes: [2, 1], controlPoint: 4 }
                ],
                nodesToRestore: [
                    { id: 2, stationID: null, latitude: 43.8, longitude: -79.445 },
                    { id: 3, stationID: null, latitude: 43.8, longitude: -79.44 },
                    { id: 4, stationID: null, latitude: 43.8, longitude: -79.45 },
                ]
            }
        })

        expect(actions.getInverseTrackRouteActions(mergeState3, {
            type: UNDO_MERGE_SEGMENTS,
            payload: {
                trackID: 0,
                segmentToRemoveID: 0,
                segmentsToRestore: [
                    { id: 0, isCurved: true, endNodes: [0, 2], controlPoint: 3 },
                    { id: 1, isCurved: true, endNodes: [2, 1], controlPoint: 4 }
                ],
                nodesToRestore: [
                    { id: 2, stationID: null, latitude: 43.8, longitude: -79.445 },
                    { id: 3, stationID: null, latitude: 43.8, longitude: -79.44 },
                    { id: 4, stationID: null, latitude: 43.8, longitude: -79.45 },
                ]
            }
        })).toEqual({
            type: MERGE_SEGMENTS,
            payload: {
                trackID: 0,
                segmentIDs: [0, 1],
            }
        })

        expect(actions.getInverseTrackRouteActions(state, {
            type: REMOVE_SEGMENT,
            payload: {
                trackID: 1,
                segmentID: 0,
            }
        })).toEqual({
            type: RESTORE_SEGMENT,
            payload: {
                trackID: 1,
                segmentID: 0,
                segmentToRestore:
                    { id: 0, isCurved: false, endNodes: [0, 1], controlPoint: null }
                ,
                nodesToRestore: []
            }
        })

        expect(actions.getInverseTrackRouteActions(state, {
            type: RESTORE_SEGMENT,
            payload: {
                trackID: 1,
                segmentID: 0,
                segmentToRestore:
                    { id: 0, isCurved: false, endNodes: [0, 1], controlPoint: null }
                ,
                nodesToRestore: []
            }
        })).toEqual({
            type: REMOVE_SEGMENT,
            payload: {
                trackID: 1,
                segmentID: 0,
            }
        })
    })
})
