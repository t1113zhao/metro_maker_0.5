import {
    ADD_TRANSFER,
    UNDO_ADD_TRANSFER,
    EDIT_TRANSFER,
    REMOVE_TRANSFER,
    RESTORE_TRANSFER,
    REMOVE_STATION,
    RESTORE_STATION,
} from '../../actions/actionTypes'
// expect(reducer([],{})).toEqual([])

import reducer from '../transferReducer'
import * as transferTypes from '../../object_types/transfertypes'

describe('Transfer Reducer', () => {
    it('should create initial state correctly', () => {
        expect(reducer(undefined, {})).toEqual([])
    })

    it('should add transfer correctly on empty state', () => {
        let stationA_ID = 0
        let stationB_ID = 1
        let type = transferTypes.FREE_OUT_STATION
        expect(reducer([], {
            type: ADD_TRANSFER,
            payload: {
                stationIDs: [stationA_ID, stationB_ID],
                type: type
            }
        })).toEqual([
            { id: 0, stationIDs: [stationA_ID, stationB_ID], type: type, deletedAt: null }
        ])
    })

    it('should add transfer correctly on non empty state', () => {
        let stationA_ID = 0
        let stationB_ID = 2
        let type = transferTypes.IN_STATION
        expect(reducer([
            { id: 0, stationIDs: [0, 1], type: transferTypes.FREE_OUT_STATION, deletedAt: null }
        ], {
            type: ADD_TRANSFER,
            payload: {
                stationIDs: [stationA_ID, stationB_ID],
                type: type
            }
        })).toEqual([
            { id: 0, stationIDs: [0, 1], type: transferTypes.FREE_OUT_STATION, deletedAt: null },
            { id: 1, stationIDs: [0, 2], type: transferTypes.IN_STATION, deletedAt: null },
        ])
    })

    it('should undo add transfer to empty state', () => {
        expect(reducer([
            { id: 0, stationIDs: [0, 1], type: transferTypes.FREE_OUT_STATION, deletedAt: null }
        ], {
            type: UNDO_ADD_TRANSFER,
            payload: {
                id: 0
            }
        })).toEqual([])
    })

    it('should undo add transfer to non-empty state', () => {
        expect(reducer([
            { id: 0, stationIDs: [0, 1], type: transferTypes.FREE_OUT_STATION, deletedAt: null },
            { id: 1, stationIDs: [0, 2], type: transferTypes.IN_STATION, deletedAt: null },
        ], {
            type: UNDO_ADD_TRANSFER,
            payload: {
                id: 1
            }
        })).toEqual([
            { id: 0, stationIDs: [0, 1], type: transferTypes.FREE_OUT_STATION, deletedAt: null }
        ])
    })

    it('should edit transfer correctly', () => {
        let id = 0
        let newtype = transferTypes.PAID_OUT_STATION

        expect(reducer([
            { id: 0, stationIDs: [0, 1], type: transferTypes.FREE_OUT_STATION, deletedAt: null },
        ], {
            type: EDIT_TRANSFER,
            payload: {
                id: id,
                type: newtype
            }
        })).toEqual([
            { id: 0, stationIDs: [0, 1], type: newtype, deletedAt: null },
        ])
    })

    it('should remove transfer correctly', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275);
        let date = new Date().toISOString()

        expect(reducer([
            { id: 0, stationIDs: [0, 1], type: transferTypes.FREE_OUT_STATION, deletedAt: null },
            { id: 1, stationIDs: [0, 2], type: transferTypes.IN_STATION, deletedAt: null },
        ], {
            type: REMOVE_TRANSFER,
            payload: {
                id: 0,
                deletedAt: date
            }
        })).toEqual([
            { id: 0, stationIDs: [0, 1], type: transferTypes.FREE_OUT_STATION, deletedAt: date },
            { id: 1, stationIDs: [0, 2], type: transferTypes.IN_STATION, deletedAt: null },
        ])

        expect(reducer([
            { id: 0, stationIDs: [0, 1], type: transferTypes.FREE_OUT_STATION, deletedAt: null },
            { id: 1, stationIDs: [0, 2], type: transferTypes.IN_STATION, deletedAt: null },
        ], {
            type: REMOVE_TRANSFER,
            payload: {
                id: 2,
                deletedAt: date
            }
        })).toEqual([
            { id: 0, stationIDs: [0, 1], type: transferTypes.FREE_OUT_STATION, deletedAt: null },
            { id: 1, stationIDs: [0, 2], type: transferTypes.IN_STATION, deletedAt: null },
        ])
    })

    it('should restore transfer correctly', () => {
        expect(reducer([
            { id: 0, stationIDs: [0, 1], type: transferTypes.FREE_OUT_STATION, deletedAt: 'last week' },
            { id: 1, stationIDs: [0, 2], type: transferTypes.IN_STATION, deletedAt: null },
        ], {
            type: RESTORE_TRANSFER,
            payload: {
                id: 0
            }
        })).toEqual([
            { id: 0, stationIDs: [0, 1], type: transferTypes.FREE_OUT_STATION, deletedAt: null },
            { id: 1, stationIDs: [0, 2], type: transferTypes.IN_STATION, deletedAt: null },
        ])

        expect(reducer([
            { id: 0, stationIDs: [0, 1], type: transferTypes.FREE_OUT_STATION, deletedAt: 'last week' },
            { id: 1, stationIDs: [0, 2], type: transferTypes.IN_STATION, deletedAt: null },
        ], {
            type: RESTORE_TRANSFER,
            payload: {
                id: 2
            }
        })).toEqual([
            { id: 0, stationIDs: [0, 1], type: transferTypes.FREE_OUT_STATION, deletedAt: 'last week' },
            { id: 1, stationIDs: [0, 2], type: transferTypes.IN_STATION, deletedAt: null },
        ])
    })

    it('should remove transfer when station deleted', () => {
        expect(reducer([
            { id: 0, stationIDs: [0, 1], type: transferTypes.FREE_OUT_STATION, deletedAt: null },
            { id: 1, stationIDs: [0, 2], type: transferTypes.IN_STATION, deletedAt: null },
            { id: 2, stationIDs: [1, 2], type: transferTypes.FREE_OUT_STATION, deletedAt: null },
        ], {
            type: REMOVE_STATION,
            payload: {
                id: 0,
                deletedAt: 'yesterday',
                trackIDs: [],
                transferIDs: [0, 1]
            }
        })).toEqual([
            { id: 0, stationIDs: [0, 1], type: transferTypes.FREE_OUT_STATION, deletedAt: 'yesterday' },
            { id: 1, stationIDs: [0, 2], type: transferTypes.IN_STATION, deletedAt: 'yesterday' },
            { id: 2, stationIDs: [1, 2], type: transferTypes.FREE_OUT_STATION, deletedAt: null },
        ])
    })

    it('should restore transfer when station restored', () => {
        expect(reducer([
            { id: 0, stationIDs: [0, 1], type: transferTypes.FREE_OUT_STATION, deletedAt: 'yesterday' },
            { id: 1, stationIDs: [0, 2], type: transferTypes.IN_STATION, deletedAt: 'yesterday' },
            { id: 2, stationIDs: [1, 2], type: transferTypes.FREE_OUT_STATION, deletedAt: null },
        ], {
            type: RESTORE_STATION,
            payload: {
                id: 0,
                trackIDs: [],
                transferIDs: [0, 1]
            }
        })).toEqual([
            { id: 0, stationIDs: [0, 1], type: transferTypes.FREE_OUT_STATION, deletedAt: null },
            { id: 1, stationIDs: [0, 2], type: transferTypes.IN_STATION, deletedAt: null },
            { id: 2, stationIDs: [1, 2], type: transferTypes.FREE_OUT_STATION, deletedAt: null },
        ])
    })
})
