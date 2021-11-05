import {
    REMOVE_STATION,
    RESTORE_STATION,
    ADD_TRACK,
    UNDO_ADD_TRACK,
    REMOVE_TRACK,
    RESTORE_TRACK,
    MOVE_NODE,
    MOVE_STATION,
    ADD_NEW_TRACKROUTE_NODES,
    EDIT_TRACKROUTE_NODES,
    CLEAR_TRACKROUTE_NODES
} from '../../actions/actionTypes'
import { haversineMidpoint } from '../../utils/utils'

import reducer from '../trackRouteReducer'
import { getNodesThatOnlyGivenSegmentsConnectTo } from '../trackRouteReducer'

describe('remove and restore trackRoute reducer correctly', () => {
    it('should remove track correctly when track removed', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275)
        let date = new Date().toISOString()

        expect(
            reducer(
                [
                    { id: 0, deletedAt: null },
                    { id: 1, deletedAt: null },
                    { id: 2, deletedAt: null },
                    { id: 3, deletedAt: null }
                ],
                {
                    type: REMOVE_TRACK,
                    payload: {
                        id: 0,
                        deletedAt: date
                    }
                }
            )
        ).toEqual([
            { id: 0, deletedAt: date },
            { id: 1, deletedAt: null },
            { id: 2, deletedAt: null },
            { id: 3, deletedAt: null }
        ])
    })

    it('should remove track correctly when station removed', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275)
        let date = new Date().toISOString()

        expect(
            reducer(
                [
                    { id: 0, deletedAt: null },
                    { id: 1, deletedAt: null },
                    { id: 2, deletedAt: null },
                    { id: 3, deletedAt: null }
                ],
                {
                    type: REMOVE_STATION,
                    payload: {
                        id: 0,
                        deletedAt: date,
                        trackIDs: [0, 2, 3],
                        transferIDs: [1, 2]
                    }
                }
            )
        ).toEqual([
            { id: 0, deletedAt: date },
            { id: 1, deletedAt: null },
            { id: 2, deletedAt: date },
            { id: 3, deletedAt: date }
        ])
    })

    it('should restore track route correctly when track restore', () => {
        expect(
            reducer(
                [
                    { id: 0, deletedAt: 'last tuesday' },
                    { id: 1, deletedAt: null },
                    { id: 2, deletedAt: null },
                    { id: 3, deletedAt: null }
                ],
                {
                    type: RESTORE_TRACK,
                    payload: {
                        id: 0
                    }
                }
            )
        ).toEqual([
            { id: 0, deletedAt: null },
            { id: 1, deletedAt: null },
            { id: 2, deletedAt: null },
            { id: 3, deletedAt: null }
        ])
    })

    it('should restore track correctly when station restored', () => {
        expect(
            reducer(
                [
                    { id: 0, deletedAt: 'last tuesday' },
                    { id: 1, deletedAt: 'last tuesday' },
                    { id: 2, deletedAt: 'last tuesday' },
                    { id: 3, deletedAt: 'last tuesday' }
                ],
                {
                    type: RESTORE_STATION,
                    payload: {
                        id: 0,
                        trackIDs: [0, 2, 3],
                        transferIDs: [1, 2]
                    }
                }
            )
        ).toEqual([
            { id: 0, deletedAt: null },
            { id: 1, deletedAt: 'last tuesday' },
            { id: 2, deletedAt: null },
            { id: 3, deletedAt: null }
        ])
    })
})

