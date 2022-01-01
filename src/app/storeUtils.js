import store from '../app/store'

export default function getPresentState() {
    if (store.getState().present != null) {
        return store.getState().present
    } else {
        return store.getState
    }
}
