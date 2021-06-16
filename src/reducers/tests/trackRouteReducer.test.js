import {
    REMOVE_STATION,
    RESTORE_STATION,

    ADD_TRACK,
    UNDO_ADD_TRACK,
    REMOVE_TRACK,
    RESTORE_TRACK,

    MOVE_NODE,
    MOVE_STATION,
    ADD_STRAIGHT_SEGMENT,
    ADD_CURVED_SEGMENT,
    STRAIGHT_TO_CURVED,
    CURVED_TO_STRAIGHT,
    BREAK_SEGMENT,
    REMOVE_SEGMENT,
    RESTORE_SEGMENT,
} from '../../actions/actionTypes'
import { haversineMidpoint } from '../../utils/utils'

import reducer from '../trackRouteReducer'
import { getNodesThatOnlyGivenSegmentsConnectTo } from '../trackRouteReducer'

describe('remove and restore trackRoute reducer correctly', () => {
    it('should remove track correctly when track removed', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275);
        let date = new Date().toISOString()

        expect(reducer([
            { id: 0, deletedAt: null },
            { id: 1, deletedAt: null },
            { id: 2, deletedAt: null },
            { id: 3, deletedAt: null },
        ], {
            type: REMOVE_TRACK,
            payload: {
                id: 0,
                deletedAt: date
            }
        })).toEqual([
            { id: 0, deletedAt: date },
            { id: 1, deletedAt: null },
            { id: 2, deletedAt: null },
            { id: 3, deletedAt: null },
        ])
    })

    it('should remove track correctly when station removed', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275);
        let date = new Date().toISOString()

        expect(reducer([
            { id: 0, deletedAt: null },
            { id: 1, deletedAt: null },
            { id: 2, deletedAt: null },
            { id: 3, deletedAt: null },
        ], {
            type: REMOVE_STATION,
            payload: {
                id: 0,
                deletedAt: date,
                trackIDs: [0, 2, 3],
                transferIDs: [1, 2]
            }
        })).toEqual([
            { id: 0, deletedAt: date },
            { id: 1, deletedAt: null },
            { id: 2, deletedAt: date },
            { id: 3, deletedAt: date },
        ])
    })

    it('should restore track route correctly when track restore', () => {

        expect(reducer([
            { id: 0, deletedAt: 'last tuesday' },
            { id: 1, deletedAt: null },
            { id: 2, deletedAt: null },
            { id: 3, deletedAt: null },
        ], {
            type: RESTORE_TRACK,
            payload: {
                id: 0
            }
        })).toEqual([
            { id: 0, deletedAt: null },
            { id: 1, deletedAt: null },
            { id: 2, deletedAt: null },
            { id: 3, deletedAt: null },
        ])
    })

    it('should restore track correctly when station restored', () => {

        expect(reducer([
            { id: 0, deletedAt: 'last tuesday' },
            { id: 1, deletedAt: 'last tuesday' },
            { id: 2, deletedAt: 'last tuesday' },
            { id: 3, deletedAt: 'last tuesday' },
        ], {
            type: RESTORE_STATION,
            payload: {
                id: 0,
                trackIDs: [0, 2, 3],
                transferIDs: [1, 2]
            }
        })).toEqual([
            { id: 0, deletedAt: null },
            { id: 1, deletedAt: 'last tuesday' },
            { id: 2, deletedAt: null },
            { id: 3, deletedAt: null },
        ])
    })

})

