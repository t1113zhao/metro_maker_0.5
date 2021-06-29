import {
    REMOVE_SERVICE, RESTORE_SERVICE,
    REMOVE_LINE, RESTORE_LINE,
    REMOVE_AGENCY, RESTORE_AGENCY,

    ADD_SERVICETRACK_TWOWAY,
    ADD_SERVICETRACK_ONEWAY,
    SWITCH_ONEWAY_DIRECTION,
    ONEWAY_TO_TWOWAY,
    TWOWAY_TO_ONEWAY,
    REMOVE_SERVICE_ALONG_TRACK,
    CLEAR_SERVICE_ROUTE,
    UNDO_CLEAR_SERVICE_ROUTE,
    REMOVE_STOP,
    RESTORE_STOP,
} from '../../actions/actionTypes'

import reducer, { stationCanBeDeleted, trackCanBeDeleted } from '../serviceRouteReducer'

import { serviceRoutePassesThroughStation, isTrackBlockComplete } from '../serviceRouteReducer'

describe('Remove and Restoring ServiceRoute Reducer', () => {
    var MockDate = require('mockdate')
    MockDate.set(1434319925275);
    let date = new Date().toISOString()

    let removeState = [
        { id: 0, deletedAt: null, stopsByID: [], serviceTracks: [] },
        { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        { id: 2, deletedAt: null, stopsByID: [], serviceTracks: [] },
        { id: 3, deletedAt: null, stopsByID: [], serviceTracks: [] },
        { id: 4, deletedAt: null, stopsByID: [], serviceTracks: [] },
    ]

    it('Should remove serviceRoute correctly when Agency removed', () => {
        expect(reducer(removeState, {
            type: REMOVE_AGENCY,
            payload: {
                id: 0, deletedAt: date, lineIDs: [0], serviceIDs: [0, 1, 2]
            }
        })).toEqual([
            { id: 0, deletedAt: date, stopsByID: [], serviceTracks: [] },
            { id: 1, deletedAt: date, stopsByID: [], serviceTracks: [] },
            { id: 2, deletedAt: date, stopsByID: [], serviceTracks: [] },
            { id: 3, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 4, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])
    })

    it('Should remove serviceRoute correctly when Line removed', () => {
        expect(reducer(removeState, {
            type: REMOVE_LINE,
            payload: {
                id: 0, deletedAt: date, serviceIDs: [0, 1, 2]
            }
        })).toEqual([
            { id: 0, deletedAt: date, stopsByID: [], serviceTracks: [] },
            { id: 1, deletedAt: date, stopsByID: [], serviceTracks: [] },
            { id: 2, deletedAt: date, stopsByID: [], serviceTracks: [] },
            { id: 3, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 4, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])
    })

    it('should remove serviceRoute correctly when service removed', () => {
        expect(reducer(removeState, {
            type: REMOVE_SERVICE,
            payload: {
                id: 0, deletedAt: date
            }
        })).toEqual([
            { id: 0, deletedAt: date, stopsByID: [], serviceTracks: [] },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 2, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 3, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 4, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])
    })

    it('should restore serviceRoute correctly when Agency restored', () => {
        expect(reducer([
            { id: 0, deletedAt: 'date', stopsByID: [], serviceTracks: [] },
            { id: 1, deletedAt: 'date', stopsByID: [], serviceTracks: [] },
            { id: 2, deletedAt: 'date', stopsByID: [], serviceTracks: [] },
            { id: 3, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 4, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ], {
            type: RESTORE_AGENCY,
            payload: {
                id: 0, lineIDs: [0], serviceIDs: [0, 2]
            }
        })).toEqual([
            { id: 0, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 1, deletedAt: 'date', stopsByID: [], serviceTracks: [] },
            { id: 2, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 3, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 4, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])
    })

    it('Should restore serviceRoute correctly when Line restored', () => {
        expect(reducer([
            { id: 0, deletedAt: 'date', stopsByID: [], serviceTracks: [] },
            { id: 1, deletedAt: 'date', stopsByID: [], serviceTracks: [] },
            { id: 2, deletedAt: 'date', stopsByID: [], serviceTracks: [] },
            { id: 3, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 4, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ], {
            type: RESTORE_LINE,
            payload: {
                id: 0, deletedAt: date, serviceIDs: [0, 1, 2]
            }
        })).toEqual([
            { id: 0, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 2, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 3, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 4, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])
    })

    it('should restore serviceRoute correctly when Service restored', () => {
        expect(reducer([
            { id: 0, deletedAt: 'date', stopsByID: [], serviceTracks: [] },
            { id: 1, deletedAt: 'date', stopsByID: [], serviceTracks: [] },
            { id: 2, deletedAt: 'date', stopsByID: [], serviceTracks: [] },
            { id: 3, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 4, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ], {
            type: RESTORE_SERVICE,
            payload: {
                id: 0,
            }
        })).toEqual([
            { id: 0, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 1, deletedAt: 'date', stopsByID: [], serviceTracks: [] },
            { id: 2, deletedAt: 'date', stopsByID: [], serviceTracks: [] },
            { id: 3, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 4, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])
    })
})

describe('proper function of Service Route Reducer', () => {
    let emptyServiceRoute = [
        { id: 0, deletedAt: null, stopsByID: [], serviceTracks: [] },
        { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
    ]

    it('should add two way service to empty serviceRoute correctly', () => {
        expect(reducer(emptyServiceRoute, {
            type: ADD_SERVICETRACK_TWOWAY,
            payload: {
                trackID: 6,
                serviceID: 0,
                stationIDs: [0, 1],
                index: 0
            }
        })).toEqual([
            {
                id: 0, deletedAt: null, stopsByID: [0, 1], serviceTracks: [
                    [
                        { trackID: 6, fromStationID: 0, toStationID: 1 },
                        { trackID: 6, fromStationID: 1, toStationID: 0 }
                    ]
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])
    })

    it('should add two way service to non-empty serviceRoute Correctly', () => {
        let state = [
            {
                id: 0, deletedAt: null, stopsByID: [0, 1], serviceTracks: [
                    [
                        { trackID: 6, fromStationID: 0, toStationID: 1 },
                        { trackID: 6, fromStationID: 1, toStationID: 0 }
                    ]
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ]
        expect(reducer(state, {
            type: ADD_SERVICETRACK_TWOWAY,
            payload: {
                trackID: 7,
                serviceID: 0,
                stationIDs: [1, 2],
                index: 1
            }
        })).toEqual([
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 2], serviceTracks: [
                    [
                        { trackID: 6, fromStationID: 0, toStationID: 1 },
                        { trackID: 6, fromStationID: 1, toStationID: 0 }
                    ],
                    [
                        { trackID: 7, fromStationID: 1, toStationID: 2 },
                        { trackID: 7, fromStationID: 2, toStationID: 1 }
                    ]
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])

        expect(reducer(state, {
            type: ADD_SERVICETRACK_TWOWAY,
            payload: {
                trackID: 7,
                serviceID: 0,
                stationIDs: [1, 2],
                index: 0
            }
        })).toEqual([
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 2], serviceTracks: [
                    [
                        { trackID: 7, fromStationID: 1, toStationID: 2 },
                        { trackID: 7, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 6, fromStationID: 0, toStationID: 1 },
                        { trackID: 6, fromStationID: 1, toStationID: 0 }
                    ],
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])

        expect(reducer(state, {
            type: ADD_SERVICETRACK_TWOWAY,
            payload: {
                trackID: 7,
                serviceID: 2,
                stationIDs: [1, 2],
                index: 1
            }
        })).toEqual(state)

    })

    it('should add one way service to empty serviceRoute correctly', () => {
        expect(reducer(emptyServiceRoute, {
            type: ADD_SERVICETRACK_ONEWAY,
            payload: {
                trackID: 6,
                serviceID: 0,
                fromID: 5,
                toID: 6,
                index: 0
            }
        })).toEqual([
            {
                id: 0, deletedAt: null, stopsByID: [5, 6], serviceTracks: [
                    [
                        { trackID: 6, fromStationID: 5, toStationID: 6 },
                    ]
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])
        expect(reducer(emptyServiceRoute, {
            type: ADD_SERVICETRACK_ONEWAY,
            payload: {
                trackID: 6,
                serviceID: 0,
                fromID: 5,
                toID: 6,
                index: -1
            }
        })).toEqual([
            {
                id: 0, deletedAt: null, stopsByID: [5, 6], serviceTracks: [
                    [
                        { trackID: 6, fromStationID: 5, toStationID: 6 },
                    ]
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])
    })

    it('should add one way service to non empty service Route Correctly and create new track block', () => {
        // add to the front
        expect(reducer([
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 2], serviceTracks: [
                    [
                        { trackID: 7, fromStationID: 1, toStationID: 2 },
                        { trackID: 7, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 6, fromStationID: 0, toStationID: 1 },
                        { trackID: 6, fromStationID: 1, toStationID: 0 }
                    ],
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ], {
            type: ADD_SERVICETRACK_ONEWAY,
            payload: {
                trackID: 4,
                serviceID: 0,
                fromID: 2,
                toID: 3,
                index: -1
            }
        })).toEqual([
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 2, 3], serviceTracks: [
                    [
                        { trackID: 4, fromStationID: 2, toStationID: 3 },
                    ],
                    [
                        { trackID: 7, fromStationID: 1, toStationID: 2 },
                        { trackID: 7, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 6, fromStationID: 0, toStationID: 1 },
                        { trackID: 6, fromStationID: 1, toStationID: 0 }
                    ],
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])

        // add to the end
        expect(reducer([
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 2], serviceTracks: [
                    [
                        { trackID: 7, fromStationID: 1, toStationID: 2 },
                        { trackID: 7, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 6, fromStationID: 0, toStationID: 1 },
                        { trackID: 6, fromStationID: 1, toStationID: 0 }
                    ],
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ], {
            type: ADD_SERVICETRACK_ONEWAY,
            payload: {
                trackID: 4,
                serviceID: 0,
                fromID: 2,
                toID: 3,
                index: 2
            }
        })).toEqual([
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 2, 3], serviceTracks: [
                    [
                        { trackID: 7, fromStationID: 1, toStationID: 2 },
                        { trackID: 7, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 6, fromStationID: 0, toStationID: 1 },
                        { trackID: 6, fromStationID: 1, toStationID: 0 }
                    ],
                    [
                        { trackID: 4, fromStationID: 2, toStationID: 3 },
                    ],
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])
    })

    it('should add one way service to existing incomplete trackblock correctly', () => {

        //edit last item in service tracks
        expect(reducer([
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 2, 3], serviceTracks: [
                    [
                        { trackID: 7, fromStationID: 1, toStationID: 2 },
                        { trackID: 7, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 6, fromStationID: 0, toStationID: 1 },
                        { trackID: 6, fromStationID: 1, toStationID: 0 }
                    ],
                    [
                        { trackID: 4, fromStationID: 2, toStationID: 3 },
                    ],
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ], {
            type: ADD_SERVICETRACK_ONEWAY,
            payload: {
                trackID: 5,
                serviceID: 0,
                fromID: 3,
                toID: 4,
                index: 2
            }
        })).toEqual([
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 2, 3, 4], serviceTracks: [
                    [
                        { trackID: 7, fromStationID: 1, toStationID: 2 },
                        { trackID: 7, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 6, fromStationID: 0, toStationID: 1 },
                        { trackID: 6, fromStationID: 1, toStationID: 0 }
                    ],
                    [
                        { trackID: 4, fromStationID: 2, toStationID: 3 },
                        { trackID: 5, fromStationID: 3, toStationID: 4 },
                    ],
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])

        //edit first item in service tracks
        expect(reducer([
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 2, 3], serviceTracks: [
                    [
                        { trackID: 4, fromStationID: 2, toStationID: 3 },
                    ],
                    [
                        { trackID: 7, fromStationID: 1, toStationID: 2 },
                        { trackID: 7, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 6, fromStationID: 0, toStationID: 1 },
                        { trackID: 6, fromStationID: 1, toStationID: 0 }
                    ],
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ], {
            type: ADD_SERVICETRACK_ONEWAY,
            payload: {
                trackID: 5,
                serviceID: 0,
                fromID: 3,
                toID: 4,
                index: 0
            }
        })).toEqual([
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 2, 3, 4], serviceTracks: [
                    [
                        { trackID: 4, fromStationID: 2, toStationID: 3 },
                        { trackID: 5, fromStationID: 3, toStationID: 4 },
                    ],
                    [
                        { trackID: 7, fromStationID: 1, toStationID: 2 },
                        { trackID: 7, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 6, fromStationID: 0, toStationID: 1 },
                        { trackID: 6, fromStationID: 1, toStationID: 0 }
                    ],
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])

        //edit not first or last item in service tracks
        expect(reducer([
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 2, 3], serviceTracks: [
                    [
                        { trackID: 7, fromStationID: 1, toStationID: 2 },
                        { trackID: 7, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 4, fromStationID: 2, toStationID: 3 },
                    ],
                    [
                        { trackID: 6, fromStationID: 0, toStationID: 1 },
                        { trackID: 6, fromStationID: 1, toStationID: 0 }
                    ],
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ], {
            type: ADD_SERVICETRACK_ONEWAY,
            payload: {
                trackID: 5,
                serviceID: 0,
                fromID: 3,
                toID: 4,
                index: 1
            }
        })).toEqual([
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 2, 3, 4], serviceTracks: [
                    [
                        { trackID: 7, fromStationID: 1, toStationID: 2 },
                        { trackID: 7, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 4, fromStationID: 2, toStationID: 3 },
                        { trackID: 5, fromStationID: 3, toStationID: 4 },
                    ],
                    [
                        { trackID: 6, fromStationID: 0, toStationID: 1 },
                        { trackID: 6, fromStationID: 1, toStationID: 0 }
                    ],
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])

        //do not add onto a complete trackblock
        let state = [
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 2], serviceTracks: [
                    [
                        { trackID: 7, fromStationID: 1, toStationID: 2 },
                        { trackID: 7, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 6, fromStationID: 0, toStationID: 1 },
                        { trackID: 6, fromStationID: 1, toStationID: 0 }
                    ],
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ]
        expect(reducer(state, {
            type: ADD_SERVICETRACK_ONEWAY,
            payload: {
                trackID: 4,
                serviceID: 0,
                fromID: 2,
                toID: 3,
                index: 0
            }
        })).toEqual(state)

    })

    let switchState1 = [
        {
            id: 0, deletedAt: null, stopsByID: [1, 2, 3], serviceTracks: [
                [
                    { trackID: 7, fromStationID: 1, toStationID: 2 },
                    { trackID: 7, fromStationID: 2, toStationID: 1 }
                ],
                [
                    { trackID: 4, fromStationID: 2, toStationID: 3 },
                ],
            ]
        },
        { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
    ]

    it('should switch one-way direction', () => {
        expect(reducer(switchState1, {
            type: SWITCH_ONEWAY_DIRECTION,
            payload: {
                trackID: 4,
                serviceID: 0,
                index: 1
            }
        })).toEqual([
            {
                id: 0, deletedAt: null, stopsByID: [1, 2, 3], serviceTracks: [
                    [
                        { trackID: 7, fromStationID: 1, toStationID: 2 },
                        { trackID: 7, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 4, fromStationID: 3, toStationID: 2 },
                    ],
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])

        // can't flip the direction of a two way block
        expect(reducer(switchState1, {
            type: SWITCH_ONEWAY_DIRECTION,
            payload: {
                trackID: 7,
                serviceID: 0,
                index: 1
            }
        })).toEqual(switchState1)

        // can't flip the direction of an unrelated block
        expect(reducer(switchState1, {
            type: SWITCH_ONEWAY_DIRECTION,
            payload: {
                trackID: 7,
                serviceID: 1,
                index: 0
            }
        })).toEqual(switchState1)
    })

    let switchState2 = [
        {
            id: 0, deletedAt: null, stopsByID: [1, 2, 3], serviceTracks: [
                [
                    { trackID: 7, fromStationID: 1, toStationID: 2 },
                    { trackID: 7, fromStationID: 2, toStationID: 1 }
                ],
                [
                    { trackID: 4, fromStationID: 2, toStationID: 3 },
                    { trackID: 4, fromStationID: 3, toStationID: 2 },
                ],
            ]
        },
        { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
    ]

    it('should turn one way block to two way block', () => {
        expect(reducer(switchState1, {
            type: ONEWAY_TO_TWOWAY,
            payload: {
                trackID: 4,
                serviceID: 0,
                index: 1
            }
        })).toEqual(switchState2)
    })

    it('should turn two way block to one way block ', () => {
        expect(reducer(switchState2, {
            type: TWOWAY_TO_ONEWAY,
            payload: {
                trackID: 4,
                serviceID: 0,
                index: 1
            }
        })).toEqual(switchState1)
    })

    it('should remove service along track', () => {
        expect(reducer(switchState1, {
            type: REMOVE_SERVICE_ALONG_TRACK,
            payload: {
                trackID: 4,
                serviceID: 0,
                index: 1
            }
        })).toEqual([
            {
                id: 0, deletedAt: null, stopsByID: [1, 2], serviceTracks: [
                    [
                        { trackID: 7, fromStationID: 1, toStationID: 2 },
                        { trackID: 7, fromStationID: 2, toStationID: 1 }
                    ],
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])

        expect(reducer(switchState1, {
            type: REMOVE_SERVICE_ALONG_TRACK,
            payload: {
                trackID: 7,
                serviceID: 0,
                index: 0,
            }
        })).toEqual([
            {
                id: 0, deletedAt: null, stopsByID: [2, 3], serviceTracks: [
                    [
                        { trackID: 4, fromStationID: 2, toStationID: 3 },
                    ],
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])

        expect(reducer([
            {
                id: 0, deletedAt: null, stopsByID: [1, 2, 3, 4], serviceTracks: [
                    [
                        { trackID: 7, fromStationID: 1, toStationID: 2 },
                        { trackID: 7, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 4, fromStationID: 2, toStationID: 3 },
                        { trackID: 5, fromStationID: 3, toStationID: 4 },
                        { trackID: 6, fromStationID: 4, toStationID: 2 },
                    ],
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ], {
            type: REMOVE_SERVICE_ALONG_TRACK,
            payload: {
                trackID: 4,
                serviceID: 0,
                index: 1,
            }
        })).toEqual([
            {
                id: 0, deletedAt: null, stopsByID: [1, 2, 3, 4], serviceTracks: [
                    [
                        { trackID: 7, fromStationID: 1, toStationID: 2 },
                        { trackID: 7, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 5, fromStationID: 3, toStationID: 4 },
                        { trackID: 6, fromStationID: 4, toStationID: 2 },
                    ],
                ]
            },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])
    })

    it('should clear service route', () => {
        expect(reducer(switchState2, {
            type: CLEAR_SERVICE_ROUTE,
            payload: {
                serviceID: 0
            }
        })).toEqual([
            { id: 0, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ])
    })

    it('should undo clear service route', () => {
        let oldStops = [1, 2, 3]
        let oldServiceTracks = [
            [
                { trackID: 7, fromStationID: 1, toStationID: 2 },
                { trackID: 7, fromStationID: 2, toStationID: 1 }
            ],
            [
                { trackID: 4, fromStationID: 2, toStationID: 3 },
                { trackID: 4, fromStationID: 3, toStationID: 2 },
            ],
        ]

        expect(reducer([
            { id: 0, deletedAt: null, stopsByID: [], serviceTracks: [] },
            { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
        ], {
            type: UNDO_CLEAR_SERVICE_ROUTE,
            payload: {
                serviceID: 0,
                stops: oldStops,
                serviceTracks: oldServiceTracks
            }
        })).toEqual(switchState2)
    })

    // it('should clear trackBlock', () => {
    //     expect(reducer(switchState2, {
    //         type: CLEAR_SERVICE_TRACK_BLOCK,
    //         payload: {
    //             trackID: 4,
    //             serviceID: 0,
    //             index: 1
    //         }
    //     })).toEqual([
    //         {
    //             id: 0, deletedAt: null, stopsByID: [0, 1, 2, 3], serviceTracks: [
    //                 [
    //                     { trackID: 7, fromStationID: 1, toStationID: 2 },
    //                     { trackID: 7, fromStationID: 2, toStationID: 1 }
    //                 ],
    //                 [],
    //             ]
    //         },
    //         { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
    //     ])
    // })

    // it('should undo clear trackBlock', () => {
    //     let oldBlock = [
    //         { trackID: 4, fromStationID: 2, toStationID: 3 },
    //         { trackID: 4, fromStationID: 3, toStationID: 2 },
    //     ]

    //     expect(reducer([
    //         {
    //             id: 0, deletedAt: null, stopsByID: [0, 1, 2, 3], serviceTracks: [
    //                 [
    //                     { trackID: 7, fromStationID: 1, toStationID: 2 },
    //                     { trackID: 7, fromStationID: 2, toStationID: 1 }
    //                 ],
    //                 [],
    //             ]
    //         },
    //         { id: 1, deletedAt: null, stopsByID: [], serviceTracks: [] },
    //     ], {
    //         type: UNDO_CLEAR_SERVICE_TRACK_BLOCK,
    //         payload: {
    //             trackID: 4,
    //         }
    //     }))
    // })
    let stopState = [
        {
            id: 0, deletedAt: null, stopsByID: [0, 1, 2, 3, 4, 5, 6], serviceTracks: [
                [
                    { trackID: 0, fromStationID: 0, toStationID: 1 },
                    { trackID: 0, fromStationID: 1, toStationID: 0 }
                ],
                [
                    { trackID: 1, fromStationID: 1, toStationID: 2 },
                    { trackID: 1, fromStationID: 2, toStationID: 1 }
                ],
                [
                    { trackID: 2, fromStationID: 2, toStationID: 3 },
                    { trackID: 3, fromStationID: 3, toStationID: 4 },
                    { trackID: 4, fromStationID: 4, toStationID: 5 },
                    { trackID: 5, fromStationID: 5, toStationID: 2 },
                ],
                [
                    { trackID: 6, fromStationID: 4, toStationID: 6 },
                    { trackID: 6, fromStationID: 6, toStationID: 4 }
                ],
            ]
        },
    ]

    it('should remove stop', () => {
        expect(reducer([
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 2, 3, 4], serviceTracks: [
                    [
                        { trackID: 0, fromStationID: 0, toStationID: 1 },
                        { trackID: 0, fromStationID: 1, toStationID: 0 }
                    ],
                    [
                        { trackID: 1, fromStationID: 1, toStationID: 2 },
                        { trackID: 1, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 2, fromStationID: 2, toStationID: 3 },
                        { trackID: 2, fromStationID: 3, toStationID: 2 }
                    ],
                    [
                        { trackID: 3, fromStationID: 3, toStationID: 4 },
                        { trackID: 3, fromStationID: 4, toStationID: 3 }
                    ],
                ]
            },
        ], {
            type: REMOVE_STOP,
            payload: {
                serviceID: 0,
                stationID: 2
            }
        })).toEqual([
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 3, 4], serviceTracks: [
                    [
                        { trackID: 0, fromStationID: 0, toStationID: 1 },
                        { trackID: 0, fromStationID: 1, toStationID: 0 }
                    ],
                    [
                        { trackID: 1, fromStationID: 1, toStationID: 2 },
                        { trackID: 1, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 2, fromStationID: 2, toStationID: 3 },
                        { trackID: 2, fromStationID: 3, toStationID: 2 }
                    ],
                    [
                        { trackID: 3, fromStationID: 3, toStationID: 4 },
                        { trackID: 3, fromStationID: 4, toStationID: 3 }
                    ],
                ]
            },
        ])

        expect(reducer([
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 2, 3, 4, 5, 6], serviceTracks: [
                    [
                        { trackID: 0, fromStationID: 0, toStationID: 1 },
                        { trackID: 0, fromStationID: 1, toStationID: 0 }
                    ],
                    [
                        { trackID: 1, fromStationID: 1, toStationID: 2 },
                        { trackID: 1, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 2, fromStationID: 2, toStationID: 3 },
                        { trackID: 3, fromStationID: 3, toStationID: 4 },
                        { trackID: 4, fromStationID: 4, toStationID: 5 },
                        { trackID: 5, fromStationID: 5, toStationID: 2 },
                    ],
                    [
                        { trackID: 6, fromStationID: 4, toStationID: 6 },
                        { trackID: 6, fromStationID: 6, toStationID: 4 }
                    ],
                ]
            },
        ], {
            type: REMOVE_STOP,
            payload: {
                serviceID: 0,
                stationID: 2
            }
        })).toEqual([
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 3, 4, 5, 6], serviceTracks: [
                    [
                        { trackID: 0, fromStationID: 0, toStationID: 1 },
                        { trackID: 0, fromStationID: 1, toStationID: 0 }
                    ],
                    [
                        { trackID: 1, fromStationID: 1, toStationID: 2 },
                        { trackID: 1, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 2, fromStationID: 2, toStationID: 3 },
                        { trackID: 3, fromStationID: 3, toStationID: 4 },
                        { trackID: 4, fromStationID: 4, toStationID: 5 },
                        { trackID: 5, fromStationID: 5, toStationID: 2 },
                    ],
                    [
                        { trackID: 6, fromStationID: 4, toStationID: 6 },
                        { trackID: 6, fromStationID: 6, toStationID: 4 }
                    ],
                ]
            },
        ])

        expect(reducer(stopState, {
            type: REMOVE_STOP,
            payload: {
                serviceID: 0,
                stationID: 7
            }
        })).toEqual(stopState)
    })

    it('should restore stop', () => {
        let restoreStopState = [
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 3, 4, 5, 6], serviceTracks: [
                    [
                        { trackID: 0, fromStationID: 0, toStationID: 1 },
                        { trackID: 0, fromStationID: 1, toStationID: 0 }
                    ],
                    [
                        { trackID: 1, fromStationID: 1, toStationID: 2 },
                        { trackID: 1, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 2, fromStationID: 2, toStationID: 3 },
                        { trackID: 3, fromStationID: 3, toStationID: 4 },
                        { trackID: 4, fromStationID: 4, toStationID: 5 },
                        { trackID: 5, fromStationID: 5, toStationID: 2 },
                    ],
                    [
                        { trackID: 6, fromStationID: 4, toStationID: 6 },
                        { trackID: 6, fromStationID: 6, toStationID: 4 }
                    ],
                ]
            },
        ]
        expect(reducer(restoreStopState, {
            type: RESTORE_STOP,
            payload: {
                serviceID: 0,
                stationID: 2
            }
        })).toEqual([
            {
                id: 0, deletedAt: null, stopsByID: [0, 1, 2, 3, 4, 5, 6], serviceTracks: [
                    [
                        { trackID: 0, fromStationID: 0, toStationID: 1 },
                        { trackID: 0, fromStationID: 1, toStationID: 0 }
                    ],
                    [
                        { trackID: 1, fromStationID: 1, toStationID: 2 },
                        { trackID: 1, fromStationID: 2, toStationID: 1 }
                    ],
                    [
                        { trackID: 2, fromStationID: 2, toStationID: 3 },
                        { trackID: 3, fromStationID: 3, toStationID: 4 },
                        { trackID: 4, fromStationID: 4, toStationID: 5 },
                        { trackID: 5, fromStationID: 5, toStationID: 2 },
                    ],
                    [
                        { trackID: 6, fromStationID: 4, toStationID: 6 },
                        { trackID: 6, fromStationID: 6, toStationID: 4 }
                    ],
                ]
            },
        ])

        expect(reducer(restoreStopState, {
            type: RESTORE_STOP,
            payload: {
                serviceID: 0,
                stationID: 7
            }
        })).toEqual(restoreStopState)
    })
})

describe('Service Route Selectors', () => {
    it('should see if serviceRoute passes through stations', () => {
        let serviceTracks = [
            [
                { trackID: 0, fromStationID: 0, toStationID: 1 },
                { trackID: 0, fromStationID: 1, toStationID: 0 }
            ],
            [
                { trackID: 1, fromStationID: 1, toStationID: 2 },
                { trackID: 1, fromStationID: 2, toStationID: 1 }
            ],
            [
                { trackID: 2, fromStationID: 2, toStationID: 3 },
                { trackID: 3, fromStationID: 3, toStationID: 4 },
                { trackID: 4, fromStationID: 4, toStationID: 5 },
                { trackID: 5, fromStationID: 5, toStationID: 2 },
            ],
            [
                { trackID: 6, fromStationID: 4, toStationID: 6 },
                { trackID: 6, fromStationID: 6, toStationID: 4 }
            ],
        ]

        expect(
            serviceRoutePassesThroughStation(
                serviceTracks, 2
            )
        ).toEqual(true)

        expect(
            serviceRoutePassesThroughStation(
                serviceTracks, 7
            )
        ).toEqual(false)

    })

    it('should show targetBlock Complete', () => {

        expect(isTrackBlockComplete([
            { trackID: 2, fromStationID: 2, toStationID: 3 },
            { trackID: 3, fromStationID: 3, toStationID: 4 },
            { trackID: 4, fromStationID: 4, toStationID: 5 },
            { trackID: 5, fromStationID: 5, toStationID: 2 },
        ])).toEqual(true)

        expect(isTrackBlockComplete([
            { trackID: 3, fromStationID: 3, toStationID: 4 },
            { trackID: 4, fromStationID: 4, toStationID: 5 },
            { trackID: 5, fromStationID: 5, toStationID: 2 },
        ])).toEqual(false)

        expect(isTrackBlockComplete([])).toEqual(false)
    })

    let checkState = [
        {
            id: 0, deletedAt: null, stopsByID: [0, 1, 2, 3, 4, 5, 6], serviceTracks: [
                [
                    { trackID: 0, fromStationID: 0, toStationID: 1 },
                    { trackID: 0, fromStationID: 1, toStationID: 0 }
                ],
                [
                    { trackID: 1, fromStationID: 1, toStationID: 2 },
                    { trackID: 1, fromStationID: 2, toStationID: 1 }
                ],
                [
                    { trackID: 2, fromStationID: 2, toStationID: 3 },
                    { trackID: 3, fromStationID: 3, toStationID: 4 },
                    { trackID: 4, fromStationID: 4, toStationID: 5 },
                    { trackID: 5, fromStationID: 5, toStationID: 2 },
                ],
                [
                    { trackID: 6, fromStationID: 4, toStationID: 6 },
                    { trackID: 6, fromStationID: 6, toStationID: 4 }
                ],
            ]
        },
        {
            id: 1, deletedAt: null, stopsByID: [0, 1, 2, 3, 7], serviceTracks: [
                [
                    { trackID: 0, fromStationID: 0, toStationID: 1 },
                    { trackID: 0, fromStationID: 1, toStationID: 0 }
                ],
                [
                    { trackID: 1, fromStationID: 1, toStationID: 2 },
                    { trackID: 1, fromStationID: 2, toStationID: 1 }
                ],
                [
                    { trackID: 2, fromStationID: 2, toStationID: 3 },
                    { trackID: 2, fromStationID: 3, toStationID: 2 },
                ],
                [
                    { trackID: 7, fromStationID: 3, toStationID: 7 },
                    { trackID: 7, fromStationID: 7, toStationID: 3 }
                ],
            ]
        },
    ]

    it('should say if station can be removed', () => {
        expect(stationCanBeDeleted(checkState, 0)).toEqual({
            canBeDeleted: false,
            serviceIDs: [0, 1]
        })
        expect(stationCanBeDeleted(checkState, 7)).toEqual({
            canBeDeleted: false,
            serviceIDs: [1]
        })
        expect(stationCanBeDeleted(checkState, 8)).toEqual({
            canBeDeleted: true,
            serviceIDs: []
        })
    })

    it('should say if track can be removed', () => {
        expect(trackCanBeDeleted(checkState, 0)).toEqual({
            canBeDeleted: false,
            serviceIDs: [0, 1]
        })
        expect(trackCanBeDeleted(checkState, 7)).toEqual({
            canBeDeleted: false,
            serviceIDs: [1]
        })
        expect(trackCanBeDeleted(checkState, 5)).toEqual({
            canBeDeleted: false,
            serviceIDs: [0]
        })
        expect(trackCanBeDeleted(checkState, 8)).toEqual({
            canBeDeleted: true,
            serviceIDs: []
        })
    })
})
