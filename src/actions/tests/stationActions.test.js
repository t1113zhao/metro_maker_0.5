import * as actions from '../stationActions'
import * as type from '../actionTypes'
import * as transferTypes from '../../object_types/transfertypes'
import configureMockStore from 'redux-mock-store'
import { transferIDsGivenStationID } from '../../reducers/transferReducer'
import getPresentState from '../../app/storeUtils'

const mockStore = configureMockStore()
describe('station action creator', () => {
    it('Add Station Action Creator', () => {
        let name = 'Bloor-Yonge'
        let description = 'Intersection of Yonge-University and Bloor-Danforth Lines'
        let latitude = 43.671111
        let longitude = -79.385833

        expect(actions.addStation(description, name, latitude, longitude)).toEqual({
            type: type.ADD_STATION,
            payload: {
                name: name,
                description: description,
                latitude: latitude,
                longitude: longitude
            }
        })
    })

    it('Move Station Action Creator', () => {
        let id = 0
        let latitude = 43.671115
        let longitude = -79.3858

        expect(actions.moveStation(id, latitude, longitude)).toEqual({
            type: type.MOVE_STATION,
            payload: {
                id: id,
                latitude: latitude,
                longitude: longitude
            }
        })
    })

    it('Edit Station Action Creator', () => {
        let id = 0
        let name = 'Bloor-Yonge'
        let description = 'Best Station ever'
        expect(actions.editStation(id, description, name)).toEqual({
            type: type.EDIT_STATION,
            payload: {
                id: id,
                name: name,
                description: description
            }
        })
    })

    it('Remove Station', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275)

        let store = mockStore({
            transfers: [
                {
                    id: 0,
                    stationIDs: [0, 1],
                    type: transferTypes.IN_STATION,
                    deletedAt: '2021-05-23T18:47:02.436Z'
                },
                {
                    id: 1,
                    stationIDs: [0, 1],
                    type: transferTypes.IN_STATION,
                    deletedAt: null
                },
                {
                    id: 2,
                    stationIDs: [1, 2],
                    type: transferTypes.IN_STATION,
                    deletedAt: null
                },
                {
                    id: 3,
                    stationIDs: [2, 3],
                    type: transferTypes.IN_STATION,
                    deletedAt: null
                },
                {
                    id: 4,
                    stationIDs: [0, 3],
                    type: transferTypes.IN_STATION,
                    deletedAt: null
                }
            ],
            tracks: [{ id: 0, stationIDs: [0, 1] }]
        })

        let id = 0
        let deletedAt = new Date().toISOString()

        expect(store.dispatch(actions.removeStation(id))).toEqual({
            type: type.REMOVE_STATION,
            payload: {
                id: id,
                deletedAt: deletedAt,
                trackIDs: [],
                transferIDs: []
            }
        })
    })

    it('Restore Station', () => {
        let store = mockStore({
            present: {
                transfers: [
                    {
                        id: 0,
                        stationIDs: [0, 1],
                        type: transferTypes.IN_STATION,
                        deletedAt: '2021-05-23T18:47:02.436Z'
                    },
                    {
                        id: 1,
                        stationIDs: [0, 1],
                        type: transferTypes.IN_STATION,
                        deletedAt: '2021-05-23T18:47:02.436Z'
                    },
                    {
                        id: 2,
                        stationIDs: [1, 2],
                        type: transferTypes.IN_STATION,
                        deletedAt: null
                    },
                    {
                        id: 3,
                        stationIDs: [2, 3],
                        type: transferTypes.IN_STATION,
                        deletedAt: null
                    },
                    {
                        id: 4,
                        stationIDs: [0, 3],
                        type: transferTypes.IN_STATION,
                        deletedAt: '2021-05-23T18:47:02.436Z'
                    }
                ],
                tracks: [{ id: 0, stationIDs: [0, 1] }]
            }
        })

        let id = 0
        expect(store.dispatch(actions.restoreStation(id))).toEqual({
            type: type.RESTORE_STATION,
            payload: {
                id: 0,
                trackIDs: [],
                transferIDs: []
            }
        })
    })

    it('Getting Removable Transfers', () => {
        let store = mockStore({
            transfers: [
                {
                    id: 0,
                    stationIDs: [0, 1],
                    type: transferTypes.IN_STATION,
                    deletedAt: '2021-05-23T18:47:02.436Z'
                },
                {
                    id: 1,
                    stationIDs: [0, 1],
                    type: transferTypes.IN_STATION,
                    deletedAt: null
                },
                {
                    id: 2,
                    stationIDs: [1, 2],
                    type: transferTypes.IN_STATION,
                    deletedAt: null
                },
                {
                    id: 3,
                    stationIDs: [2, 3],
                    type: transferTypes.IN_STATION,
                    deletedAt: null
                },
                {
                    id: 4,
                    stationIDs: [0, 3],
                    type: transferTypes.IN_STATION,
                    deletedAt: '2021-05-23T18:47:02.436Z'
                }
            ]
        })

        expect(transferIDsGivenStationID(store.getState().transfers, 0, true)).toEqual([0, 1, 4])

        expect(transferIDsGivenStationID(store.getState().transfers, 4, true)).toEqual([])

        expect(transferIDsGivenStationID(store.getState().transfers, 0, false)).toEqual([1])

        expect(transferIDsGivenStationID(store.getState().transfers, 1, false)).toEqual([1, 2])
    })

    it('should return correct inverse station actions', () => {
        let state = {
            stations: [
                { id: 0, name: 'Bloor Yonge', description: 'desc', latitude: 45, longitude: -80, deletedAt: null },
                { id: 1, name: 'Bay', description: 'desc', latitude: 45, longitude: -80.1, deletedAt: null },
                { id: 2, name: 'St George', description: 'desc', latitude: 45, longitude: -80.2, deletedAt: null },
                { id: 3, name: 'Spadina-BD', description: 'desc', latitude: 45, longitude: -80.3, deletedAt: null },
                { id: 4, name: 'Spadina-YU', description: 'desc', latitude: 45.1, longitude: -80.3, deletedAt: null }
            ],
            transfers: [
                {
                    id: 0,
                    stationIDs: [3, 4],
                    type: transferTypes.IN_STATION,
                    deletedAt: null
                }
            ],
            tracks: [
                { id: 0, stationIDs: [0, 1] },
                { id: 1, stationIDs: [1, 2] }
            ]
        }

        expect(
            actions.getInverseStationActions(state.stations, {
                type: type.ADD_STATION,
                payload: {
                    name: 'Museum',
                    description: 'ROM',
                    latitude: 44.9,
                    longitude: -80.2
                }
            })
        ).toEqual({
            type: type.UNDO_ADD_STATION,
            payload: {
                id: 5
            }
        })

        expect(
            actions.getInverseStationActions(state.stations, {
                type: type.UNDO_ADD_STATION,
                payload: {
                    id: 4
                }
            })
        ).toEqual({
            type: type.ADD_STATION,
            payload: {
                name: 'Spadina-YU',
                description: 'desc',
                latitude: 45.1,
                longitude: -80.3
            }
        })

        expect(
            actions.getInverseStationActions(state.stations, {
                type: type.MOVE_STATION,
                payload: {
                    id: 0,
                    latitude: 45.1,
                    longitude: -80.3
                }
            })
        ).toEqual({
            type: type.MOVE_STATION,
            payload: {
                id: 0,
                latitude: 45,
                longitude: -80
            }
        })

        expect(
            actions.getInverseStationActions(state.stations, {
                type: type.EDIT_STATION,
                payload: {
                    id: 0,
                    name: 'Bloor Bloor',
                    description: 'meme'
                }
            })
        ).toEqual({
            type: type.EDIT_STATION,
            payload: {
                id: 0,
                name: 'Bloor Yonge',
                description: 'desc'
            }
        })

        let store = mockStore(state)

        var MockDate = require('mockdate')
        MockDate.set(1434319925275)
        let deletedAt = new Date().toISOString()

        expect(
            store.dispatch(
                actions.getInverseStationActions(getPresentState(), {
                    type: type.REMOVE_STATION,
                    payload: {
                        id: 0,
                        deletedAt: deletedAt,
                        trackIDs: [],
                        transferIDs: []
                    }
                })
            )
        ).toEqual({
            type: type.RESTORE_STATION,
            payload: {
                id: 0,
                trackIDs: [],
                transferIDs: []
            }
        })

        expect(
            store.dispatch(
                actions.getInverseStationActions(store.getState(), {
                    type: type.RESTORE_STATION,
                    payload: {
                        id: 0,
                        trackIDs: [],
                        transferIDs: []
                    }
                })
            )
        ).toEqual({
            type: type.REMOVE_STATION,
            payload: {
                id: 0,
                deletedAt: deletedAt,
                trackIDs: [],
                transferIDs: []
            }
        })
    })
})
