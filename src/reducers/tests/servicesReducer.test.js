import {
    EDIT_SERVICE,
    REMOVE_SERVICE,
    RESTORE_SERVICE,
    REMOVE_LINE,
    RESTORE_LINE,
    REMOVE_AGENCY,
    RESTORE_AGENCY
} from '../../actions/actionTypes'

import reducer, { selectAllServices, selectServiceGivenID, selectServicesGivenLineID, serviceIDsGivenLineID, selectServicesGivenAgencyID, serviceIDsGivenAgencyID } from '../servicesReducer'
import * as servicePeriods from '../../object_types/servicePeriods'

describe('Service Reducer', () => {

    let defaultState = [
        {
            id: 0,
            lineID: 0,
            name: 'stouffville RER',
            servicePeriod: 'express',
            deletedAt: null
        },
        {
            id: 1,
            lineID: 0,
            name: 'stouffville commuter',
            servicePeriod: 'peak only',
            deletedAt: null
        },
        {
            id: 2,
            lineID: 1,
            name: 'barrie RER',
            servicePeriod: 'express',
            deletedAt: null
        },
        {
            id: 3,
            lineID: 1,
            name: 'barrie commuter',
            servicePeriod: 'peak only',
            deletedAt: null
        },
        {
            id: 9,
            lineID: 5,
            name: 'yonge university spadina',
            deletedAt: null
        },
        {
            id: 10,
            lineID: 6,
            name: 'sheppard',
            servicePeriod: 'local',
            deletedAt: null
        },
        {
            id: 11,
            lineID: 7,
            name: 'bloor danforth',
            servicePeriod: 'local',
            deletedAt: null
        },
        {
            id: 12,
            lineID: 8,
            name: 'eglinton',
            servicePeriod: 'local',
            deletedAt: null
        },
    ]
    it('should create initial state correctly', () => {
        expect(reducer(undefined, {})).toEqual([])
    })

    // Add service is in root reducer test

    it('should edit service correctly', () => {
        let name = 'Blonge University Local'
        let serviceperiod = servicePeriods.LIMITED
        let frequency = 2
        expect(reducer([
            {
                id: 0, lineID: 0, name: 'Yonge University Local', servicePeriod: servicePeriods.ALWAYS, frequency: 40
            }
        ], {
            type: EDIT_SERVICE,
            payload: {
                id: 0, name: name, servicePeriod: serviceperiod, frequency: frequency
            }
        })).toEqual([
            {
                id: 0, lineID: 0, name: name, servicePeriod: serviceperiod, frequency: frequency
            }
        ])
    })

    it('should remove service correctly', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275);

        let id = 0
        let date = new Date().toISOString()

        let deletedState = reducer(defaultState, {
            type: REMOVE_SERVICE,
            payload: {
                id: id,
                deletedAt: date
            }
        })

        expect(deletedState).toEqual([
            {
                id: 0,
                lineID: 0,
                name: 'stouffville RER',
                servicePeriod: 'express',
                deletedAt: date
            },
            {
                id: 1,
                lineID: 0,
                name: 'stouffville commuter',
                servicePeriod: 'peak only',
                deletedAt: null
            },
            {
                id: 2,
                lineID: 1,
                name: 'barrie RER',
                servicePeriod: 'express',
                deletedAt: null
            },
            {
                id: 3,
                lineID: 1,
                name: 'barrie commuter',
                servicePeriod: 'peak only',
                deletedAt: null
            },
            {
                id: 9,
                lineID: 5,
                name: 'yonge university spadina',
                deletedAt: null
            },
            {
                id: 10,
                lineID: 6,
                name: 'sheppard',
                servicePeriod: 'local',
                deletedAt: null
            },
            {
                id: 11,
                lineID: 7,
                name: 'bloor danforth',
                servicePeriod: 'local',
                deletedAt: null
            },
            {
                id: 12,
                lineID: 8,
                name: 'eglinton',
                servicePeriod: 'local',
                deletedAt: null
            },
        ])
    })

    it('should remove service correctly when removing line', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275);

        let id = 0
        let date = new Date().toISOString()

        let deletedState = reducer(defaultState, {
            type: REMOVE_LINE,
            payload: {
                id: 1,
                deletedAt: date,
                serviceIDs: [2, 3]
            }
        })

        expect(deletedState).toEqual([
            {
                id: 0,
                lineID: 0,
                name: 'stouffville RER',
                servicePeriod: 'express',
                deletedAt: null
            },
            {
                id: 1,
                lineID: 0,
                name: 'stouffville commuter',
                servicePeriod: 'peak only',
                deletedAt: null
            },
            {
                id: 2,
                lineID: 1,
                name: 'barrie RER',
                servicePeriod: 'express',
                deletedAt: date
            },
            {
                id: 3,
                lineID: 1,
                name: 'barrie commuter',
                servicePeriod: 'peak only',
                deletedAt: date
            },
            {
                id: 9,
                lineID: 5,
                name: 'yonge university spadina',
                deletedAt: null
            },
            {
                id: 10,
                lineID: 6,
                name: 'sheppard',
                servicePeriod: 'local',
                deletedAt: null
            },
            {
                id: 11,
                lineID: 7,
                name: 'bloor danforth',
                servicePeriod: 'local',
                deletedAt: null
            },
            {
                id: 12,
                lineID: 8,
                name: 'eglinton',
                servicePeriod: 'local',
                deletedAt: null
            },
        ])
    })

    it('should remove service correctly when removing agency', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275);
        let date = new Date().toISOString()

        let deletedState = reducer(defaultState, {
            type: REMOVE_AGENCY,
            payload: {
                id: 2,
                deletedAt: date,
                lineIDs: [5, 6, 7, 8],
                serviceIDs: [9, 10, 11, 12]
            }
        })

        expect(deletedState).toEqual([
            {
                id: 0,
                lineID: 0,
                name: 'stouffville RER',
                servicePeriod: 'express',
                deletedAt: null
            },
            {
                id: 1,
                lineID: 0,
                name: 'stouffville commuter',
                servicePeriod: 'peak only',
                deletedAt: null
            },
            {
                id: 2,
                lineID: 1,
                name: 'barrie RER',
                servicePeriod: 'express',
                deletedAt: null
            },
            {
                id: 3,
                lineID: 1,
                name: 'barrie commuter',
                servicePeriod: 'peak only',
                deletedAt: null
            },
            {
                id: 9,
                lineID: 5,
                name: 'yonge university spadina',
                deletedAt: date
            },
            {
                id: 10,
                lineID: 6,
                name: 'sheppard',
                servicePeriod: 'local',
                deletedAt: date
            },
            {
                id: 11,
                lineID: 7,
                name: 'bloor danforth',
                servicePeriod: 'local',
                deletedAt: date
            },
            {
                id: 12,
                lineID: 8,
                name: 'eglinton',
                servicePeriod: 'local',
                deletedAt: date
            },
        ])
    })

    it('should restore service correctly', () => {
        let deletedState = [
            {
                id: 0,
                lineID: 0,
                name: 'stouffville RER',
                servicePeriod: 'express',
                deletedAt: 'yesterday'
            },
            {
                id: 1,
                lineID: 0,
                name: 'stouffville commuter',
                servicePeriod: 'peak only',
                deletedAt: null
            },
            {
                id: 2,
                lineID: 1,
                name: 'barrie RER',
                servicePeriod: 'express',
                deletedAt: null
            },
            {
                id: 3,
                lineID: 1,
                name: 'barrie commuter',
                servicePeriod: 'peak only',
                deletedAt: null
            },
            {
                id: 9,
                lineID: 5,
                name: 'yonge university spadina',
                deletedAt: null
            },
            {
                id: 10,
                lineID: 6,
                name: 'sheppard',
                servicePeriod: 'local',
                deletedAt: null
            },
            {
                id: 11,
                lineID: 7,
                name: 'bloor danforth',
                servicePeriod: 'local',
                deletedAt: null
            },
            {
                id: 12,
                lineID: 8,
                name: 'eglinton',
                servicePeriod: 'local',
                deletedAt: null
            },
        ]
        expect(reducer(deletedState, {
            type: RESTORE_SERVICE,
            payload: {
                id: 0
            }
        })).toEqual(defaultState)
    })

    it('should restore service correctly when line restored', () => {
        let deletedState = [
            {
                id: 0,
                lineID: 0,
                name: 'stouffville RER',
                servicePeriod: 'express',
                deletedAt: null
            },
            {
                id: 1,
                lineID: 0,
                name: 'stouffville commuter',
                servicePeriod: 'peak only',
                deletedAt: null
            },
            {
                id: 2,
                lineID: 1,
                name: 'barrie RER',
                servicePeriod: 'express',
                deletedAt: 'yesterday'
            },
            {
                id: 3,
                lineID: 1,
                name: 'barrie commuter',
                servicePeriod: 'peak only',
                deletedAt: 'yesterday'
            },
            {
                id: 9,
                lineID: 5,
                name: 'yonge university spadina',
                deletedAt: null
            },
            {
                id: 10,
                lineID: 6,
                name: 'sheppard',
                servicePeriod: 'local',
                deletedAt: null
            },
            {
                id: 11,
                lineID: 7,
                name: 'bloor danforth',
                servicePeriod: 'local',
                deletedAt: null
            },
            {
                id: 12,
                lineID: 8,
                name: 'eglinton',
                servicePeriod: 'local',
                deletedAt: null
            },
        ]
        expect(reducer(deletedState, {
            type: RESTORE_LINE,
            payload: {
                id: 0,
                serviceIDs: [2, 3]
            }
        })).toEqual(defaultState)
    })

    it('should restore service correctly when line restored', () => {
        let deletedState = [
            {
                id: 0,
                lineID: 0,
                name: 'stouffville RER',
                servicePeriod: 'express',
                deletedAt: null
            },
            {
                id: 1,
                lineID: 0,
                name: 'stouffville commuter',
                servicePeriod: 'peak only',
                deletedAt: null
            },
            {
                id: 2,
                lineID: 1,
                name: 'barrie RER',
                servicePeriod: 'express',
                deletedAt: null
            },
            {
                id: 3,
                lineID: 1,
                name: 'barrie commuter',
                servicePeriod: 'peak only',
                deletedAt: null
            },
            {
                id: 9,
                lineID: 5,
                name: 'yonge university spadina',
                deletedAt: 'yesterday'
            },
            {
                id: 10,
                lineID: 6,
                name: 'sheppard',
                servicePeriod: 'local',
                deletedAt: 'yesterday'
            },
            {
                id: 11,
                lineID: 7,
                name: 'bloor danforth',
                servicePeriod: 'local',
                deletedAt: 'yesterday'
            },
            {
                id: 12,
                lineID: 8,
                name: 'eglinton',
                servicePeriod: 'local',
                deletedAt: 'yesterday'
            },
        ]
        expect(reducer(deletedState, {
            type: RESTORE_AGENCY,
            payload: {
                id: 0,
                lineIDs: [5, 6, 7, 8],
                serviceIDs: [9, 10, 11, 12]
            }
        })).toEqual(defaultState)
    })

    let selectorState = {
        services: [
            { id: 0, lineID: 0, deletedAt: null },
            { id: 1, lineID: 0, deletedAt: 'yesterday' },
            { id: 2, lineID: 1, deletedAt: null },
            { id: 3, lineID: 1, deletedAt: 'yesterday' },
            { id: 4, lineID: 2, deletedAt: null },
            { id: 5, lineID: 2, deletedAt: 'yesterday' },
        ],
        lines: [
            { id: 0, agencyID: 0, deletedAt: null },
            { id: 1, agencyID: 0, deletedAt: null },
            { id: 2, agencyID: 1, deletedAt: null }
        ]
    }

    it('should select all services', () => {
        expect(selectAllServices(selectorState, true)).toEqual([
            { id: 0, lineID: 0, deletedAt: null },
            { id: 1, lineID: 0, deletedAt: 'yesterday' },
            { id: 2, lineID: 1, deletedAt: null },
            { id: 3, lineID: 1, deletedAt: 'yesterday' },
            { id: 4, lineID: 2, deletedAt: null },
            { id: 5, lineID: 2, deletedAt: 'yesterday' },
        ])

        expect(selectAllServices(selectorState, false)).toEqual([
            { id: 0, lineID: 0, deletedAt: null },
            { id: 2, lineID: 1, deletedAt: null },
            { id: 4, lineID: 2, deletedAt: null },
        ])
    })

    it('should select service given id', () => {
        expect(selectServiceGivenID(selectorState, 0, true)).toEqual([
            { id: 0, lineID: 0, deletedAt: null },
        ])
        expect(selectServiceGivenID(selectorState, 0, false)).toEqual([
            { id: 0, lineID: 0, deletedAt: null },
        ])
        expect(selectServiceGivenID(selectorState, 1, true)).toEqual([
            { id: 1, lineID: 0, deletedAt: 'yesterday' },
        ])
        expect(selectServiceGivenID(selectorState, 1, false)).toEqual([])
    })

    it('should select services given line id', () => {
        expect(selectServicesGivenLineID(selectorState, 0, true)).toEqual([
            { id: 0, lineID: 0, deletedAt: null },
            { id: 1, lineID: 0, deletedAt: 'yesterday' },
        ])
        expect(selectServicesGivenLineID(selectorState, 0, false)).toEqual([
            { id: 0, lineID: 0, deletedAt: null },
        ])
    })

    it('should select service ids given line id', () => {
        expect(serviceIDsGivenLineID(selectorState, 0, true)).toEqual([0, 1])
        expect(serviceIDsGivenLineID(selectorState, 0, false)).toEqual([0])
    })

    it('should select services given agency id', () => {
        expect(selectServicesGivenAgencyID(selectorState, 0, true)).toEqual([
            { id: 0, lineID: 0, deletedAt: null },
            { id: 1, lineID: 0, deletedAt: 'yesterday' },
            { id: 2, lineID: 1, deletedAt: null },
            { id: 3, lineID: 1, deletedAt: 'yesterday' },
        ])
        expect(selectServicesGivenAgencyID(selectorState, 0, false)).toEqual([
            { id: 0, lineID: 0, deletedAt: null },
            { id: 2, lineID: 1, deletedAt: null },
        ])
    })

    it('should select service ids given agency id', () => {
        expect(serviceIDsGivenAgencyID(selectorState, 0, true)).toEqual([0, 1, 2, 3])
        expect(serviceIDsGivenAgencyID(selectorState, 0, false)).toEqual([0, 2,])
    })
})