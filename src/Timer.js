import React from "react";
import { rxConnect } from "rx-connect";
import Rx from "rx";

@rxConnect(
    Rx.Observable.timer(0, 1000).timestamp()
)
export default class Timer extends React.PureComponent {
    render() {
        return <div>{ this.props.value }</div>
    }
}
