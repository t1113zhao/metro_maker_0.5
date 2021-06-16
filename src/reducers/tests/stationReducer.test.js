import {
    ADD_STATION,
    UNDO_ADD_STATION,
    EDIT_STATION,
    MOVE_STATION,
    REMOVE_STATION,
    RESTORE_STATION,
} from '../../actions/actionTypes'

import reducer from '../stationsReducer'

describe('Station Reducer', () => {
    it('Should create initial state correctly', () => {
        expect(reducer(undefined, {})).toEqual([])
    })

    it('Should add station to empty state correctly', () => {
        let name = 'Bloor Yonge'
        let description = 'Intersection of Line 1 and 2'
        let latitude = 45
        let longitude = -76
        expect(reducer([], {
            type: ADD_STATION,
            payload: {
                name: name,
                description: description,
                latitude: latitude,
                longitude: longitude,
            }
        })).toEqual([
            { id: 0, name: name, description: description, latitude: latitude, longitude: longitude, deletedAt: null }
        ])
    })

    it('Should add station to non-empty state correctly', () => {
        let name = 'station 1'
        let description = 'description'
        let latitude = 48
        let longitude = -79

        expect(reducer([
            { id: 0, name: 'station 0', description: 'description', latitude: 45, longitude: -76, deletedAt: null }
        ], {
            type: ADD_STATION,
            payload: {
                name: name,
                description: description,
                latitude: latitude,
                longitude: longitude,
            }
        })).toEqual([
            { id: 0, name: 'station 0', description: 'description', latitude: 45, longitude: -76, deletedAt: null },
            { id: 1, name: name, description: description, latitude: latitude, longitude: longitude, deletedAt: null },
        ])
    })

    it('should undo add station to non empty state correctly', () => {
        expect(reducer([
            { id: 0, latitude: 45, longitude: -80, deletedAt: null },
            { id: 1, latitude: 45, longitude: -80.1, deletedAt: null },
        ], {
            type: UNDO_ADD_STATION,
            payload: {
                id: 1
            }
        })).toEqual([
            { id: 0, latitude: 45, longitude: -80, deletedAt: null },
        ])
    })

    it('should undo add station to empty state correctly', () => {
        expect(reducer([
            { id: 0, latitude: 45, longitude: -80, deletedAt: null },
        ], {
            type: UNDO_ADD_STATION,
            payload: {
                id: 0
            }
        })).toEqual([])
    })

    it('Should edit station correctly', () => {
        let name = 'real name'
        let description = 'real description'

        expect(reducer([
            { id: 0, name: 'station 0', description: 'description', latitude: 45, longitude: -76, deletedAt: null }
        ], {
            type: EDIT_STATION,
            payload: {
                id: 0, name: name, description: description
            }
        })).toEqual([
            { id: 0, name: name, description: description, latitude: 45, longitude: -76, deletedAt: null }
        ])
    })

    it('should move station correctly', () => {
        let latitude = 47.8
        let longitude = -82

        expect(reducer([
            { id: 0, name: 'station 0', description: 'description', latitude: 45, longitude: -76, deletedAt: null }
        ], {
            type: MOVE_STATION,
            payload: {
                id: 0,
                latitude: latitude,
                longitude: longitude
            }
        })).toEqual([
            { id: 0, name: 'station 0', description: 'description', latitude: latitude, longitude: longitude, deletedAt: null }
        ])
    })

    it('Should remove stations correctly', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275);
        let date = new Date().toISOString()

        let id = 0

        let state = [
            { id: 0, latitude: 45, longitude: -80, deletedAt: null },
            { id: 1, latitude: 45, longitude: -80.1, deletedAt: null },
            { id: 2, latitude: 45, longitude: -80.2, deletedAt: null },
            { id: 3, latitude: 45, longitude: -80.3, deletedAt: null },
            { id: 4, latitude: 45, longitude: -80.4, deletedAt: null },
        ]
        expect(reducer(state, {
            type: REMOVE_STATION,
            payload: {
                id: id,
                deletedAt: date,
                transferIDs: []
            }
        })).toEqual([
            { id: 0, latitude: 45, longitude: -80, deletedAt: date },
            { id: 1, latitude: 45, longitude: -80.1, deletedAt: null },
            { id: 2, latitude: 45, longitude: -80.2, deletedAt: null },
            { id: 3, latitude: 45, longitude: -80.3, deletedAt: null },
            { id: 4, latitude: 45, longitude: -80.4, deletedAt: null },
        ])
        expect(reducer(state, {
            type: REMOVE_STATION,
            payload: {
                id: 5,
                deletedAt: date,
                transferIDs: []
            }
        })).toEqual(state)
    })

    it('should restore stations correctly', () => {
        let state = [
            { id: 0, latitude: 45, longitude: -80, deletedAt: 'a while ago' },
            { id: 1, latitude: 45, longitude: -80.1, deletedAt: null },
            { id: 2, latitude: 45, longitude: -80.2, deletedAt: null },
            { id: 3, latitude: 45, longitude: -80.3, deletedAt: null },
            { id: 4, latitude: 45, longitude: -80.4, deletedAt: null },
        ]

        expect(reducer(state, {
            type: RESTORE_STATION,
            payload: {
                id: 0,
                transferIDs: []
            }
        })).toEqual([
            { id: 0, latitude: 45, longitude: -80, deletedAt: null },
            { id: 1, latitude: 45, longitude: -80.1, deletedAt: null },
            { id: 2, latitude: 45, longitude: -80.2, deletedAt: null },
            { id: 3, latitude: 45, longitude: -80.3, deletedAt: null },
            { id: 4, latitude: 45, longitude: -80.4, deletedAt: null },
        ])

        expect(reducer(state, {
            type: RESTORE_STATION,
            payload: {
                id: 5,
                transferIDs: []
            }
        }))
    })
})