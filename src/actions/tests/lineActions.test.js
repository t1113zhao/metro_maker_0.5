import * as actions from '../lineActions'
import * as type from '../actionTypes'

import configureMockStore from 'redux-mock-store'
import * as linetypes from '../../object_types/linetypes'
import { serviceIDsGivenLineID } from '../../reducers/servicesReducer'

const mockStore = configureMockStore()

it('Add Line Action Creator', () => {
    let name = 'Yonge-University'
    let agencyID = 0
    let color = '#ffcb0c'
    let linetype = linetypes.HEAVY_METRO

    expect(actions.addLine(agencyID, name, color, linetype)).toEqual({
        type: type.ADD_LINE,
        payload: {
            agencyID: agencyID,
            name: name,
            color: color,
            linetype: linetype
        }
    })
})

it('Edit Line Action Creator', () => {
    let name = 'Yonge-University'
    let lineID = 0
    let color = '#ffcb0c'
    let linetype = linetypes.HEAVY_METRO

    expect(actions.editLine(lineID, name, color, linetype)).toEqual({
        type: type.EDIT_LINE,
        payload: {
            id: lineID,
            name: name,
            color: color,
            linetype: linetype
        }
    })
})

it('Remove Line Action Creator', () => {
    var MockDate = require('mockdate')
    MockDate.set(1434319925275);

    let store = mockStore({
        agencies: [
            { id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }],
        lines: [
            { id: 0, agencyID: 0, deletedAt: null },
            { id: 1, agencyID: 0, deletedAt: null },
            { id: 2, agencyID: 0, deletedAt: null },
        ],
        services: [
            { id: 0, lineID: 0, deletedAt: null },
            { id: 1, lineID: 0, deletedAt: null },
            { id: 2, lineID: 1, deletedAt: null },
            { id: 3, lineID: 1, deletedAt: '2021-05-23T18:47:02.436Z' },
            { id: 4, lineID: 2, deletedAt: '2021-05-23T18:47:02.436Z' },
            { id: 5, lineID: 2, deletedAt: '2021-05-23T18:47:02.436Z' }
        ]
    })

    expect(store.dispatch(actions.removeLine(0))).toEqual({
        type: type.REMOVE_LINE,
        payload: {
            id: 0,
            deletedAt: new Date().toISOString(),
            serviceIDs: []
        }
    })
})

it('Get Correct Service IDs for Remove/Restore', () => {
    let store = mockStore({
        agencies: [
            { id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }],
        lines: [
            { id: 0, agencyID: 0, deletedAt: null },
            { id: 1, agencyID: 0, deletedAt: null },
            { id: 2, agencyID: 0, deletedAt: null },
        ],
        services: [
            { id: 0, lineID: 0, deletedAt: null },
            { id: 1, lineID: 0, deletedAt: null },
            { id: 2, lineID: 1, deletedAt: null },
            { id: 3, lineID: 1, deletedAt: '2021-05-23T18:47:02.436Z' },
            { id: 4, lineID: 2, deletedAt: '2021-05-23T18:47:02.436Z' },
            { id: 5, lineID: 2, deletedAt: '2021-05-23T18:47:02.436Z' }
        ]
    })

    expect(serviceIDsGivenLineID(store.getState(), parseInt(0), false)).toEqual([0, 1])

    expect(serviceIDsGivenLineID(store.getState(), parseInt(0), true)).toEqual([0, 1])

    expect(serviceIDsGivenLineID(store.getState(), parseInt(1), false)).toEqual([2])

    expect(serviceIDsGivenLineID(store.getState(), parseInt(1), true)).toEqual([2, 3])

    expect(serviceIDsGivenLineID(store.getState(), parseInt(2), false)).toEqual([])

    expect(serviceIDsGivenLineID(store.getState(), parseInt(2), true)).toEqual([4, 5])

    expect(serviceIDsGivenLineID(store.getState(), parseInt(3), false)).toEqual([])
})

it('Restore Line Action Creator', () => {
    var MockDate = require('mockdate')
    MockDate.set(1434319925275);

    let store = mockStore({
        agencies: [
            { id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }],
        lines: [
            { id: 0, agencyID: 0, deletedAt: null },
            { id: 1, agencyID: 0, deletedAt: null },
            { id: 2, agencyID: 0, deletedAt: null },
        ],
        services: [
            { id: 0, lineID: 0, deletedAt: null },
            { id: 1, lineID: 0, deletedAt: null },
            { id: 2, lineID: 1, deletedAt: null },
            { id: 3, lineID: 1, deletedAt: '2021-05-23T18:47:02.436Z' },
            { id: 4, lineID: 2, deletedAt: '2021-05-23T18:47:02.436Z' },
            { id: 5, lineID: 2, deletedAt: '2021-05-23T18:47:02.436Z' }
        ]
    })

    expect(store.dispatch(actions.restoreLine(0))).toEqual({
        type: type.RESTORE_LINE,
        payload: {
            id: 0,
            serviceIDs: []
        }
    })
})
