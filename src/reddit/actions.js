import Rx from "rx";

export function fetchRedditOverview() {
    return (dispatch) => {
        dispatch(showLoading());
        return performRequest().finally(() => dispatch(hideLoading()));
    };
}

function performRequest() {
    try {
        const sleep = new Promise(resolve => setTimeout(resolve, 2000));
        const promise = sleep.then(() => fetch("http://localhost:3001/reddit.json").then((resp) => resp.json()));
        return Rx.Observable.fromPromise(promise);
    }
    catch (e) {
        // urlPattern might throw an error, return it
        return Rx.Observable.throw(e);
    }
}

function showLoading() {
    return {type: "SHOW_LOADING"};
}

function hideLoading() {
    return {type: "STOP_LOADING"};
}

export function fetchRedditData(reddit) {
    console.log("reddit", reddit);
    return () => {
        const promise = fetch(reddit.url).then((resp) => resp.json());
        return Rx.Observable.fromPromise(promise);
    }
}
