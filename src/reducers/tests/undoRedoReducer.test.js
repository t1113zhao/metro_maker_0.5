import * as actionTypes from '../../actions/actionTypes'

import * as agencyActions from '../../actions/agencyActions'
import undoRedoReducer from '../undoRedoReducer'
import rootReducer from '../presentReducer'

describe('undo-redo reducer main function', () => {
    let reducer = undoRedoReducer(rootReducer)

    it('should create initial state correctly', () => {
        expect(reducer(undefined, {})).toEqual({
            past: [],
            present: {
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
            },
            future: []
        })
    })

    let emptyState = {
        past: [],
        present: {
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
        },
        future: []
    }

    let undoState = {
        past: [{ type: actionTypes.UNDO_ADD_AGENCY, payload: { id: 0 } }],
        present: {
            agencies: [{ id: 0, name: 'Go', color: 'Green', deletedAt: null }],
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
        },
        future: []
    }

    let redoState = {
        past: [],
        present: {
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
        },
        future: [{ type: actionTypes.ADD_AGENCY, payload: { name: 'Go', color: 'Green' } }]
    }

    it('should add to past correctly when normal action dispatched', () => {
        expect(
            reducer(emptyState, {
                type: actionTypes.ADD_AGENCY,
                payload: {
                    name: 'Go',
                    color: 'Green'
                }
            })
        ).toEqual(undoState)
    })

    it('should work correctly when undo action dispatched', () => {
        expect(
            reducer(undoState, {
                type: actionTypes.GLOBAL_UNDO
            })
        ).toEqual(redoState)
    })

    it('should work correctly when redo action dispatched', () => {
        expect(
            reducer(redoState, {
                type: actionTypes.GLOBAL_REDO
            })
        ).toEqual(undoState)
    })
})
