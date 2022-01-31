import { ADD_TRANSFER, EDIT_TRANSFER, REMOVE_TRANSFER, RESTORE_TRANSFER, UNDO_ADD_TRANSFER } from '../actionTypes'
import * as actions from '../transferActions'
import * as types from '../../object_types/transfertypes'

describe('transfer action creator', () => {
    it('Add Transfer Action Creator', () => {
        let stationA_ID = 0
        let stationB_ID = 1
        let type = types.IN_STATION

        expect(actions.addTransfer(stationA_ID, stationB_ID, type)).toEqual({
            type: ADD_TRANSFER,
            payload: {
                stationIDs: [stationA_ID, stationB_ID],
                type: type
            }
        })
    })

    it('Undo Add Transfer Action Creator', () => {
        let id = 0
        let stationA_ID = 0
        let stationB_ID = 1
        let type = types.IN_STATION

        expect(actions.undoAddTransfer(id, stationA_ID, stationB_ID, type)).toEqual({
            type: UNDO_ADD_TRANSFER,
            payload: {
                id: id,
                stationIDs: [stationA_ID, stationB_ID],
                type: type
            }
        })
    })

    it('Edit Transfer Action Creator', () => {
        let id = 0
        let type = types.PAID_OUT_STATION

        expect(actions.editTransfer(id, type)).toEqual({
            type: EDIT_TRANSFER,
            payload: {
                id: id,
                type: type
            }
        })
    })

    it('Remove Transfer Action Creator', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275)

        let id = 0
        let deletedAt = new Date().toISOString()

        expect(actions.removeTransfer(id)).toEqual({
            type: REMOVE_TRANSFER,
            payload: {
                id: id,
                deletedAt: deletedAt
            }
        })
    })

    it('Restore Transfer Action Creator', () => {
        let id = 0

        expect(actions.restoreTransfer(id)).toEqual({
            type: RESTORE_TRANSFER,
            payload: {
                id: id
            }
        })
    })

    it('get inverse transfer actions', () => {
        let state = [
            { id: 0, stationIDs: [0, 1], type: types.FREE_OUT_STATION, deletedAt: null },
            { id: 1, stationIDs: [0, 2], type: types.IN_STATION, deletedAt: null },
            { id: 2, stationIDs: [1, 2], type: types.FREE_OUT_STATION, deletedAt: null }
        ]

        expect(
            actions.getInverseTransferActions(state, {
                type: ADD_TRANSFER,
                payload: {
                    stationIDs: [1, 3],
                    type: types.FREE_OUT_STATION
                }
            })
        ).toEqual({
            type: UNDO_ADD_TRANSFER,
            payload: {
                id: 3,
                stationIDs: [1, 3],
                type: types.FREE_OUT_STATION
            }
        })

        expect(
            actions.getInverseTransferActions(state, {
                type: UNDO_ADD_TRANSFER,
                payload: {
                    id: 3,
                    stationIDs: [1, 3],
                    type: types.FREE_OUT_STATION
                }
            })
        ).toEqual({
            type: ADD_TRANSFER,
            payload: {
                stationIDs: [1, 3],
                type: types.FREE_OUT_STATION
            }
        })

        expect(
            actions.getInverseTransferActions(state, {
                type: EDIT_TRANSFER,
                payload: {
                    id: 2,
                    type: types.IN_STATION
                }
            })
        ).toEqual({
            type: EDIT_TRANSFER,
            payload: {
                id: 2,
                type: types.FREE_OUT_STATION
            }
        })

        var MockDate = require('mockdate')
        MockDate.set(1434319925275)

        let deletedAt = new Date().toISOString()

        expect(
            actions.getInverseTransferActions(state, {
                type: REMOVE_TRANSFER,
                payload: {
                    id: 0,
                    deletedAt: deletedAt
                }
            })
        ).toEqual({
            type: RESTORE_TRANSFER,
            payload: {
                id: 0
            }
        })

        expect(
            actions.getInverseTransferActions(state, {
                type: RESTORE_TRANSFER,
                payload: {
                    id: 0
                }
            })
        ).toEqual({
            type: REMOVE_TRANSFER,
            payload: {
                id: 0,
                deletedAt: deletedAt
            }
        })
    })
})
