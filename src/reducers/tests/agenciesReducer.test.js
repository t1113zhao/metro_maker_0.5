import { ADD_AGENCY, UNDO_ADD_AGENCY, EDIT_AGENCY, REMOVE_AGENCY, RESTORE_AGENCY } from '../../actions/actionTypes'

import reducer, { selectAgenciesGivenId, selectAllAgencies } from '../agenciesReducer'

describe('Agency Reducer', () => {
    it('should create initial state correctly', () => {
        expect(reducer(undefined, {})).toEqual([])
    })

    it('should add single Agency to initialstate correctly', () => {
        let name = 'MetroLinx'
        let color = 'Green'
        expect(
            reducer([], {
                type: ADD_AGENCY,
                payload: {
                    name: name,
                    color: color
                }
            })
        ).toEqual([
            {
                id: 0,
                name: name,
                color: color,
                deletedAt: null
            }
        ])
    })

    it('should add single Agency to non empty state correctly', () => {
        let name = 'TTC'
        let color = 'Red'

        expect(
            reducer([{ id: 0, name: 'MetroLinx', color: 'Green', deletedAt: null }], {
                type: ADD_AGENCY,
                payload: {
                    name: name,
                    color: color
                }
            })
        ).toEqual([
            { id: 0, name: 'MetroLinx', color: 'Green', deletedAt: null },
            { id: 1, name: 'TTC', color: 'Red', deletedAt: null }
        ])

        expect(
            reducer([{ id: 15, name: 'MetroLinx', color: 'Green', deletedAt: 'yesterday' }], {
                type: ADD_AGENCY,
                payload: {
                    name: name,
                    color: color
                }
            })
        ).toEqual([
            { id: 15, name: 'MetroLinx', color: 'Green', deletedAt: 'yesterday' },
            { id: 16, name: 'TTC', color: 'Red', deletedAt: null }
        ])
    })

    it('should undo add agency correctly to empty state', () => {
        expect(
            reducer([{ id: 0, name: 'MetroLinx', color: 'Green', deletedAt: null }], {
                type: UNDO_ADD_AGENCY,
                payload: {
                    id: 0
                }
            })
        ).toEqual([])
    })

    it('should undo add agency correctly to non empty state', () => {
        expect(
            reducer(
                [
                    { id: 0, name: 'MetroLinx', color: 'Green', deletedAt: null },
                    { id: 1, name: 'TTC', color: 'Red', deletedAt: null }
                ],
                {
                    type: UNDO_ADD_AGENCY,
                    payload: {
                        id: 1
                    }
                }
            )
        ).toEqual([{ id: 0, name: 'MetroLinx', color: 'Green', deletedAt: null }])
    })

    it('should edit agency correctly', () => {
        let id = 2
        let name = 'Betrolinx'
        let color = 'Blue'

        expect(
            reducer([{ id: 0, name: 'MetroLinx', color: 'Green', deletedAt: null }], {
                type: EDIT_AGENCY,
                payload: {
                    id: id,
                    name: name,
                    color: color
                }
            })
        ).toEqual([{ id: 0, name: 'MetroLinx', color: 'Green', deletedAt: null }])

        expect(
            reducer([{ id: 2, name: 'MetroLinx', color: 'Green', deletedAt: null }], {
                type: EDIT_AGENCY,
                payload: {
                    id: id,
                    name: name,
                    color: color
                }
            })
        ).toEqual([{ id: 2, name: name, color: color, deletedAt: null }])
    })

    it('should remove agency correctly', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275)

        let id = 2
        let date = new Date().toISOString()

        expect(
            reducer([{ id: 0, name: 'MetroLinx', color: 'Green', deletedAt: null }], {
                type: REMOVE_AGENCY,
                payload: {
                    id: id,
                    deletedAt: date
                }
            })
        ).toEqual([{ id: 0, name: 'MetroLinx', color: 'Green', deletedAt: null }])

        expect(
            reducer([{ id: 2, name: 'MetroLinx', color: 'Green', deletedAt: null }], {
                type: REMOVE_AGENCY,
                payload: {
                    id: id,
                    deletedAt: date
                }
            })
        ).toEqual([{ id: 2, name: 'MetroLinx', color: 'Green', deletedAt: date }])
    })

    it('should restore agency correctly', () => {
        let id = 2

        expect(
            reducer([{ id: 0, name: 'MetroLinx', color: 'Green', deletedAt: null }], {
                type: RESTORE_AGENCY,
                payload: {
                    id: id
                }
            })
        ).toEqual([{ id: 0, name: 'MetroLinx', color: 'Green', deletedAt: null }])

        expect(
            reducer([{ id: 2, name: 'MetroLinx', color: 'Green', deletedAt: null }], {
                type: RESTORE_AGENCY,
                payload: {
                    id: id
                }
            })
        ).toEqual([{ id: 2, name: 'MetroLinx', color: 'Green', deletedAt: null }])

        expect(
            reducer([{ id: 2, name: 'MetroLinx', color: 'Green', deletedAt: 'yesterday' }], {
                type: RESTORE_AGENCY,
                payload: {
                    id: id
                }
            })
        ).toEqual([{ id: 2, name: 'MetroLinx', color: 'Green', deletedAt: null }])
    })

    it('should return all agencies correctly', () => {
        let state = {
            agencies: [
                { id: 0, deletedAt: null },
                { id: 1, deletedAt: 'yesteryear' }
            ]
        }

        expect(selectAllAgencies(state.agencies, true)).toEqual([
            { id: 0, deletedAt: null },
            { id: 1, deletedAt: 'yesteryear' }
        ])
        expect(selectAllAgencies(state.agencies, false)).toEqual([{ id: 0, deletedAt: null }])
    })

    it('should return all agencies by ID', () => {
        let state = {
            agencies: [
                { id: 0, deletedAt: null },
                { id: 1, deletedAt: 'yesteryear' }
            ]
        }

        expect(selectAgenciesGivenId(state, 1, true)).toEqual([{ id: 1, deletedAt: 'yesteryear' }])

        expect(selectAgenciesGivenId(state, 1, false)).toEqual([])
    })
})
