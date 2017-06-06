import React from "react";
import { rxConnect, ofActions } from "rx-connect";
import { connect } from "react-redux";
import Rx from "rx";

function fetchData(userId, completed) {
    return () => Rx.DOM.getJSON(`//jsonplaceholder.typicode.com/todos?userId=${userId}${completed ? "&completed=true" : ""}`).delay(500)
}

@connect(
    ({ userId }) => ({ userId }),
    { fetchData }
)
@rxConnect(props$ => {
    const actions = {
        onCompleted$: new Rx.Subject()
    }

    const userId$ = props$.pluck("userId").distinctUntilChanged();

    const completed$ = actions.onCompleted$.pluck(0).startWith(false);

    const todos$ = Rx.Observable
            .combineLatest(userId$, completed$)
            .withLatestFrom(props$)
            .flatMapLatest(([[ userId, completed ], { fetchData }]) =>
                fetchData(userId, completed)
                    .startWith(undefined)
            );

    return Rx.Observable.merge(
        Rx.Observable::ofActions(actions),

        todos$.map(todos => ({ todos }))
    );
})
export default class TodoList extends React.PureComponent {
    render() {
        const { todos, onCompleted } = this.props;
        return (
            <div>
                <label>
                    <input type="checkbox" onChange={ e => onCompleted(e.target.checked) } />
                    completed only
                </label>
                { todos ? (
                    <ul>
                        { todos.map(todo => <li key={todo.id}>{todo.title}</li>) }
                    </ul>
                ) : (
                    <p>Loading...</p>
                ) }
            </div>
        )
    }
}
