import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { rxConnect, ofActions } from "rx-connect";
import pick from "./../reddit/util/pick";
import Rx from "rx";

const FIRST_FIELD = "first";
const SECOND_FIELD = "second";

@rxConnect((props$) => {
    const actions = {
        onFocus$: new Rx.Subject(),
        selectItem$: new Rx.Subject()
    };

    return Rx.Observable.merge(
        actions.onFocus$
            .pluck(0)
            .map((focussedField) => ({focussedField}))
            .startWith({focussedField: FIRST_FIELD}),

        actions.selectItem$
            .pluck(0)
            .map((selectedItem) => (state) => {
                const newState = { ...state};

                newState.selectedItems = state.selectedItems.concat([selectedItem]);

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
        focussedField: PropTypes.string.isRequired,
        selectedItems: PropTypes.array,
        onFocus: PropTypes.func.isRequired,
    }

    static defaultProps = {
        selectedItems: []
    }

    render() {
        const { selectItem } = this.props;

        return (
            <div>
                <div style={{marginTop: 10}}>
                    <input 
                        style={{
                            outline: "none",
                            border: this.props.focussedField === FIRST_FIELD ? "1px solid black" : "none"
                        }}
                        type="text" 
                        autoFocus
                        onFocus={() => this.props.onFocus(FIRST_FIELD)}
                    />
                    <input 
                        style={{
                            outline: "none",
                            border: this.props.focussedField === SECOND_FIELD ? "1px solid black" : "none"
                        }}
                        type="text" 
                        onFocus={() => this.props.onFocus(SECOND_FIELD)}
                    />
                </div>

                <div style={{marginTop: 10}}>
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
