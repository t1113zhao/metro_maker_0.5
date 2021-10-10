import * as actions from '../lineActions'
import { getInverseLineActions } from '../lineActions'
import * as type from '../actionTypes'

import configureMockStore from 'redux-mock-store'
import * as linetypes from '../../object_types/linetypes'
import { serviceIDsGivenLineID } from '../../reducers/servicesReducer'

const mockStore = configureMockStore()

describe('Line Action Creator', () => {
    it('Add Line Action Creator', () => {
        let name = 'Yonge-University'
        let agencyID = 0
        let color = '#ffcb0c'
        let linetype = linetypes.HEAVY_METRO

        expect(actions.addLine(agencyID, name, color, linetype)).toEqual({
            type: type.ADD_LINE,
            payload: {
                agencyID: agencyID,
                name: name,
                color: color,
                linetype: linetype
            }
        })
    })

    it('Undo Add Line Action Creator', () => {
        expect(actions.undoAddLine(1)).toEqual({
            type: type.UNDO_ADD_LINE,
            payload: {
                id: 1
            }
        })
    })

    it('Edit Line Action Creator', () => {
        let name = 'Yonge-University'
        let lineID = 0
        let color = '#ffcb0c'
        let linetype = linetypes.HEAVY_METRO

        expect(actions.editLine(lineID, name, color, linetype)).toEqual({
            type: type.EDIT_LINE,
            payload: {
                id: lineID,
                name: name,
                color: color,
                linetype: linetype
            }
        })
    })

    it('Remove Line Action Creator', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275)

        expect(actions.removeLine(0)).toEqual({
            type: type.REMOVE_LINE,
            payload: {
                id: 0,
                deletedAt: new Date().toISOString()
            }
        })
    })

    it('Get Correct Service IDs', () => {
        let store = mockStore({
            agencies: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }],
            lines: [
                { id: 0, agencyID: 0, deletedAt: null },
                { id: 1, agencyID: 0, deletedAt: null },
                { id: 2, agencyID: 0, deletedAt: null }
            ],
            services: [
                { id: 0, lineID: 0, deletedAt: null },
                { id: 1, lineID: 0, deletedAt: null },
                { id: 2, lineID: 1, deletedAt: null },
                { id: 3, lineID: 1, deletedAt: '2021-05-23T18:47:02.436Z' },
                { id: 4, lineID: 2, deletedAt: '2021-05-23T18:47:02.436Z' },
                { id: 5, lineID: 2, deletedAt: '2021-05-23T18:47:02.436Z' }
            ]
        })

        expect(serviceIDsGivenLineID(store.getState(), parseInt(0), false)).toEqual([0, 1])

        expect(serviceIDsGivenLineID(store.getState(), parseInt(0), true)).toEqual([0, 1])

        expect(serviceIDsGivenLineID(store.getState(), parseInt(1), false)).toEqual([2])

        expect(serviceIDsGivenLineID(store.getState(), parseInt(1), true)).toEqual([2, 3])

        expect(serviceIDsGivenLineID(store.getState(), parseInt(2), false)).toEqual([])

        expect(serviceIDsGivenLineID(store.getState(), parseInt(2), true)).toEqual([4, 5])

        expect(serviceIDsGivenLineID(store.getState(), parseInt(3), false)).toEqual([])
    })

    it('Restore Line Action Creator', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275)

        expect(actions.restoreLine(0)).toEqual({
            type: type.RESTORE_LINE,
            payload: {
                id: 0
            }
        })
    })

    it('should get right inverse actions', () => {
        let state = [
            {
                id: 0,
                agencyID: 0,
                name: 'Yonge University',
                color: 'Yellow',
                linetype: linetypes.HEAVY_METRO,
                deletedAt: null
            },
            {
                id: 1,
                agencyID: 0,
                name: 'Bloor Danforth',
                color: 'Green',
                linetype: linetypes.HEAVY_METRO,
                deletedAt: null
            },
            { id: 2, agencyID: 0, name: 'Ontario', color: 'Blue', linetype: linetypes.LIGHT_METRO, deletedAt: null }
        ]
        expect(
            actions.getInverseLineActions(state, {
                type: type.ADD_AGENCY
            })
        ).toEqual({
            type: 'ERROR'
        })

        expect(
            getInverseLineActions(state, {
                type: type.ADD_LINE,
                payload: {
                    name: 'LakeShore East',
                    agencyID: 0,
                    color: 'Maroon',
                    linetype: linetypes.COMMUTER_REGIONAL_RAIL
                }
            })
        ).toEqual({
            type: type.UNDO_ADD_LINE,
            payload: {
                id: 3
            }
        })

        expect(
            getInverseLineActions(state, {
                type: type.UNDO_ADD_LINE,
                payload: {
                    id: 2
                }
            })
        ).toEqual({
            type: type.ADD_LINE,
            payload: {
                agencyID: 0,
                name: 'Ontario',
                color: 'Blue',
                linetype: linetypes.LIGHT_METRO
            }
        })

        expect(
            getInverseLineActions(state, {
                type: type.EDIT_LINE,
                payload: {
                    id: 2,
                    name: 'Rontario Line',
                    color: 'Red',
                    linetype: linetypes.MAGLEV
                }
            })
        ).toEqual({
            type: type.EDIT_LINE,
            payload: {
                id: 2,
                name: 'Ontario',
                color: 'Blue',
                linetype: linetypes.LIGHT_METRO
            }
        })

        var MockDate = require('mockdate')
        MockDate.set(1434319925275)
        let date = new Date().toISOString()

        expect(
            getInverseLineActions(state, {
                type: type.REMOVE_LINE,
                payload: {
                    id: 2,
                    deletedAt: date
                }
            })
        ).toEqual({
            type: type.RESTORE_LINE,
            payload: {
                id: 2
            }
        })

        expect(
            getInverseLineActions(state, {
                type: type.RESTORE_LINE,
                payload: {
                    id: 2
                }
            })
        ).toEqual({
            type: type.REMOVE_LINE,
            payload: {
                id: 2,
                deletedAt: date
            }
        })
    })
})
