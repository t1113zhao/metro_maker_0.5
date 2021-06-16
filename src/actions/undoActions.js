import {
    GLOBAL_UNDO,
    GLOBAL_REDO
} from './actionTypes'

export function undo() {
    return {
        type: GLOBAL_UNDO
    }
}

export function redo() {
    return {
        type: GLOBAL_REDO
    }
}
