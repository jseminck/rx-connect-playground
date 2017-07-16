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
        onSelect$: new Rx.Subject()
    };

    const inputFocussed$ = actions.onFocus$
        .pluck(0)
        .shareReplay(1);

    const selectItem$ = actions.onSelect$
            .pluck(0)
            .scan((
                result,
                selectedItem
            ) => {
                const newState = { ...result};

                newState.selectedItems = result.selectedItems.concat([selectedItem]);

                if (newState.selectedItems.length === 4) {
                    newState.finished = true;
                }

                return newState
            }, ({ selectedItems: [], finished: false }))
            .startWith({ selectedItems: [], finished: false })
            .shareReplay(1);

    const focusInput$ = inputFocussed$
        .merge(
            selectItem$
                .filter(({selectedItems}) => selectedItems.length >= 2)
                .map(() => SECOND_FIELD)
        )
        .merge(
            selectItem$
                .filter(({selectedItems}) => selectedItems.length === 4)
                .map(() => undefined)
        )
        .startWith(FIRST_FIELD)
        .distinctUntilChanged()
        .map((focussedField) => ({focussedField}))
        .shareReplay(1);

    return Rx.Observable.merge(
         Rx.Observable::ofActions(actions),
         selectItem$,
         focusInput$
    )
})
export default class Selecting extends PureComponent {
    static propTypes = {
        focussedField: PropTypes.string.isRequired,
        selectedItems: PropTypes.array,

        onFocus: PropTypes.func.isRequired,
        onSelect: PropTypes.func.isRequired,
    }

    static defaultProps = {
        selectedItems: []
    }

    render() {
        const { selectedItems, focussedField } = this.props;
        const { onSelect } = this.props;

        console.log("focussedField", focussedField)

        const getValueAtPos = (pos) => selectedItems[pos] ? selectedItems[pos] : ""

        return (
            <div>
                <div style={{marginTop: 10}}>
                    <input 
                        style={{
                            outline: "none",
                            border: focussedField === FIRST_FIELD ? "1px solid black" : "none"
                        }}
                        type="text" 
                        autoFocus
                        onFocus={() => this.props.onFocus(FIRST_FIELD)}
                        value={getValueAtPos(0) + getValueAtPos(1)}
                    />
                    <input 
                        style={{
                            outline: "none",
                            border: focussedField === SECOND_FIELD ? "1px solid black" : "none"
                        }}
                        type="text" 
                        onFocus={() => this.props.onFocus(SECOND_FIELD)}
                        value={getValueAtPos(2) + getValueAtPos(3)}
                    />
                </div>

                <div style={{marginTop: 10}}>
                    <button onClick={() => onSelect("1")}>1</button>
                    <button onClick={() => onSelect("2")}>2</button>
                    <button onClick={() => onSelect("3")}>3</button>
                    <button onClick={() => onSelect("4")}>4</button>
                    <button onClick={() => onSelect("5")}>5</button>
                    <button onClick={() => onSelect("6")}>6</button>
                    <button onClick={() => onSelect("7")}>7</button>
                    <button onClick={() => onSelect("8")}>8</button>
                    <button onClick={() => onSelect("9")}>9</button>
                    <button onClick={() => onSelect("10")}>10</button>
                </div>

                <hr />

                {this.props.finished && <span>4 items have been selected! woohoo</span>}
            </div>
        );
    }
}
