import { ADD_NEW_TRACKROUTE_NODES, EDIT_TRACKROUTE_NODES, CLEAR_TRACKROUTE_NODES } from '../actionTypes'
import * as actions from '../trackRouteActions'

describe('track route action creators', () => {
    it('Add New Track Route Action Creator', () => {
        let nodes = [
            [45, 76],
            [45.5, 76.5],
            [46, 77]
        ]
        let trackID = 0

        expect(actions.addNewTrackRoute(nodes, trackID)).toEqual({
            type: ADD_NEW_TRACKROUTE_NODES,
            payload: {
                nodes: nodes,
                trackID: trackID
            }
        })
    })

    it('Edit Track Route Action Creator', () => {
        let startIndex = 1
        let endIndex = 4
        let nodes = [
            [45, 76],
            [45.5, 76.5],
            [46, 77]
        ]
        let trackID = 0

        expect(actions.editTrackRoute(startIndex, endIndex, nodes, trackID)).toEqual({
            type: EDIT_TRACKROUTE_NODES,
            payload: {
                startIndex: startIndex,
                endIndex: endIndex,
                nodes: nodes,
                trackID: trackID
            }
        })
    })

    it('Clear Track Route Action Creator', () => {
        let trackID = 0
        let nodes = [
            [45, 76],
            [45.5, 76.5],
            [46, 77]
        ]

        expect(actions.clearTrackRoute(nodes, trackID)).toEqual({
            type: CLEAR_TRACKROUTE_NODES,
            payload: {
                nodes: nodes,
                trackID: trackID
            }
        })
    })

    it('should get inverse trackroute actions', () => {
        let state = [
            {
                id: 0,
                stationIDs: [0, 1],
                nodes: [
                    [45, 76],
                    [45.1, 75.9],
                    [45.2, 75.8],
                    [45.3, 75.7],
                    [45.3, 75.6]
                ],
                stationNodes: [
                    [44.9, 76.1],
                    [45.2, 75.5]
                ]
            },
            {
                id: 1,
                stationIDs: [1, 2],
                nodes: [
                    [45.1, 75.3],
                    [45.0, 75.1],
                    [44.8, 74.9]
                ],
                stationNodes: [
                    [45.2, 75.5],
                    [44.6, 74.7]
                ]
            },
            {
                id: 2,
                stationIDs: [2, 3],
                nodes: [],
                stationNodes: [
                    [44.6, 74.7],
                    [43, 74]
                ]
            }
        ]

        expect(
            actions.getInverseTrackRouteActions(state, {
                type: ADD_NEW_TRACKROUTE_NODES,
                payload: {
                    nodes: [
                        [44.3, 74.5],
                        [43.5, 74.3]
                    ],
                    trackID: 2
                }
            })
        ).toEqual({
            type: CLEAR_TRACKROUTE_NODES,
            payload: {
                nodes: [
                    [44.3, 74.5],
                    [43.5, 74.3]
                ],
                trackID: 2
            }
        })

        expect(
            actions.getInverseTrackRouteActions(state, {
                type: CLEAR_TRACKROUTE_NODES,
                payload: {
                    nodes: [
                        [44.3, 74.5],
                        [43.5, 74.3]
                    ],
                    trackID: 2
                }
            })
        ).toEqual({
            type: ADD_NEW_TRACKROUTE_NODES,
            payload: {
                nodes: [
                    [44.3, 74.5],
                    [43.5, 74.3]
                ],
                trackID: 2
            }
        })

        //longer replacing shorter
        expect(
            actions.getInverseTrackRouteActions(state, {
                type: EDIT_TRACKROUTE_NODES,
                payload: {
                    nodes: [
                        [45, 75.9],
                        [45, 75.8]
                    ],
                    trackID: 0,
                    startIndex: 1,
                    endIndex: 3
                }
            })
        ).toEqual({
            type: EDIT_TRACKROUTE_NODES,
            payload: {
                nodes: [[45.2, 75.8]],
                trackID: 0,
                startIndex: 1,
                endIndex: 4
            }
        })

        // like replacing like
        expect(
            actions.getInverseTrackRouteActions(state, {
                type: EDIT_TRACKROUTE_NODES,
                payload: {
                    nodes: [
                        [45, 75.9],
                        [45, 75.8]
                    ],
                    trackID: 0,
                    startIndex: 0,
                    endIndex: 3
                }
            })
        ).toEqual({
            type: EDIT_TRACKROUTE_NODES,
            payload: {
                nodes: [
                    [45.1, 75.9],
                    [45.2, 75.8]
                ],
                trackID: 0,
                startIndex: 0,
                endIndex: 3
            }
        })

        // shorter replacing longer
        expect(
            actions.getInverseTrackRouteActions(state, {
                type: EDIT_TRACKROUTE_NODES,
                payload: {
                    nodes: [
                        [45, 75.9],
                        [45, 75.8]
                    ],
                    trackID: 0,
                    startIndex: 0,
                    endIndex: 4
                }
            })
        ).toEqual({
            type: EDIT_TRACKROUTE_NODES,
            payload: {
                nodes: [
                    [45.1, 75.9],
                    [45.2, 75.8],
                    [45.3, 75.7]
                ],
                trackID: 0,
                startIndex: 0,
                endIndex: 3
            }
        })

        //replacing the first
        expect(
            actions.getInverseTrackRouteActions(state, {
                type: EDIT_TRACKROUTE_NODES,
                payload: {
                    nodes: [
                        [45, 75.9],
                        [45, 75.8]
                    ],
                    trackID: 0,
                    startIndex: -1,
                    endIndex: 2
                }
            })
        ).toEqual({
            type: EDIT_TRACKROUTE_NODES,
            payload: {
                nodes: [
                    [45, 76],
                    [45.1, 75.9]
                ],
                trackID: 0,
                startIndex: -1,
                endIndex: 2
            }
        })

        //replacing the last
        expect(
            actions.getInverseTrackRouteActions(state, {
                type: EDIT_TRACKROUTE_NODES,
                payload: {
                    nodes: [
                        [45, 75.9],
                        [45, 75.8]
                    ],
                    trackID: 0,
                    startIndex: 2,
                    endIndex: 5
                }
            })
        ).toEqual({
            type: EDIT_TRACKROUTE_NODES,
            payload: {
                nodes: [
                    [45.3, 75.7],
                    [45.3, 75.6]
                ],
                trackID: 0,
                startIndex: 2,
                endIndex: 5
            }
        })
    })
})