describe('Track route reducer operates correctly', () => {

    it('should create initial state correctly', () => {
        expect(reducer(undefined, {})).toEqual([])
    })

    let stateWithOneTrack = [
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
        }
    ]

    let stateWithTwoTracks = [
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

    it('should add to empty state correctly', () => {
        let stations = [
            { id: 0, latitude: 43.7, longitude: -79.44 },
            { id: 1, latitude: 43.7, longitude: -79.45 }
        ]

        expect(reducer([], {
            type: ADD_TRACK,
            payload: {
                stations: stations
            }
        })).toEqual(stateWithOneTrack)
    })

    it('should add new track to non-empty state correctly', () => {
        let stations = [
            { id: 1, latitude: 43.7, longitude: -79.45 },
            { id: 2, latitude: 43.7, longitude: -79.46 }
        ]

        expect(reducer(stateWithOneTrack, {
            type: ADD_TRACK,
            payload: {
                stations: stations
            }
        })).toEqual(stateWithTwoTracks)
    })

    it('should undo add new track to empty state', () => {
        expect(reducer(stateWithOneTrack, {
            type: UNDO_ADD_TRACK,
            payload: {
                id: 0
            }
        })).toEqual([])
    })

    it('should undo add new track to non empty state', () => {
        expect(reducer(stateWithTwoTracks, {
            type: UNDO_ADD_TRACK,
            payload: {
                id: 1
            }
        })).toEqual(stateWithOneTrack)
    })

    let stateWithGap = [
        {
            id: 0,
            stationIDs: [0, 1],
            nodes: [
                { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
            ],
            segments: [
                { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null }
            ],
            deletedAt: null
        },
    ]


    // add node at 43.72, -79.485
    it('should add a straight segment that creates a new node', () => {
        expect(reducer(stateWithGap, {
            type: ADD_STRAIGHT_SEGMENT,
            payload: {
                latitudes: [43.72, 43.72],
                longitudes: [-79.46, -79.485],
                nodeIDs: [2, null],
                trackID: 0
            }
        })).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                    { id: 4, stationID: null, latitude: 43.72, longitude: -79.485 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: false, endNodes: [2, 4], controlPoint: null }
                ],
                deletedAt: null
            },
        ])
    })

    it('should add a straight segment that connects two existing nodes', () => {
        expect(reducer(stateWithGap, {
            type: ADD_STRAIGHT_SEGMENT,
            payload: {
                latitudes: [43.72, 43.72,],
                longitudes: [-79.46, -79.47],
                nodeIDs: [2, 3],
                trackID: 0
            }
        })).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: false, endNodes: [2, 3], controlPoint: null }
                ],
                deletedAt: null
            },
        ])
    })

    it('should add a curved segment that that creates 2 new nodes', () => {
        expect(reducer(stateWithGap, {
            type: ADD_CURVED_SEGMENT,
            payload: {
                latitudes: [43.72, 43.75, 43.725],
                longitudes: [-79.46, -79.47, -79.465],
                nodeIDs: [2, null, null],
                trackID: 0
            }
        })).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                    { id: 4, stationID: null, latitude: 43.75, longitude: -79.47 },
                    { id: 5, stationID: null, latitude: 43.725, longitude: -79.465 },

                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: true, endNodes: [2, 4], controlPoint: 5 }
                ],
                deletedAt: null
            },
        ])
    })

    it('should add a curved segment that connects two existing nodes', () => {
        expect(reducer(stateWithGap, {
            type: ADD_CURVED_SEGMENT,
            payload: {
                latitudes: [43.72, 43.72, 43.725],
                longitudes: [-79.46, -79.47, -79.465],
                nodeIDs: [2, 3, null],
                trackID: 0
            }
        })).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                    { id: 4, stationID: null, latitude: 43.725, longitude: -79.465 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: true, endNodes: [2, 3], controlPoint: 4 }
                ],
                deletedAt: null
            },
        ])
    })

    it('should turn a straight segment that was never curved, curved', () => {
        expect(reducer([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: false, endNodes: [2, 3], controlPoint: null }
                ],
                deletedAt: null
            },
        ], {
            type: STRAIGHT_TO_CURVED,
            payload: {
                id: 2,
                trackID: 0
            }
        })).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                    { id: 4, stationID: null, latitude: 43.72, longitude: -79.465 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: true, endNodes: [2, 3], controlPoint: 4 }
                ],
                deletedAt: null
            },
        ])
    })

    it('should turn a straight segment that was curved, curved', () => {
        expect(reducer([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                    { id: 4, stationID: null, latitude: 43.72, longitude: -79.465 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: false, endNodes: [2, 3], controlPoint: 4 }
                ],
                deletedAt: null
            },
        ], {
            type: STRAIGHT_TO_CURVED,
            payload: {
                id: 2,
                trackID: 0
            }
        })).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                    { id: 4, stationID: null, latitude: 43.72, longitude: -79.465 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: true, endNodes: [2, 3], controlPoint: 4 }
                ],
                deletedAt: null
            },
        ])
    })

    it('should turn a curved segment straight', () => {
        expect(reducer([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                    { id: 4, stationID: null, latitude: 43.72, longitude: -79.465 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: true, endNodes: [2, 3], controlPoint: 4 }
                ],
                deletedAt: null
            },
        ], {
            type: CURVED_TO_STRAIGHT,
            payload: {
                id: 2,
                trackID: 0
            }
        })).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                    { id: 4, stationID: null, latitude: 43.72, longitude: -79.465 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: false, endNodes: [2, 3], controlPoint: 4 }
                ],
                deletedAt: null
            },
        ])
    })

    it('should break a segment', () => {
        expect(reducer([
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
        ], {
            type: BREAK_SEGMENT,
            payload: {
                id: 0,
                trackID: 0
            }
        })).toEqual([
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
        ])
    })

    it('should remove a segment', () => {
        //remove the one segment of a track
        expect(reducer([
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
        ], {
            type: REMOVE_SEGMENT,
            payload: {
                id: 0,
                trackID: 0,
            }
        })).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.45 }
                ],
                segments: [],
                deletedAt: null
            },
        ])

        //remove a non dangling segment not connected to stations
        expect(reducer([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: false, endNodes: [2, 3], controlPoint: null }
                ],
                deletedAt: null
            },
        ], {
            type: REMOVE_SEGMENT,
            payload: {
                id: 2,
                trackID: 0
            }
        })).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                ],
                deletedAt: null
            },
        ])

        //remove a dangling segment connected to a station
        expect(reducer([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                ],
                deletedAt: null
            }
        ], {
            type: REMOVE_SEGMENT,
            payload: {
                id: 1,
                trackID: 0
            }
        })).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                ],
                deletedAt: null
            }
        ])

        //remove a dangling straight segment
        expect(reducer([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                    { id: 4, stationID: null, latitude: 43.72, longitude: -79.485 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: false, endNodes: [2, 4], controlPoint: null }
                ],
                deletedAt: null
            },
        ], {
            type: REMOVE_SEGMENT,
            payload: {
                id: 2,
                trackID: 0,
            }
        })).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                ],
                deletedAt: null
            },
        ])

        //remove a dangling curved segment
        expect(reducer([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                    { id: 4, stationID: null, latitude: 43.72, longitude: -79.485 },
                    { id: 5, stationID: null, latitude: 43.73, longitude: -79.48 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: true, endNodes: [2, 4], controlPoint: 5 }
                ],
                deletedAt: null
            },
        ], {
            type: REMOVE_SEGMENT,
            payload: {
                id: 2,
                trackID: 0,
            }
        })).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                ],
                deletedAt: null
            },
        ])

    })

    it('should restore a segment', () => {
        //restore the single segment of a track
        expect(reducer([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.45 }
                ],
                segments: [],
                deletedAt: null
            },
        ], {
            type: RESTORE_SEGMENT,
            payload: {
                id: 0,
                trackID: 0,
                segmentToRestore: { id: 0, isCurved: false, endNodes: [0, 1], controlPoint: null },
                nodesToRestore: []
            }
        })).toEqual([
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
        ])

        //restore a non dangling segment not connected to stations
        expect(reducer([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                ],
                deletedAt: null
            },
        ], {
            type: RESTORE_SEGMENT,
            payload: {
                id: 2,
                trackID: 0,
                segmentToRestore: { id: 2, isCurved: false, endNodes: [2, 3], controlPoint: null },
                nodesToRestore: []
            }
        })).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: false, endNodes: [2, 3], controlPoint: null }
                ],
                deletedAt: null
            },
        ])

        //restore a dangling segment connected to a station
        expect(reducer([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                ],
                deletedAt: null
            }
        ], {
            type: RESTORE_SEGMENT,
            payload: {
                id: 1,
                trackID: 0,
                segmentToRestore: { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                nodesToRestore: [
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                ]
            }
        })).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                ],
                deletedAt: null
            }
        ])

        //restore a dangling straight segment
        expect(reducer([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                ],
                deletedAt: null
            },
        ], {
            type: RESTORE_SEGMENT,
            payload: {
                id: 2,
                trackID: 0,
                segmentToRestore: { id: 2, isCurved: false, endNodes: [2, 4], controlPoint: null },
                nodesToRestore: [
                    { id: 4, stationID: null, latitude: 43.72, longitude: -79.485 },
                ]
            }
        })).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                    { id: 4, stationID: null, latitude: 43.72, longitude: -79.485 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: false, endNodes: [2, 4], controlPoint: null }
                ],
                deletedAt: null
            },
        ])

        //restore a dangling curved segment
        expect(reducer([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                ],
                deletedAt: null
            },
        ], {
            type: RESTORE_SEGMENT,
            payload: {
                id: 2,
                trackID: 0,
                segmentToRestore: { id: 2, isCurved: true, endNodes: [2, 4], controlPoint: 5 },
                nodesToRestore: [
                    { id: 5, stationID: null, latitude: 43.73, longitude: -79.48 },
                    { id: 4, stationID: null, latitude: 43.72, longitude: -79.485 },
                ]
            }
        })).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                    { id: 4, stationID: null, latitude: 43.72, longitude: -79.485 },
                    { id: 5, stationID: null, latitude: 43.73, longitude: -79.48 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: true, endNodes: [2, 4], controlPoint: 5 }
                ],
                deletedAt: null
            },
        ])
    })

    it('should move stations correctly', () => {
        expect(reducer([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                    { id: 4, stationID: null, latitude: 43.72, longitude: -79.485 },
                    { id: 5, stationID: null, latitude: 43.73, longitude: -79.48 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: true, endNodes: [2, 4], controlPoint: 5 }
                ],
                deletedAt: null
            },
        ], {
            type: MOVE_STATION,
            payload: {
                id: 0,
                latitude: 43.65,
                longitude: -79.43
            }
        })).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.65, longitude: -79.43 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                    { id: 4, stationID: null, latitude: 43.72, longitude: -79.485 },
                    { id: 5, stationID: null, latitude: 43.73, longitude: -79.48 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: true, endNodes: [2, 4], controlPoint: 5 }
                ],
                deletedAt: null
            },
        ])
    })

    it('should move an individual node', () => {
        expect(reducer([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                    { id: 4, stationID: null, latitude: 43.72, longitude: -79.485 },
                    { id: 5, stationID: null, latitude: 43.73, longitude: -79.48 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: true, endNodes: [2, 4], controlPoint: 5 }
                ],
                deletedAt: null
            },
        ], {
            type: MOVE_NODE,
            payload: {
                id: 5,
                trackID: 0,
                latitude: 43.74,
                longitude: -79.49
            }
        })).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                    { id: 1, stationID: 1, latitude: 43.7, longitude: -79.48 },
                    { id: 2, stationID: null, latitude: 43.72, longitude: -79.46 },
                    { id: 3, stationID: null, latitude: 43.72, longitude: -79.47 },
                    { id: 4, stationID: null, latitude: 43.72, longitude: -79.485 },
                    { id: 5, stationID: null, latitude: 43.74, longitude: -79.49 },
                ],
                segments: [
                    { id: 0, isCurved: false, endNodes: [0, 2], controlPoint: null },
                    { id: 1, isCurved: false, endNodes: [1, 3], controlPoint: null },
                    { id: 2, isCurved: true, endNodes: [2, 4], controlPoint: 5 }
                ],
                deletedAt: null
            },
        ])
    })

    it('should return the midpoint of two nodes', () => {
        expect(haversineMidpoint(
            { latitude: 45, longitude: 45 },
            { latitude: 45, longitude: 45 },
        )).toEqual({ latitude: 45.000000, longitude: 45.000000 })

        expect(haversineMidpoint(
            { latitude: 0, longitude: 45 },
            { latitude: 0, longitude: 46 },
        )).toEqual({ latitude: 0.000000, longitude: 45.500000 })

        expect(haversineMidpoint(
            { latitude: 0, longitude: -179 },
            { latitude: 0, longitude: 177 },
        )).toEqual({ latitude: 0.000000, longitude: 179.000000 })

        expect(haversineMidpoint(
            { latitude: 0, longitude: -177 },
            { latitude: 0, longitude: 179 },
        )).toEqual({ latitude: 0.000000, longitude: -179.000000 })

    })

    it('should return nodes that only given segments connect to', () => {
        let fullset1 = [
            { id: 0, endNodes: [0, 2], controlPoint: null },
            { id: 1, endNodes: [1, 4], controlPoint: null },
            { id: 2, endNodes: [2, 3], controlPoint: null },
            { id: 3, endNodes: [3, 5], controlPoint: null },
        ]

        expect(getNodesThatOnlyGivenSegmentsConnectTo(3, fullset1, false
        )).toEqual([5])

        let fullset2 = [
            { id: 0, endNodes: [0, 2], controlPoint: null },
            { id: 1, endNodes: [1, 4], controlPoint: null },
            { id: 2, endNodes: [2, 3], controlPoint: null },
            { id: 3, endNodes: [3, 4], controlPoint: null },
        ]

        expect(getNodesThatOnlyGivenSegmentsConnectTo(3, fullset2, false
        )).toEqual([])

    })
})
