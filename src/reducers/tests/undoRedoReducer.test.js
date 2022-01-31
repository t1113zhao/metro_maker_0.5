import * as actionTypes from '../../actions/actionTypes'
import configureMockStore from 'redux-mock-store'

import * as agencyActions from '../../actions/agencyActions'
import presentReducer from '../presentReducer'
import {
    combinedReducer,
    pastReducer,
    futureReducer,
    enhanceUndoRedoAction,
    redoUndoActionEnhancer,
    getInverseAction
} from '../undoRedoReducer'
import undoRedoReducer from '../undoRedoReducer'

let defaultState = {
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

// const mockStore = configureMockStore()

describe('combined reducer', function () {
    it('should work with initial state', () => {
        expect(combinedReducer(undefined, {})).toEqual(defaultState)
    })
})

describe('undo-redo reducer', function () {
    it('should work with initial state', () => {
        expect(undoRedoReducer(undefined, {})).toEqual(defaultState)
    })
})

describe('past reducer', function () {
    it('should work with initial state', () => {
        expect(pastReducer(undefined, {})).toEqual([])
    })

    it('should work with an empty Action', () => {
        expect(pastReducer([], { type: actionTypes.EMPTY })).toEqual([])
    })

    it('should append to stack with proper action', () => {})

    it('should remove from stack when undo', () => {})

    it('should add to stack when redo', () => {})
})

describe('future reducer', function () {
    it('should work with initial state', () => {
        expect(futureReducer(undefined, {})).toEqual([])
    })

    it('should work with an empty Action', () => {
        expect(futureReducer([], { type: actionTypes.EMPTY })).toEqual([])
    })

    it('should append to stack with proper action', () => {
        expect(futureReducer([], { type: actionTypes.ADD_SERVICE, isEnhanced: true })).toEqual([])
    })

    it('should add to stack when undo', () => {})

    it('should remove from stack when redo', () => {})
})

let pastActions = [
    { type: actionTypes.ADD_AGENCY, payload: { name: 'One', color: 'blue' } },
    { type: actionTypes.ADD_AGENCY, payload: { name: 'Two', color: 'red' } }
]

describe('enhanceUndoRedoAction', function () {
    let pastAction1 = { type: actionTypes.ADD_AGENCY, payload: { name: 'One', color: 'blue' } }
    let pastAction2 = { type: actionTypes.ADD_AGENCY, payload: { name: 'Two', color: 'red' } }
    let pastAction3 = { type: actionTypes.EDIT_AGENCY, payload: { id: 1, name: 'TwoPlus', color: 'redPlus' } }

    let agency1 = { id: 0, name: 'One', color: 'blue', deletedAt: null }
    let agency2 = { id: 1, name: 'Two', color: 'red', deletedAt: null }
    let agency3 = { id: 1, name: 'TwoPlus', color: 'redPlus', deletedAt: null }

    let futureAction3 = { type: actionTypes.EDIT_AGENCY, payload: { id: 1, name: 'Two', color: 'red' } }
    let futureAction2 = { type: actionTypes.UNDO_ADD_AGENCY, payload: { id: 1, name: 'Two', color: 'red' } }
    let futureAction1 = { type: actionTypes.UNDO_ADD_AGENCY, payload: { id: 0, name: 'One', color: 'blue' } }

    let pastState1 = {
        past: [pastAction1, pastAction2],
        present: {
            agencies: [agency1, agency2]
        },
        future: []
    }

    let presentState1 = {
        past: [pastAction1],
        present: {
            agencies: [agency1]
        },
        future: [futureAction2]
    }

    let futureState1 = {
        past: [],
        present: {
            agencies: []
        },
        future: [futureAction2, futureAction1]
    }

    it('should get the inverse past action', () => {
        expect(enhanceUndoRedoAction(presentState1, true)).toEqual({
            type: pastAction2.type,
            payload: pastAction2.payload,
            isEnhanced: true
        })

        expect(enhanceUndoRedoAction(pastState1, false)).toEqual({
            type: futureAction2.type,
            payload: futureAction2.payload,
            isEnhanced: true
        })
    })
})
