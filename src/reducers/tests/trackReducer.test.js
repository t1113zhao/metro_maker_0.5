import {
    REMOVE_TRACK,
    RESTORE_TRACK,
    REMOVE_STATION,
    RESTORE_STATION
} from '../../actions/actionTypes'

import reducer from '../trackReducer'

describe('Track Reducer', () => {
    it('should create initial state correctly', () => {
        expect(reducer(undefined, {})).toEqual([])
    })

    // it('should add track to empty state correctly', () => {
    //     expect(reducer([], {
    //         type: ADD_TRACK,
    //         payload: {
    //             stationIDs: [0, 1]
    //         }
    //     })).toEqual([
    //         { id: 0, stationIDs: [0, 1], deletedAt: null }
    //     ])
    // })

    // it('should add track to non-empty state correctly', () => {
    //     expect(reducer([
    //         { id: 0, stationIDs: [0, 1], deletedAt: null }
    //     ], {
    //         type: ADD_TRACK,
    //         payload: {
    //             stationIDs: [1, 2]
    //         }
    //     })).toEqual([
    //         { id: 0, stationIDs: [0, 1], deletedAt: null },
    //         { id: 1, stationIDs: [1, 2], deletedAt: null }
    //     ])
    // })

    it('should remove track correctly', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275);
        let date = new Date().toISOString()

        expect(reducer([
            { id: 0, stationIDs: [0, 1], deletedAt: null },
        ], {
            type: REMOVE_TRACK,
            payload: {
                id: 0,
                deletedAt: date
            }
        })).toEqual([
            { id: 0, stationIDs: [0, 1], deletedAt: date },
        ])

        expect(reducer([
            { id: 1, stationIDs: [0, 1], deletedAt: null },
        ], {
            type: REMOVE_TRACK,
            payload: {
                id: 0,
                deletedAt: date
            }
        })).toEqual([
            { id: 1, stationIDs: [0, 1], deletedAt: null },
        ])
    })

    it('should remove tracks correctly when station deleted', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275);
        let date = new Date().toISOString()

        expect(reducer([
            { id: 0, stationIDs: [0, 1], deletedAt: null },
            { id: 1, stationIDs: [1, 2], deletedAt: null },
            { id: 2, stationIDs: [2, 3], deletedAt: null },
            { id: 3, stationIDs: [4, 3], deletedAt: null },
        ], {
            type: REMOVE_STATION,
            payload: {
                id: 0,
                deletedAt: date,
                trackIDs: [0],
                transferIDs: []
            }
        })).toEqual([
            { id: 0, stationIDs: [0, 1], deletedAt: date },
            { id: 1, stationIDs: [1, 2], deletedAt: null },
            { id: 2, stationIDs: [2, 3], deletedAt: null },
            { id: 3, stationIDs: [4, 3], deletedAt: null },
        ])

        expect(reducer([
            { id: 0, stationIDs: [0, 1], deletedAt: null },
            { id: 1, stationIDs: [0, 2], deletedAt: null },
            { id: 2, stationIDs: [0, 3], deletedAt: null },
            { id: 3, stationIDs: [1, 3], deletedAt: null },
        ], {
            type: REMOVE_STATION,
            payload: {
                id: 0,
                deletedAt: date,
                trackIDs: [0, 1, 2],
                transferIDs: []
            }
        })).toEqual([
            { id: 0, stationIDs: [0, 1], deletedAt: date },
            { id: 1, stationIDs: [0, 2], deletedAt: date },
            { id: 2, stationIDs: [0, 3], deletedAt: date },
            { id: 3, stationIDs: [1, 3], deletedAt: null },
        ])

    })

    it('should restore track correctly', () => {
        expect(reducer([
            { id: 0, stationIDs: [0, 1], deletedAt: 'yesterday' },
        ], {
            type: RESTORE_TRACK,
            payload: {
                id: 0
            }
        })).toEqual([
            { id: 0, stationIDs: [0, 1], deletedAt: null },
        ])

        expect(reducer([
            { id: 0, stationIDs: [0, 1], deletedAt: 'yesterday' },
        ], {
            type: RESTORE_TRACK,
            payload: {
                id: 1
            }
        })).toEqual([
            { id: 0, stationIDs: [0, 1], deletedAt: 'yesterday' },
        ])
    })

    it('should restore track correctly when station restore', () => {
        expect(reducer([
            { id: 0, stationIDs: [0, 1], deletedAt: 'yesterday' },
            { id: 1, stationIDs: [0, 2], deletedAt: 'yesterday' },
            { id: 2, stationIDs: [0, 3], deletedAt: 'yesterday' },
            { id: 3, stationIDs: [1, 3], deletedAt: null },
        ], {
            type: RESTORE_STATION,
            payload: {
                id: 0,
                trackIDs: [0, 1, 2],
                transferIDs: []
            }
        })).toEqual([
            { id: 0, stationIDs: [0, 1], deletedAt: null },
            { id: 1, stationIDs: [0, 2], deletedAt: null },
            { id: 2, stationIDs: [0, 3], deletedAt: null },
            { id: 3, stationIDs: [1, 3], deletedAt: null },
        ])
    })
})