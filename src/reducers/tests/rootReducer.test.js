import configureMockStore from 'redux-mock-store'
import { ADD_SERVICE, UNDO_ADD_SERVICE } from '../../actions/actionTypes'

import { crossSliceReducer, combinedReducers, selectAgenciesLinesAndServicesAsTreeObject } from '../presentReducer'
const mockStore = configureMockStore()

describe('combinedReducer', () => {
    it('should work with initial state', () => {
        expect(combinedReducers(undefined, {})).toEqual({
            agencies: [],
            lines: [],
            services: [],
            serviceRoutes: [],
            stations: [],
            tracks: [],
            transfers: [],
            viewState: {
                focusType: null,
                focusID: null,
                screen: null,
                searchString: null,
                userID: null,
                userType: null,
                viewMode: null,
                viewParams: null,
                window: null,
                zoom: null
            }
        })
    })
})

describe('crossSliceReducer', () => {
    let defaultState = {
        agencies: [],
        lines: [],
        services: [],
        serviceRoutes: [],
        stations: [],
        tracks: [],
        transfers: [],
        viewState: {
            focusType: null,
            focusID: null,
            screen: null,
            searchString: null,
            userID: null,
            userType: null,
            viewMode: null,
            viewParams: null,
            window: null,
            zoom: null
        }
    }

    let stateWith1Service = {
        agencies: [],
        lines: [],
        services: [
            {
                id: 0,
                lineID: 0,
                name: 'stouffville RER',
                servicePeriod: 'express',
                frequency: 'always',
                deletedAt: null
            }
        ],
        serviceRoutes: [{ id: 0, deletedAt: null, stopsByID: [], serviceTracks: [] }],
        stations: [],
        tracks: [],
        transfers: [],
        viewState: {
            focusType: null,
            focusID: null,
            screen: null,
            searchString: null,
            userID: null,
            userType: null,
            viewMode: null,
            viewParams: null,
            window: null,
            zoom: null
        }
    }

    let stateWith2Services = {
        agencies: [],
        lines: [],
        services: [
            {
                id: 0,
                lineID: 0,
                name: 'stouffville RER',
                servicePeriod: 'express',
                frequency: 'always',
                deletedAt: null
            },
            {
                id: 1,
                lineID: 1,
                name: 'barrie RER',
                servicePeriod: 'express',
                frequency: 'always',
                deletedAt: null
            }
        ],
        serviceRoutes: [
            { id: 0, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] }
        ],
        stations: [],
        tracks: [],
        transfers: [],
        viewState: {
            focusType: null,
            focusID: null,
            screen: null,
            searchString: null,
            userID: null,
            userType: null,
            viewMode: null,
            viewParams: null,
            window: null,
            zoom: null
        }
    }

    it('should add service and serviceRoute to empty state correctly', () => {
        expect(
            crossSliceReducer(defaultState, {
                type: ADD_SERVICE,
                payload: {
                    lineID: 0,
                    name: 'stouffville RER',
                    servicePeriod: 'express',
                    frequency: 'always'
                }
            })
        ).toEqual(stateWith1Service)
    })

    it('should add service and serviceRoute to non-Empty state correctly', () => {
        expect(
            crossSliceReducer(stateWith1Service, {
                type: ADD_SERVICE,
                payload: {
                    lineID: 1,
                    name: 'barrie RER',
                    servicePeriod: 'express',
                    frequency: 'always'
                }
            })
        ).toEqual(stateWith2Services)
    })

    it('should undo add service and service Route to empty state', () => {
        expect(
            crossSliceReducer(stateWith1Service, {
                type: UNDO_ADD_SERVICE,
                payload: {
                    id: 0
                }
            })
        ).toEqual(defaultState)
    })

    it('should undo add service and service Route to non empty state', () => {
        expect(
            crossSliceReducer(stateWith2Services, {
                type: UNDO_ADD_SERVICE,
                payload: {
                    id: 1
                }
            })
        ).toEqual(stateWith1Service)
    })
})

describe('crossSliceSelectors', () => {
    it('selectAgenciesLinesAndServicesAsTreeObject should work', () => {
        let store = mockStore({
            agencies: [
                { id: 0, name: 'GO' },
                { id: 1, name: 'TTC' },
                { id: 2, name: 'YRT/VIVA' },
                { id: 3, name: 'MIWAY' }
            ],
            lines: [
                { id: 0, agencyID: 0, deletedAt: null, name: 'Stoufville' },
                { id: 1, agencyID: 0, deletedAt: null, name: 'Lakeshore West' },
                { id: 2, agencyID: 0, deletedAt: null, name: 'Lakeshore East' }
            ],
            services: [
                { id: 0, lineID: 0, deletedAt: null, name: 'Stoufville Local' },
                { id: 1, lineID: 0, deletedAt: null, name: 'Stoufville Express' },
                { id: 2, lineID: 1, deletedAt: null, name: 'Lakeshore West Express' },
                { id: 3, lineID: 1, deletedAt: '2021-05-23T18:47:02.436Z' },
                { id: 4, lineID: 2, deletedAt: '2021-05-23T18:47:02.436Z' },
                { id: 5, lineID: 2, deletedAt: '2021-05-23T18:47:02.436Z' }
            ]
        })

        expect(selectAgenciesLinesAndServicesAsTreeObject(store.getState(), false)).toEqual([
            {
                title: 'GO',
                key: '0',
                selectable: false,
                children: [
                    {
                        title: 'Stoufville',
                        key: '0-0',
                        selectable: false,
                        children: [
                            { title: 'Stoufville Local', key: '0-0-0', selectable: false, isLeaf: true },
                            { title: 'Stoufville Express', key: '0-0-1', selectable: false, isLeaf: true }
                        ]
                    },
                    {
                        title: 'Lakeshore West',
                        key: '0-1',
                        selectable: false,
                        children: [{ title: 'Lakeshore West Express', key: '0-1-2', selectable: false, isLeaf: true }]
                    },
                    {
                        title: 'Lakeshore East',
                        key: '0-2',
                        selectable: false,
                        children: []
                    }
                ]
            },
            {
                title: 'TTC',
                key: '1',
                selectable: false,
                children: []
            },
            {
                title: 'YRT/VIVA',
                key: '2',
                selectable: false,
                children: []
            },
            {
                title: 'MIWAY',
                key: '3',
                selectable: false,
                children: []
            }
        ])
    })
})
