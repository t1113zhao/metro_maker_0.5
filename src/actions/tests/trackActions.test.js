import {
    ADD_TRACK,
    REMOVE_TRACK,
    RESTORE_TRACK
} from '../actionTypes'

import * as actions from '../trackActions'

it('Add Track Action Creator', () => {
    let stationA_ID = 0;
    let stationB_ID = 1;

    expect(actions.addTrack(stationA_ID, stationB_ID)).toEqual({
        type: ADD_TRACK,
        payload: {
            stationIDs: [0, 1]
        }
    })
})

it('Remove Track Action Creator', () => {
    var MockDate = require('mockdate')
    MockDate.set(1434319925275);

    let id = 0
    let date = new Date().toISOString()

    expect(actions.removeTrack(id)).toEqual({
        type: REMOVE_TRACK,
        payload: {
            id: id,
            deletedAt: date
        }
    })
})

it('Restore Track Action Creator', () => {
    let id = 0

    expect(actions.restoreTrack(id)).toEqual({
        type: RESTORE_TRACK,
        payload: {
            id: id
        }
    })
})
