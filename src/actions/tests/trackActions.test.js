import { selectStationsGivenStationIDs } from '../../reducers/stationsReducer'
import { ADD_TRACK, REMOVE_TRACK, RESTORE_TRACK, UNDO_ADD_TRACK } from '../actionTypes'

import * as actions from '../trackActions'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore()

describe('track action creator', () => {
    it('Add Track Action Creator', () => {
        let stationA = { id: 0, longitude: 46, latitude: 47 }
        let stationB = { id: 1, longitude: 47, latitude: 47 }
        expect(actions.addTrack(stationA, stationB)).toEqual({
            type: ADD_TRACK,
            payload: {
                stations: [stationA, stationB]
            }
        })
    })

    it('Undo Add Track Creator', () => {
        let stationA = { id: 0, longitude: 46, latitude: 47 }
        let stationB = { id: 1, longitude: 47, latitude: 47 }
        let id = 0

        expect(actions.undoAddTrack(id, stationA, stationB)).toEqual({
            type: UNDO_ADD_TRACK,
            payload: {
                id: id,
                stations: [stationA, stationB]
            }
        })
    })

    it('Remove Track Action Creator', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275)

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
                { id: 5, deletedAt: 'yesterday' }
            ]
        })

        expect(selectStationsGivenStationIDs(store.getState(), [0, 1, 2, 3, 4, 5], true)).toEqual([
            { id: 0, deletedAt: null },
            { id: 1, deletedAt: null },
            { id: 2, deletedAt: null },
            { id: 3, deletedAt: null },
            { id: 4, deletedAt: 'yesterday' },
            { id: 5, deletedAt: 'yesterday' }
        ])

        expect(selectStationsGivenStationIDs(store.getState(), [0, 1, 2, 3, 4, 5], false)).toEqual([
            { id: 0, deletedAt: null },
            { id: 1, deletedAt: null },
            { id: 2, deletedAt: null },
            { id: 3, deletedAt: null }
        ])
    })

    it('should get inverse track actions', () => {
        let state = {
            stations: [
                { id: 0, latitude: 43.7, longitude: -79.44, deletedAt: null },
                { id: 1, latitude: 43.7, longitude: -79.45, deletedAt: null },
                { id: 2, latitude: 43.7, longitude: -79.46, deletedAt: null }
            ],
            tracks: [
                {
                    id: 0,
                    stationIDs: [0, 1],
                    nodes: [
                        { id: 0, stationID: 0, latitude: 43.7, longitude: -79.44 },
                        { id: 1, stationID: 1, latitude: 43.7, longitude: -79.45 }
                    ],
                    deletedAt: null
                },
                {
                    id: 1,
                    stationIDs: [1, 2],
                    nodes: [
                        { id: 0, stationID: 1, latitude: 43.7, longitude: -79.45 },
                        { id: 1, stationID: 2, latitude: 43.7, longitude: -79.46 }
                    ],
                    deletedAt: null
                }
            ]
        }

        expect(
            actions.getInverseTrackActions(state.tracks, {
                type: ADD_TRACK,
                payload: {
                    stations: [
                        { id: 0, stationID: 1, latitude: 43.7, longitude: -79.45 },
                        { id: 1, stationID: 2, latitude: 43.7, longitude: -79.46 }
                    ]
                }
            })
        ).toEqual({
            type: UNDO_ADD_TRACK,
            payload: {
                id: 2,
                stations: [
                    { id: 0, stationID: 1, latitude: 43.7, longitude: -79.45 },
                    { id: 1, stationID: 2, latitude: 43.7, longitude: -79.46 }
                ]
            }
        })

        let store = mockStore(state)

        expect(
            store.dispatch(
                actions.getInverseTrackActions(state.tracks, {
                    type: UNDO_ADD_TRACK,
                    payload: {
                        id: 2,
                        stations: [
                            { id: 0, stationID: 1, latitude: 43.7, longitude: -79.45 },
                            { id: 1, stationID: 2, latitude: 43.7, longitude: -79.46 }
                        ]
                    }
                })
            )
        ).toEqual({
            type: ADD_TRACK,
            payload: {
                stations: [
                    { id: 0, stationID: 1, latitude: 43.7, longitude: -79.45 },
                    { id: 1, stationID: 2, latitude: 43.7, longitude: -79.46 }
                ]
            }
        })

        var MockDate = require('mockdate')
        MockDate.set(1434319925275)
        let date = new Date().toISOString()

        expect(
            store.dispatch(
                actions.getInverseTrackActions(state.tracks, {
                    type: REMOVE_TRACK,
                    payload: {
                        id: 0,
                        deletedAt: date
                    }
                })
            )
        ).toEqual({
            type: RESTORE_TRACK,
            payload: {
                id: 0
            }
        })

        expect(
            store.dispatch(
                actions.getInverseTrackActions(state.tracks, {
                    type: RESTORE_TRACK,
                    payload: {
                        id: 0
                    }
                })
            )
        ).toEqual({
            type: REMOVE_TRACK,
            payload: {
                id: 0,
                deletedAt: date
            }
        })
    })
})
