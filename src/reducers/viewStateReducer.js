const initialState = {
    focusType: null, // focus being highlight a single
    focusID: null,
    screen: null,
    searchString: null,
    userID: null,
    userType: null,
    viewMode: null,
    viewParams: null,
    window: null, // [[top right, bottom right, bottom left, bottom right]]
    zoom: null // a value between 2 and 18
}

export default function viewStateReducer(state = initialState, action) {
    switch (action.type) {
        default:
            return state
    }
}

export function getSearchEntitiesFromViewState(state) {
    let searchEntities = {}

    // TODO
}
