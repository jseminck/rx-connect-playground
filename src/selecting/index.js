import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { rxConnect, ofActions } from "rx-connect";
import pick from "./../reddit/util/pick";
import Rx from "rx";

@rxConnect((props$) => {
    const actions = {
        selectItem$: new Rx.Subject()
    };

    return Rx.Observable.merge(
        actions.selectItem$
            .pluck(0)
            .map((selectedItem) => (state) => {
                const newState = { ...state};

                newState.selectedItems =state.selectedItems.concat([selectedItem]);

                if (newState.selectedItems.length === 4) {
                    newState.finished = true;
                    newState.selectedItems = [];
                }

                return newState;
            })
            .startWith({ selectedItems: [], finished: false }),

            Rx.Observable::ofActions(actions),
    )
})
export default class Selecting extends PureComponent {
    static propTypes = {
        selectedItems: PropTypes.array,
    }

    static defaultProps = {
        selectedItems: []
    }

    render() {
        const { selectItem } = this.props;

        return (
            <div>
                <div>
                    {this.props.selectedItems.length === 0 && <span>No items selected</span>}
                    {this.props.selectedItems.map((item, i) => (<span key={i}>{item}</span>))}
                </div>

                <div>
                    <button onClick={() => selectItem("1")}>1</button>
                    <button onClick={() => selectItem("2")}>2</button>
                    <button onClick={() => selectItem("3")}>3</button>
                    <button onClick={() => selectItem("4")}>4</button>
                    <button onClick={() => selectItem("5")}>5</button>
                    <button onClick={() => selectItem("6")}>6</button>
                    <button onClick={() => selectItem("7")}>7</button>
                    <button onClick={() => selectItem("8")}>8</button>
                    <button onClick={() => selectItem("9")}>9</button>
                    <button onClick={() => selectItem("10")}>10</button>
                </div>

                <hr />

                {this.props.finished && <span>4 items have been selected! woohoo</span>}
            </div>
        );
    }
}
