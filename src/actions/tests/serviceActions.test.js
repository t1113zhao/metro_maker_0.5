import * as actions from '../serviceActions'
import * as type from '../actionTypes'
import * as periods from '../../object_types/servicePeriods'

it('Add Service Action Creator', () => {
    let lineID = 0
    let name = 'Yonge University Local'
    let frequency = 40
    let servicePeriod = periods.ALWAYS
    expect(actions.addService(lineID, name, servicePeriod, frequency)).toEqual({
        type: type.ADD_SERVICE,
        payload: {
            lineID: lineID,
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
    MockDate.set(1434319925275);

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
