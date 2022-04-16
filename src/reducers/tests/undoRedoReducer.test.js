import * as actionTypes from '../../actions/actionTypes'
import configureMockStore from 'redux-mock-store'

import * as agencyActions from '../../actions/agencyActions'
import * as undoActions from '../../actions/undoActions'
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
        transfers: []
    },
    future: []
}

let initAction = { type: '@@INIT' }
let emptyAction = { type: 'EMPTY' }
let action1 = { type: actionTypes.ADD_AGENCY, payload: { name: 'One', color: 'blue' } }
let action2 = { type: actionTypes.ADD_AGENCY, payload: { name: 'Two', color: 'red' } }
let action3 = { type: actionTypes.EDIT_AGENCY, payload: { id: 1, name: 'TwoPlus', color: 'redPlus' } }

let agency1 = { id: 0, name: 'One', color: 'blue', deletedAt: null }
let agency2 = { id: 1, name: 'Two', color: 'red', deletedAt: null }
let agency3 = { id: 1, name: 'TwoPlus', color: 'redPlus', deletedAt: null }

let action3inv = { type: actionTypes.EDIT_AGENCY, payload: { id: 1, name: 'Two', color: 'red' } }
let action2inv = { type: actionTypes.UNDO_ADD_AGENCY, payload: { id: 1, name: 'Two', color: 'red' } }
let action1inv = { type: actionTypes.UNDO_ADD_AGENCY, payload: { id: 0, name: 'One', color: 'blue' } }

let s00 = {
    past: [action1inv],
    present: {
        agencies: [agency1],
        lines: [],
        services: [],
        serviceRoutes: [],
        stations: [],
        tracks: [],
        transfers: []
    },
    future: []
}
let s0 = {
    past: [action1inv, action2inv],
    present: {
        agencies: [agency1, agency2],
        lines: [],
        services: [],
        serviceRoutes: [],
        stations: [],
        tracks: [],
        transfers: []
    },
    future: []
}

let s0_U = {
    past: [action1inv],
    present: {
        agencies: [agency1],
        lines: [],
        services: [],
        serviceRoutes: [],
        stations: [],
        tracks: [],
        transfers: []
    },
    future: [action2]
}

let s0_UU = {
    past: [],
    present: {
        agencies: [],
        lines: [],
        services: [],
        serviceRoutes: [],
        stations: [],
        tracks: [],
        transfers: []
    },
    future: [action2, action1]
}

let s1 = {
    past: [action1inv, action2inv, action3inv],
    present: {
        agencies: [agency1, agency3],
        lines: [],
        services: [],
        serviceRoutes: [],
        stations: [],
        tracks: [],
        transfers: []
    },
    future: []
}

let s1_U = {
    past: [action1inv, action2inv],
    present: {
        agencies: [agency1, agency2],
        lines: [],
        services: [],
        serviceRoutes: [],
        stations: [],
        tracks: [],
        transfers: []
    },
    future: [action3]
}

let testAction = {
    type: 'test',
    payload: 'payload'
}

let invertedTestAction = {
    type: 'inverted test',
    payload: 'inverted payload'
}

let enhancedUndoTestAction = {
    type: testAction.type,
    payload: testAction.payload,
    enhanceType: actionTypes.ENHANCE_TYPE_UNDO,
    invertedAction: invertedTestAction
}

let enhancedRedoTestAction = {
    type: testAction.type,
    payload: testAction.payload,
    enhanceType: actionTypes.ENHANCE_TYPE_REDO,
    invertedAction: invertedTestAction
}

let enhancedNormalTestAction = {
    type: testAction.type,
    payload: testAction.payload,
    enhanceType: actionTypes.ENHANCE_TYPE_NORMAL,
    invertedAction: invertedTestAction
}

