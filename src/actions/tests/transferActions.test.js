import {
    ADD_TRANSFER,
    EDIT_TRANSFER,
    REMOVE_TRANSFER,
    RESTORE_TRANSFER
} from '../actionTypes'
import * as actions from '../transferActions'
import * as types from '../../object_types/transfertypes'

it('Add Transfer Action Creator', () => {
    let stationA_ID = 0;
    let stationB_ID = 1;
    let type = types.IN_STATION

    expect(actions.addTransfer(stationA_ID, stationB_ID, type)).toEqual({
        type: ADD_TRANSFER,
        payload: {
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
    MockDate.set(1434319925275);

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
