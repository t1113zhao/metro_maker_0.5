import {
    ADD_LINE,
    UNDO_ADD_LINE,
    EDIT_LINE,
    REMOVE_LINE,
    RESTORE_LINE,
    REMOVE_AGENCY,
    RESTORE_AGENCY
} from '../../actions/actionTypes'

import reducer, { lineIDsGivenAgencyId, selectLinesGivenAgencyId, selectLineGivenID, selectAllLines } from '../linesReducer'
import * as linetypes from '../../object_types/linetypes'

describe('Lines Reducer', () => {
    it('should create initial state correctly', () => {
        expect(reducer(undefined, {})).toEqual([])
    })

    it('should add single line to initial state correctly', () => {
        let name = 'Yonge University'
        let agencyID = 0
        let color = 'Yellow'
        let linetype = linetypes.HEAVY_METRO

        expect(reducer([], {
            type: ADD_LINE,
            payload: { agencyID: agencyID, name: name, color: color, linetype: linetype }
        })).toEqual([
            { id: 0, agencyID: 0, name: name, color: color, linetype: linetype, deletedAt: null }
        ])
    })

    it('should add single line to non empty initial state correctly', () => {
        let name = 'Bloor Danforth'
        let agencyID = 0
        let color = 'Green'
        let linetype = linetypes.HEAVY_METRO
        expect(reducer([
            { id: 1, agencyID: 0, name: 'Yonge University', color: 'Yellow', linetype: linetypes.HEAVY_METRO, deletedAt: null }
        ], {
            type: ADD_LINE,
            payload: { agencyID: agencyID, name: name, color: color, linetype: linetype }
        })).toEqual([
            { id: 1, agencyID: 0, name: 'Yonge University', color: 'Yellow', linetype: linetypes.HEAVY_METRO, deletedAt: null },
            { id: 2, agencyID: 0, name: 'Bloor Danforth', color: 'Green', linetype: linetypes.HEAVY_METRO, deletedAt: null }
        ])
    })

    it('should undo add single line to empty state', () => {
        expect(reducer([
            { id: 0, agencyID: 0, name: 'Yonge University', color: 'Yellow', linetype: linetypes.HEAVY_METRO, deletedAt: null },
        ], {
            type: UNDO_ADD_LINE,
            payload: {
                id: 0
            }
        })).toEqual([])
    })

    it('should undo add single line to non empty state', () => {
        expect(reducer([
            { id: 0, agencyID: 0, name: 'Yonge University', color: 'Yellow', linetype: linetypes.HEAVY_METRO, deletedAt: null },
            { id: 1, agencyID: 0, name: 'Yonge University', color: 'Yellow', linetype: linetypes.HEAVY_METRO, deletedAt: null },
        ], {
            type: UNDO_ADD_LINE,
            payload: {
                id: 1
            }
        })).toEqual([
            { id: 0, agencyID: 0, name: 'Yonge University', color: 'Yellow', linetype: linetypes.HEAVY_METRO, deletedAt: null },
        ])
    })

    it('should edit line correctly', () => {
        let name = 'Blonge University'
        let id = 1
        let color = 'Blue'
        let linetype = linetypes.MAGLEV

        expect(reducer([
            { id: 1, agencyID: 0, name: 'Yonge University', color: 'Yellow', linetype: linetypes.HEAVY_METRO, deletedAt: null }
        ], {
            type: EDIT_LINE,
            payload: { id: id, name: name, color: color, linetype: linetype }
        })).toEqual([
            { id: 1, agencyID: 0, name: 'Blonge University', color: 'Blue', linetype: linetypes.MAGLEV, deletedAt: null }
        ])
    })

    it('should remove line correctly', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275);

        let id = 2
        let date = new Date().toISOString()

        expect(reducer([
            { id: 1, agencyID: 0, name: 'Yonge University', color: 'Yellow', linetype: linetypes.HEAVY_METRO, deletedAt: null }
        ], {
            type: REMOVE_LINE,
            payload: { id: id, deletedAt: date, serviceIDs: [] }
        })).toEqual([
            { id: 1, agencyID: 0, name: 'Yonge University', color: 'Yellow', linetype: linetypes.HEAVY_METRO, deletedAt: null }
        ])

        expect(reducer([
            { id: 2, agencyID: 0, name: 'Yonge University', color: 'Yellow', linetype: linetypes.HEAVY_METRO, deletedAt: null }
        ], {
            type: REMOVE_LINE,
            payload: { id: id, deletedAt: date, serviceIDs: [] }
        })).toEqual([
            { id: 2, agencyID: 0, name: 'Yonge University', color: 'Yellow', linetype: linetypes.HEAVY_METRO, deletedAt: date }
        ])
    })

    it('should restore line correctly', () => {
        let id = 2
        expect(reducer([
            { id: 1, agencyID: 0, name: 'Yonge University', color: 'Yellow', linetype: linetypes.HEAVY_METRO, deletedAt: null }
        ], {
            type: RESTORE_LINE,
            payload: { id: id, serviceIDs: [] }
        })).toEqual([
            { id: 1, agencyID: 0, name: 'Yonge University', color: 'Yellow', linetype: linetypes.HEAVY_METRO, deletedAt: null }
        ])

        expect(reducer([
            { id: 1, agencyID: 0, name: 'Yonge University', color: 'Yellow', linetype: linetypes.HEAVY_METRO, deletedAt: 'yesterday' }
        ], {
            type: RESTORE_LINE,
            payload: { id: id, serviceIDs: [] }
        })).toEqual([
            { id: 1, agencyID: 0, name: 'Yonge University', color: 'Yellow', linetype: linetypes.HEAVY_METRO, deletedAt: 'yesterday' }
        ])

        expect(reducer([
            { id: 2, agencyID: 0, name: 'Yonge University', color: 'Yellow', linetype: linetypes.HEAVY_METRO, deletedAt: 'yesterday' }
        ], {
            type: RESTORE_LINE,
            payload: { id: id, serviceIDs: [] }
        })).toEqual([
            { id: 2, agencyID: 0, name: 'Yonge University', color: 'Yellow', linetype: linetypes.HEAVY_METRO, deletedAt: null }
        ])
    })

    it('should remove line when agency deleted correctly', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275);
        let date = new Date().toISOString()

        let state = [
            {
                id: 0, agencyID: 0, name: 'stouffville', color: 'brown', linetype: 'commuter/regional', deletedAt: null
            },
            {
                id: 1, agencyID: 0, name: 'barrie', color: 'navy blue', linetype: 'commuter/regional', deletedAt: null
            },
            {
                id: 2, agencyID: 0, name: 'lakeshore west', color: 'maroon', linetype: 'commuter/regional', deletedAt: null
            },
            {
                id: 3, agencyID: 0, name: 'lakeshore east', color: 'orange-red', linetype: 'commuter/regional', deletedAt: null
            },
            {
                id: 4, agencyID: 0, name: 'milton', color: 'orange yellow', linetype: 'commuter/regional', deletedAt: null
            },
            {
                id: 5, agencyID: 1, name: 'yonge university', color: 'yellow', linetype: 'heavy metro', deletedAt: null
            },
            {
                id: 6, agencyID: 1, name: 'sheppard', color: 'purple', linetype: 'heavy metro', deletedAt: null
            },
            {
                id: 7, agencyID: 1, name: 'bloor danforth', color: 'green', linetype: 'heavy metro', deletedAt: null
            },
        ]

        let deletedState = reducer(state, {
            type: REMOVE_AGENCY,
            payload: {
                id: 0, deletedAt: date, lineIDs: [0, 1, 2, 3, 4], serviceIDs: []
            }
        })
        expect(deletedState).toEqual(
            [
                {
                    id: 0, agencyID: 0, name: 'stouffville', color: 'brown', linetype: 'commuter/regional', deletedAt: date
                },
                {
                    id: 1, agencyID: 0, name: 'barrie', color: 'navy blue', linetype: 'commuter/regional', deletedAt: date
                },
                {
                    id: 2, agencyID: 0, name: 'lakeshore west', color: 'maroon', linetype: 'commuter/regional', deletedAt: date
                },
                {
                    id: 3, agencyID: 0, name: 'lakeshore east', color: 'orange-red', linetype: 'commuter/regional', deletedAt: date
                },
                {
                    id: 4, agencyID: 0, name: 'milton', color: 'orange yellow', linetype: 'commuter/regional', deletedAt: date
                },
                {
                    id: 5, agencyID: 1, name: 'yonge university', color: 'yellow', linetype: 'heavy metro', deletedAt: null
                },
                {
                    id: 6, agencyID: 1, name: 'sheppard', color: 'purple', linetype: 'heavy metro', deletedAt: null
                },
                {
                    id: 7, agencyID: 1, name: 'bloor danforth', color: 'green', linetype: 'heavy metro', deletedAt: null
                },
            ]
        )

        expect(reducer(state, {
            type: REMOVE_AGENCY,
            payload: {
                id: 2, deletedAt: date, lineIDs: [], serviceIDs: []
            }
        })).toEqual(state)
    })

    it('should restore line when agency restored correctly', () => {
        let state = [
            {
                id: 0, agencyID: 0, name: 'stouffville', color: 'brown', linetype: 'commuter/regional', deletedAt: 'yesterday'
            },
            {
                id: 1, agencyID: 0, name: 'barrie', color: 'navy blue', linetype: 'commuter/regional', deletedAt: 'yesterday'
            },
            {
                id: 2, agencyID: 0, name: 'lakeshore west', color: 'maroon', linetype: 'commuter/regional', deletedAt: 'yesterday'
            },
            {
                id: 3, agencyID: 0, name: 'lakeshore east', color: 'orange-red', linetype: 'commuter/regional', deletedAt: 'yesterday'
            },
            {
                id: 4, agencyID: 0, name: 'milton', color: 'orange yellow', linetype: 'commuter/regional', deletedAt: 'yesterday'
            },
            {
                id: 5, agencyID: 1, name: 'yonge university', color: 'yellow', linetype: 'heavy metro', deletedAt: null
            },
            {
                id: 6, agencyID: 1, name: 'sheppard', color: 'purple', linetype: 'heavy metro', deletedAt: null
            },
            {
                id: 7, agencyID: 1, name: 'bloor danforth', color: 'green', linetype: 'heavy metro', deletedAt: null
            },
        ]

        expect(
            reducer(state, {
                type: RESTORE_AGENCY,
                payload: {
                    id: 0, lineIDs: [0, 1, 2, 3, 4], serviceIDs: []
                }
            })).toEqual([
                {
                    id: 0, agencyID: 0, name: 'stouffville', color: 'brown', linetype: 'commuter/regional', deletedAt: null
                },
                {
                    id: 1, agencyID: 0, name: 'barrie', color: 'navy blue', linetype: 'commuter/regional', deletedAt: null
                },
                {
                    id: 2, agencyID: 0, name: 'lakeshore west', color: 'maroon', linetype: 'commuter/regional', deletedAt: null
                },
                {
                    id: 3, agencyID: 0, name: 'lakeshore east', color: 'orange-red', linetype: 'commuter/regional', deletedAt: null
                },
                {
                    id: 4, agencyID: 0, name: 'milton', color: 'orange yellow', linetype: 'commuter/regional', deletedAt: null
                },
                {
                    id: 5, agencyID: 1, name: 'yonge university', color: 'yellow', linetype: 'heavy metro', deletedAt: null
                },
                {
                    id: 6, agencyID: 1, name: 'sheppard', color: 'purple', linetype: 'heavy metro', deletedAt: null
                },
                {
                    id: 7, agencyID: 1, name: 'bloor danforth', color: 'green', linetype: 'heavy metro', deletedAt: null
                },
            ])

        expect(
            reducer(state, {
                type: RESTORE_AGENCY,
                payload: {
                    id: 2, lineIDs: [], serviceIDs: []
                }
            })
        ).toEqual(state)
    })

    let selectorstate = {
        lines: [
            { id: 0, agencyID: 0, deletedAt: null }, { id: 1, agencyID: 0, deletedAt: null }, { id: 2, agencyID: 0, deletedAt: 'yesterday' }, { id: 3, agencyID: 1, deletedAt: null }
        ]
    }

    it('should select all lines', () => {

        expect(selectAllLines(selectorstate.lines, true)).toEqual([
            { id: 0, agencyID: 0, deletedAt: null }, { id: 1, agencyID: 0, deletedAt: null }, { id: 2, agencyID: 0, deletedAt: 'yesterday' }, { id: 3, agencyID: 1, deletedAt: null }
        ])

        expect(selectAllLines(selectorstate.lines, false)).toEqual([
            { id: 0, agencyID: 0, deletedAt: null }, { id: 1, agencyID: 0, deletedAt: null }, { id: 3, agencyID: 1, deletedAt: null }
        ])
    })

    it('should select lines given id', () => {
        expect(selectLineGivenID(selectorstate, 0, true)).toEqual([
            { id: 0, agencyID: 0, deletedAt: null }
        ])
        expect(selectLineGivenID(selectorstate, 0, false)).toEqual([
            { id: 0, agencyID: 0, deletedAt: null }
        ])
        expect(selectLineGivenID(selectorstate, 2, true)).toEqual([
            { id: 2, agencyID: 0, deletedAt: 'yesterday' }
        ])
        expect(selectLineGivenID(selectorstate, 2, false)).toEqual([])
    })


    it('should select lines given agency id', () => {
        expect(selectLinesGivenAgencyId(selectorstate, 0, true)).toEqual([
            { id: 0, agencyID: 0, deletedAt: null }, { id: 1, agencyID: 0, deletedAt: null }, { id: 2, agencyID: 0, deletedAt: 'yesterday' }
        ])

        expect(selectLinesGivenAgencyId(selectorstate, 0, false)).toEqual([
            { id: 0, agencyID: 0, deletedAt: null }, { id: 1, agencyID: 0, deletedAt: null },
        ])
    })

    it('should return line ids given agency id', () => {
        expect(lineIDsGivenAgencyId(selectorstate, 0, true)).toEqual([0, 1, 2])

        expect(lineIDsGivenAgencyId(selectorstate, 0, false)).toEqual([0, 1])
    })
})