describe('past reducer', function () {
    it('should work with initial state', () => {
        expect(pastReducer(undefined, {})).toEqual([])
    })

    it('should work with an empty Action', () => {
        expect(pastReducer([], { type: actionTypes.EMPTY })).toEqual([])
    })

    it('should append to stack with redo and normal actions', () => {
        expect(pastReducer([], enhancedRedoTestAction)).toEqual([invertedTestAction])

        expect(pastReducer([], enhancedNormalTestAction)).toEqual([invertedTestAction])
    })

    it('should remove from stack when undo', () => {
        expect(pastReducer([testAction], enhancedUndoTestAction)).toEqual([])
    })
})

describe('future reducer', function () {
    it('should work with initial state', () => {
        expect(futureReducer(undefined, {})).toEqual([])
    })

    it('should work with an empty Action', () => {
        expect(futureReducer([], { type: actionTypes.EMPTY })).toEqual([])
    })

    it('should append to stack with undo action', () => {
        expect(futureReducer([], enhancedUndoTestAction)).toEqual([invertedTestAction])
    })

    it('should remove from stack when redo', () => {
        expect(futureReducer([testAction], enhancedRedoTestAction)).toEqual([])
    })

    it('should clear stack when redo', () => {
        expect(futureReducer([testAction, testAction], enhancedNormalTestAction)).toEqual([])
    })
})

describe('enhanceUndoRedoAction', function () {
    it('should return nothing with empty action', () => {
        expect(redoUndoActionEnhancer(defaultState, initAction)).toEqual(emptyAction)
    })

    it('should get the enhanced action for top of past stack', () => {
        expect(redoUndoActionEnhancer(s0, undoActions.undo())).toEqual({
            type: action2inv.type,
            payload: action2inv.payload,
            invertedAction: action2,
            enhanceType: actionTypes.ENHANCE_TYPE_UNDO
        })

        expect(redoUndoActionEnhancer(s0_U, undoActions.undo())).toEqual({
            type: action1inv.type,
            payload: action1inv.payload,
            invertedAction: action1,
            enhanceType: actionTypes.ENHANCE_TYPE_UNDO
        })

        expect(redoUndoActionEnhancer(s1, undoActions.undo())).toEqual({
            type: action3inv.type,
            payload: action3inv.payload,
            invertedAction: action3,
            enhanceType: actionTypes.ENHANCE_TYPE_UNDO
        })
    })

    it('should get the enhanced action for top of future stack', () => {
        expect(redoUndoActionEnhancer(s1_U, undoActions.redo())).toEqual({
            type: action3.type,
            payload: action3.payload,
            invertedAction: action3inv,
            enhanceType: actionTypes.ENHANCE_TYPE_REDO
        })

        expect(redoUndoActionEnhancer(s0_UU, undoActions.redo())).toEqual({
            type: action1.type,
            payload: action1.payload,
            invertedAction: action1inv,
            enhanceType: actionTypes.ENHANCE_TYPE_REDO
        })

        expect(redoUndoActionEnhancer(s0_U, undoActions.redo())).toEqual({
            type: action2.type,
            payload: action2.payload,
            invertedAction: action2inv,
            enhanceType: actionTypes.ENHANCE_TYPE_REDO
        })
    })
})

describe('undo-redo reducer', function () {
    it('should work with initial state', () => {
        expect(undoRedoReducer(undefined, {})).toEqual(defaultState)
    })

    it('should correctly perform a normal action', () => {
        expect(undoRedoReducer(defaultState, initAction)).toEqual(defaultState)

        expect(undoRedoReducer(defaultState, action1)).toEqual(s00)

        expect(undoRedoReducer(s00, action2)).toEqual(s0)
    })

    it('should correctly perform an undo', () => {
        expect(undoRedoReducer(s0, undoActions.undo())).toEqual(s0_U)

        expect(undoRedoReducer(s0_U, undoActions.undo())).toEqual(s0_UU)
    })

    it('should correctly perform a redo', () => {
        expect(undoRedoReducer(s0_UU, undoActions.redo())).toEqual(s0_U)

        expect(undoRedoReducer(s0_U, undoActions.redo())).toEqual(s0)
    })
})
