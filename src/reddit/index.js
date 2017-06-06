import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { rxConnect, ofActions } from "rx-connect";
import { fetchRedditOverview } from "./actions";
import pick from "./util/pick";
import Rx from "rx";

@connect((state) => ({
  isLoading: state.isLoading
}), {fetchRedditOverview})
@rxConnect((props$) => {
    const actions = {

    };

    return Rx.Observable.merge(
        Rx.Observable::ofActions(actions),

        props$::pick("isLoading"),

        Rx.Observable
            .combineLatest(props$::pick("fetchRedditOverview"))
            .flatMapLatest(([{fetchRedditOverview}]) => {
                return fetchRedditOverview()
                    .map((reddits) => ({
                        reddits
                    }))
            })
            .startWith({ reddits: [] })
    )
})
export default class Reddit extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool,
        reddits: PropTypes.array.isRequired,
    }

    render() {
        console.log("this.props", this.props);
        if (this.props.isLoading) {
            return <div>Loading data...</div>
        }

        return (
            <div>
                Hello World, the current filter is {this.props.filter}

                <br /><br />

                {this.props.reddits.length === 0 && <span>No reddits available</span> }
                {this.props.reddits.length > 0 && <span>{this.props.reddits.length} reddits available</span> }
            </div>
        )
    }
}
