import * as actions from '../agencyActions'
import * as type from '../actionTypes'
import configureMockStore from 'redux-mock-store'
import { lineIDsGivenAgencyId } from '../../reducers/linesReducer'
import { serviceIDsGivenAgencyID } from '../../reducers/servicesReducer'
import { getById } from '../../utils/utils'

const mockStore = configureMockStore()

describe('agency action creator', () => {
    it('Add Agency Action Creator', () => {
        let name = 'MetroLinx'
        let colorCode = '#4a7729'
        expect(actions.addAgency(name, colorCode)).toEqual({
            type: type.ADD_AGENCY,
            payload: {
                name: name,
                color: colorCode
            }
        })
    })

    it('Should Undo Add Agency Action Creator', () => {
        expect(actions.undoAddAgency(1)).toEqual({
            type: type.UNDO_ADD_AGENCY,
            payload: {
                id: 1
            }
        })
    })

    it('Edit Agency Action Creator', () => {
        let id = '0'
        let name = 'MetroLinx'
        let colorCode = '#4a7729'
        expect(actions.editAgency(id, name, colorCode)).toEqual({
            type: type.EDIT_AGENCY,
            payload: {
                id: 0,
                name: name,
                color: colorCode
            }
        })
    })

    it('Remove Agency Action Creator', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275)

        expect(actions.removeAgency(0)).toEqual({
            type: type.REMOVE_AGENCY,
            payload: {
                id: 0,
                deletedAt: new Date().toISOString()
            }
        })
    })

    it('Restore Agency Action Creator', () => {
        var MockDate = require('mockdate')
        MockDate.set(1434319925275)

        expect(actions.restoreAgency(0)).toEqual({
            type: type.RESTORE_AGENCY,
            payload: {
                id: 0
            }
        })
    })

    it('Get Correct Line IDs', () => {
        let store = mockStore({
            agencies: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }],
            lines: [
                { id: 0, agencyID: 0, deletedAt: null },
                { id: 1, agencyID: 0, deletedAt: null },
                { id: 2, agencyID: 0, deletedAt: null },
                { id: 3, agencyID: 1, deletedAt: null },
                { id: 4, agencyID: 1, deletedAt: null },
                { id: 5, agencyID: 1, deletedAt: '2021-05-23T18:47:02.436Z' },
                { id: 6, agencyID: 2, deletedAt: '2021-05-23T18:47:02.436Z' },
                { id: 7, agencyID: 2, deletedAt: '2021-05-23T18:47:02.436Z' },
                { id: 8, agencyID: 2, deletedAt: '2021-05-23T18:47:02.436Z' }
            ],
            services: [
                { id: 0, lineID: 0, deletedAt: null },
                { id: 1, lineID: 1, deletedAt: null },
                { id: 2, lineID: 2, deletedAt: null },
                { id: 3, lineID: 2, deletedAt: null },
                { id: 4, lineID: 3, deletedAt: null },
                { id: 5, lineID: 4, deletedAt: null },
                { id: 6, lineID: 4, deletedAt: null },
                { id: 7, lineID: 5, deletedAt: '2021-05-23T18:47:02.436Z' },
                { id: 8, lineID: 6, deletedAt: '2021-05-23T18:47:02.436Z' },
                { id: 9, lineID: 7, deletedAt: '2021-05-23T18:47:02.436Z' },
                { id: 10, lineID: 8, deletedAt: '2021-05-23T18:47:02.436Z' }
            ]
        })

        expect(lineIDsGivenAgencyId(store.getState(), parseInt(0), false)).toEqual([0, 1, 2])

        expect(lineIDsGivenAgencyId(store.getState(), parseInt(1), false)).toEqual([3, 4])

        expect(lineIDsGivenAgencyId(store.getState(), parseInt(1), true)).toEqual([3, 4, 5])

        expect(lineIDsGivenAgencyId(store.getState(), parseInt(2), false)).toEqual([])

        expect(lineIDsGivenAgencyId(store.getState(), parseInt(3), false)).toEqual([])
    })

    it('Get Correct Service IDs for Remove/Replace', () => {
        let store = mockStore({
            agencies: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }],
            lines: [
                { id: 0, agencyID: 0, deletedAt: null },
                { id: 1, agencyID: 0, deletedAt: null },
                { id: 2, agencyID: 0, deletedAt: null },
                { id: 3, agencyID: 1, deletedAt: null },
                { id: 4, agencyID: 1, deletedAt: null },
                { id: 5, agencyID: 1, deletedAt: '2021-05-23T18:47:02.436Z' },
                { id: 6, agencyID: 2, deletedAt: '2021-05-23T18:47:02.436Z' },
                { id: 7, agencyID: 2, deletedAt: '2021-05-23T18:47:02.436Z' },
                { id: 8, agencyID: 2, deletedAt: '2021-05-23T18:47:02.436Z' }
            ],
            services: [
                { id: 0, lineID: 0, deletedAt: null },
                { id: 1, lineID: 1, deletedAt: null },
                { id: 2, lineID: 2, deletedAt: null },
                { id: 3, lineID: 2, deletedAt: null },
                { id: 4, lineID: 3, deletedAt: null },
                { id: 5, lineID: 4, deletedAt: null },
                { id: 6, lineID: 4, deletedAt: null },
                { id: 7, lineID: 5, deletedAt: '2021-05-23T18:47:02.436Z' },
                { id: 8, lineID: 6, deletedAt: '2021-05-23T18:47:02.436Z' },
                { id: 9, lineID: 7, deletedAt: '2021-05-23T18:47:02.436Z' },
                { id: 10, lineID: 8, deletedAt: '2021-05-23T18:47:02.436Z' }
            ]
        })

        expect(serviceIDsGivenAgencyID(store.getState(), parseInt(0), false)).toEqual([0, 1, 2, 3])

        expect(serviceIDsGivenAgencyID(store.getState(), parseInt(0), false)).toEqual([0, 1, 2, 3])

        expect(serviceIDsGivenAgencyID(store.getState(), parseInt(1), false)).toEqual([4, 5, 6])

        expect(serviceIDsGivenAgencyID(store.getState(), parseInt(1), true)).toEqual([4, 5, 6, 7])
    })

    it('should get the right inverse action', () => {
        let state = [
            { id: 0, name: 'MetroLinx', color: 'Green' },
            { id: 1, name: 'TTC', color: 'Red' },
            { id: 2, name: 'MiWay', color: 'Orange' },
            { id: 3, name: 'YRT', color: 'Blue' }
        ]

        expect(
            actions.getInverseAgencyActions(state, {
                type: type.ADD_LINE
            })
        ).toEqual({
            type: 'ERROR'
        })

        expect(
            actions.getInverseAgencyActions(state, {
                type: type.ADD_AGENCY,
                payload: {
                    name: 'Yetrolinx',
                    color: 'Yellow'
                }
            })
        ).toEqual({
            type: type.UNDO_ADD_AGENCY,
            payload: {
                id: 4
            }
        })

        expect(
            actions.getInverseAgencyActions(state, {
                type: type.UNDO_ADD_AGENCY,
                payload: {
                    id: 3
                }
            })
        ).toEqual({
            type: type.ADD_AGENCY,
            payload: {
                name: 'YRT',
                color: 'Blue'
            }
        })

        expect(
            actions.getInverseAgencyActions(state, {
                type: type.EDIT_AGENCY,
                payload: {
                    id: 1,
                    name: 'Meeway',
                    color: 'Pink'
                }
            })
        ).toEqual({
            type: type.EDIT_AGENCY,
            payload: {
                id: 1,
                name: 'TTC',
                color: 'Red'
            }
        })

        expect(
            actions.getInverseAgencyActions(state, {
                type: type.REMOVE_AGENCY,
                payload: {
                    id: 2
                }
            })
        ).toEqual({
            type: type.RESTORE_AGENCY,
            payload: {
                id: 2
            }
        })

        var MockDate = require('mockdate')
        MockDate.set(1434319925275)
        let date = new Date().toISOString()

        expect(
            actions.getInverseAgencyActions(state, {
                type: type.RESTORE_AGENCY,
                payload: {
                    id: 2
                }
            })
        ).toEqual({
            type: type.REMOVE_AGENCY,
            payload: {
                id: 2,
                deletedAt: date
            }
        })
    })
})
