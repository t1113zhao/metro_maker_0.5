import * as actions from '../serviceActions'
import * as type from '../actionTypes'
import * as periods from '../../object_types/servicePeriods'

describe('Service Action Creator', () => {
    it('Add Service Action Creator', () => {
        let lineID = 0
        let agencyID = 0
        let name = 'Yonge University Local'
        let frequency = 40
        let servicePeriod = periods.ALWAYS
        expect(actions.addService(lineID, agencyID, name, servicePeriod, frequency)).toEqual({
            type: type.ADD_SERVICE,
            payload: {
                lineID: lineID,
                agencyID: agencyID,
                name: name,
                servicePeriod: servicePeriod,
                frequency: frequency
            }
        })
    })

    it('Undo Add Service Action Creator', () => {
        let lineID = 0
        let agencyID = 0
        let name = 'Yonge University Local'
        let frequency = 40
        let servicePeriod = periods.ALWAYS

        expect(actions.undoAddService(0, lineID, agencyID, name, servicePeriod, frequency)).toEqual({
            type: type.UNDO_ADD_SERVICE,
            payload: {
                id: 0,
                lineID: lineID,
                agencyID: agencyID,
                name: name,
                servicePeriod: servicePeriod,
                frequency: frequency
            }
        })
    })

    it('Edit Service Details Action Creator', () => {
        let id = 0
        let name = 'Yonge University Local'
        let frequency = 40
        let servicePeriod = periods.ALWAYS

        expect(actions.editService(id, name, servicePeriod, frequency)).toEqual({
            type: type.EDIT_SERVICE,
            payload: {
                id: 0,
                name: name,
                frequency: frequency,
                servicePeriod: servicePeriod
            }
        })
    })

    it('Remove Service Action Creator', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275)

        let id = 0
        let deletedAt = new Date().toISOString()

        expect(actions.removeService(id)).toEqual({
            type: type.REMOVE_SERVICE,
            payload: {
                id: id,
                deletedAt: deletedAt
            }
        })
    })

    it('Restore Service Action Creator', () => {
        let id = 0

        expect(actions.restoreService(id)).toEqual({
            type: type.RESTORE_SERVICE,
            payload: {
                id: id
            }
        })
    })

    it('Should get inverse actions', () => {
        let state = [
            {
                id: 0,
                agencyID: 0,
                name: 'Yonge University Local',
                servicePeriod: periods.ALWAYS,
                frequency: 40,
                lineID: 0,
                deletedAt: null
            },
            {
                id: 1,
                agencyID: 0,
                name: 'Bloor Danforth Local',
                servicePeriod: periods.ALWAYS,
                frequency: 40,
                lineID: 1,
                deletedAt: null
            },
            {
                id: 2,
                agencyID: 0,
                name: 'Sheppard Local',
                servicePeriod: periods.ALWAYS,
                frequency: 40,
                lineID: 2,
                deletedAt: null
            },
            {
                id: 3,
                agencyID: 0,
                name: 'Ontario Local',
                servicePeriod: periods.ALWAYS,
                frequency: 40,
                lineID: 3,
                deletedAt: null
            },
            {
                id: 4,
                agencyID: 0,
                name: 'Eglinton Local',
                servicePeriod: periods.ALWAYS,
                frequency: 40,
                lineID: 4,
                deletedAt: null
            }
        ]

        expect(
            actions.getInverseServiceActions(state, {
                type: type.ADD_SERVICE,
                payload: {
                    lineID: 0,
                    agencyID: 0,
                    name: 'Yonge University Express',
                    servicePeriod: periods.PEAK_ONLY,
                    frequency: 20
                }
            })
        ).toEqual({
            type: type.UNDO_ADD_SERVICE,
            payload: {
                id: 5,
                lineID: 0,
                agencyID: 0,
                name: 'Yonge University Express',
                servicePeriod: periods.PEAK_ONLY,
                frequency: 20
            }
        })

        expect(
            actions.getInverseServiceActions(state, {
                type: type.UNDO_ADD_SERVICE,
                payload: {
                    id: 5,
                    lineID: 0,
                    agencyID: 0,
                    name: 'Yonge University Express',
                    servicePeriod: periods.PEAK_ONLY,
                    frequency: 20
                }
            })
        ).toEqual({
            type: type.ADD_SERVICE,
            payload: {
                lineID: 0,
                agencyID: 0,
                name: 'Yonge University Express',
                servicePeriod: periods.PEAK_ONLY,
                frequency: 20
            }
        })

        expect(
            actions.getInverseServiceActions(state, {
                type: type.EDIT_SERVICE,
                payload: {
                    id: 0,
                    name: 'Ronge University Local',
                    servicePeriod: periods.WEEKEND_ONLY,
                    frequency: 2
                }
            })
        ).toEqual({
            type: type.EDIT_SERVICE,
            payload: {
                id: 0,
                name: 'Yonge University Local',
                servicePeriod: periods.ALWAYS,
                frequency: 40
            }
        })

        var MockDate = require('mockdate')
        MockDate.set(1434319925275)
        let date = new Date().toISOString()

        expect(
            actions.getInverseServiceActions(state, {
                type: type.REMOVE_SERVICE,
                payload: {
                    id: 0,
                    deletedAt: date
                }
            })
        ).toEqual({
            type: type.RESTORE_SERVICE,
            payload: {
                id: 0
            }
        })

        expect(
            actions.getInverseServiceActions(state, {
                type: type.RESTORE_SERVICE,
                payload: {
                    id: 0
                }
            })
        ).toEqual({
            type: type.REMOVE_SERVICE,
            payload: {
                id: 0,
                deletedAt: date
            }
        })
    })
})
