const init = {
    isLoading: false
}

export default function reducer(state = init, action) {
    switch (action.type) {
        case "SHOW_LOADING": {
            return {...state, isLoading: true}
        }
        case "STOP_LOADING": {
            return {...state, isLoading: false}
        }
    }
    return state;
}
