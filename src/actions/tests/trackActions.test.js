import { selectStationsGivenStationIDs } from '../../reducers/stationsReducer';
import {
    ADD_TRACK,
    REMOVE_TRACK,
    RESTORE_TRACK
} from '../actionTypes'

import * as actions from '../trackActions'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore()

it('Add Track Action Creator', () => {
    let stationA_ID = 0;
    let stationB_ID = 1;

    let store = mockStore()
    expect(store.dispatch(
        actions.addTrack(stationA_ID, stationB_ID)
    )).toEqual({
        type: ADD_TRACK,
        payload: {
            stations: []
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

it('should return stations given stationID correctly', () => {
    let store = mockStore({
        stations: [
            { id: 0, deletedAt: null },
            { id: 1, deletedAt: null },
            { id: 2, deletedAt: null },
            { id: 3, deletedAt: null },
            { id: 4, deletedAt: 'yesterday' },
            { id: 5, deletedAt: 'yesterday' },
        ]
    })

    expect(selectStationsGivenStationIDs(store.getState(), [0, 1, 2, 3, 4, 5], true)).toEqual([
        { id: 0, deletedAt: null },
        { id: 1, deletedAt: null },
        { id: 2, deletedAt: null },
        { id: 3, deletedAt: null },
        { id: 4, deletedAt: 'yesterday' },
        { id: 5, deletedAt: 'yesterday' },
    ])

    expect(selectStationsGivenStationIDs(store.getState(), [0, 1, 2, 3, 4, 5], false)).toEqual([
        { id: 0, deletedAt: null },
        { id: 1, deletedAt: null },
        { id: 2, deletedAt: null },
        { id: 3, deletedAt: null },
    ])
})