describe('Track route reducer operates correctly', () => {
    it('should create initial state correctly', () => {
        expect(reducer(undefined, {})).toEqual([])
    })

    it('should add new trackroute', () => {
        expect(
            reducer([], {
                type: ADD_TRACK,
                payload: {
                    stations: [
                        { id: 0, latitude: 46, longitude: 71 },
                        { id: 1, latitude: 46.5, longitude: 71.2 }
                    ]
                }
            })
        ).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [],
                stationNodes: [
                    [46, 71],
                    [46.5, 71.2]
                ],
                deletedAt: null
            }
        ])
    })

    it('should add new trackroute nodes', () => {
        expect(
            reducer(
                [
                    {
                        id: 0,
                        stationIDs: [0, 1],
                        nodes: [],
                        stationNodes: [
                            [46, 71],
                            [46.5, 71.2]
                        ],
                        deletedAt: null
                    }
                ],
                {
                    type: ADD_NEW_TRACKROUTE_NODES,
                    payload: {
                        nodes: [
                            [46.1, 71.1],
                            [46.3, 71.1]
                        ],
                        trackID: 0
                    }
                }
            )
        ).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    [46.1, 71.1],
                    [46.3, 71.1]
                ],
                stationNodes: [
                    [46, 71],
                    [46.5, 71.2]
                ],
                deletedAt: null
            }
        ])
    })

    it('should edit trackroute', () => {
        expect(
            reducer(
                [
                    {
                        id: 0,
                        stationIDs: [0, 1],
                        nodes: [
                            [45, 76],
                            [45.1, 75.9],
                            [45.2, 75.8],
                            [45.3, 75.7],
                            [45.3, 75.6]
                        ],
                        stationNodes: [
                            [44.9, 76.1],
                            [45.2, 75.5]
                        ],
                        deletedAt: null
                    }
                ],
                {
                    type: EDIT_TRACKROUTE_NODES,
                    payload: {
                        startIndex: 0,
                        endIndex: 4,
                        nodes: [
                            [46, 75],
                            [46.1, 75.2]
                        ],
                        trackID: 0
                    }
                }
            )
        ).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    [45, 76],
                    [46, 75],
                    [46.1, 75.2],
                    [45.3, 75.6]
                ],
                stationNodes: [
                    [44.9, 76.1],
                    [45.2, 75.5]
                ],
                deletedAt: null
            }
        ])

        expect(
            reducer(
                [
                    {
                        id: 0,
                        stationIDs: [0, 1],
                        nodes: [
                            [45, 76],
                            [45.1, 75.9],
                            [45.2, 75.8],
                            [45.3, 75.7],
                            [45.3, 75.6]
                        ],
                        stationNodes: [
                            [44.9, 76.1],
                            [45.2, 75.5]
                        ],
                        deletedAt: null
                    }
                ],
                {
                    type: EDIT_TRACKROUTE_NODES,
                    payload: {
                        startIndex: -1,
                        endIndex: 3,
                        nodes: [
                            [46, 75],
                            [46.1, 75.2]
                        ],
                        trackID: 0
                    }
                }
            )
        ).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    [46, 75],
                    [46.1, 75.2],
                    [45.3, 75.7],
                    [45.3, 75.6]
                ],
                stationNodes: [
                    [44.9, 76.1],
                    [45.2, 75.5]
                ],
                deletedAt: null
            }
        ])

        expect(
            reducer(
                [
                    {
                        id: 0,
                        stationIDs: [0, 1],
                        nodes: [
                            [45, 76],
                            [45.1, 75.9],
                            [45.2, 75.8],
                            [45.3, 75.7],
                            [45.3, 75.6]
                        ],
                        stationNodes: [
                            [44.9, 76.1],
                            [45.2, 75.5]
                        ],
                        deletedAt: null
                    }
                ],
                {
                    type: EDIT_TRACKROUTE_NODES,
                    payload: {
                        startIndex: 2,
                        endIndex: 5,
                        nodes: [
                            [46, 75],
                            [46.1, 75.2]
                        ],
                        trackID: 0
                    }
                }
            )
        ).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    [45, 76],
                    [45.1, 75.9],
                    [45.2, 75.8],
                    [46, 75],
                    [46.1, 75.2]
                ],
                stationNodes: [
                    [44.9, 76.1],
                    [45.2, 75.5]
                ],
                deletedAt: null
            }
        ])
    })

    it('should clear trackroute', () => {
        expect(
            reducer(
                [
                    {
                        id: 0,
                        stationIDs: [0, 1],
                        nodes: [
                            [45, 76],
                            [45.1, 75.9],
                            [45.2, 75.8],
                            [45.3, 75.7],
                            [45.3, 75.6]
                        ],
                        stationNodes: [
                            [46, 71],
                            [46.5, 71.2]
                        ],
                        deletedAt: null
                    }
                ],
                {
                    type: CLEAR_TRACKROUTE_NODES,
                    payload: {
                        trackID: 0
                    }
                }
            )
        ).toEqual([
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [],
                stationNodes: [
                    [46, 71],
                    [46.5, 71.2]
                ],
                deletedAt: null
            }
        ])
    })

    it('should move stations correctly', () => {})

    it('should move an individual node', () => {})

    it('should return the midpoint of two nodes', () => {
        expect(haversineMidpoint({ latitude: 45, longitude: 45 }, { latitude: 45, longitude: 45 })).toEqual({
            latitude: 45.0,
            longitude: 45.0
        })

        expect(haversineMidpoint({ latitude: 0, longitude: 45 }, { latitude: 0, longitude: 46 })).toEqual({
            latitude: 0.0,
            longitude: 45.5
        })

        expect(haversineMidpoint({ latitude: 0, longitude: -179 }, { latitude: 0, longitude: 177 })).toEqual({
            latitude: 0.0,
            longitude: 179.0
        })

        expect(haversineMidpoint({ latitude: 0, longitude: -177 }, { latitude: 0, longitude: 179 })).toEqual({
            latitude: 0.0,
            longitude: -179.0
        })
    })

    it('should return nodes that only given segments connect to', () => {
        let fullset1 = [
            { id: 0, endNodes: [0, 2], controlPoint: null },
            { id: 1, endNodes: [1, 4], controlPoint: null },
            { id: 2, endNodes: [2, 3], controlPoint: null },
            { id: 3, endNodes: [3, 5], controlPoint: null }
        ]

        expect(getNodesThatOnlyGivenSegmentsConnectTo([3], fullset1, false)).toEqual([5])

        let fullset2 = [
            { id: 0, endNodes: [0, 2], controlPoint: null },
            { id: 1, endNodes: [1, 4], controlPoint: null },
            { id: 2, endNodes: [2, 3], controlPoint: null },
            { id: 3, endNodes: [3, 4], controlPoint: null }
        ]

        expect(getNodesThatOnlyGivenSegmentsConnectTo([3], fullset2, false, false)).toEqual([])

        expect(getNodesThatOnlyGivenSegmentsConnectTo([2, 3], fullset2, false, false)).toEqual([3])

        expect(getNodesThatOnlyGivenSegmentsConnectTo([1, 2, 3], fullset2, false, false)).toEqual([4, 3])

        let fullset3 = [
            { id: 0, endNodes: [0, 2], controlPoint: 5 },
            { id: 1, endNodes: [1, 4], controlPoint: 6 },
            { id: 2, endNodes: [2, 3], controlPoint: null },
            { id: 3, endNodes: [3, 4], controlPoint: null }
        ]

        expect(getNodesThatOnlyGivenSegmentsConnectTo([1], fullset3, false, true)).toEqual([6])
    })
})
