import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { rxConnect, ofActions } from "rx-connect";
import { fetchRedditOverview, fetchRedditData } from "./actions";
import pick from "./util/pick";
import Rx from "rx";

@connect((state) => ({
  isLoading: state.isLoading
}), {fetchRedditOverview, fetchRedditData})
@rxConnect((props$) => {
    const actions = {
        fetchRedditDetails$: new Rx.Subject()
    };

    return Rx.Observable.merge(
        Rx.Observable::ofActions(actions),

        actions.fetchRedditDetails$
            .pluck(0)
            .scan((expandedItem, nextItem) => nextItem === expandedItem ? undefined : nextItem, undefined)
            .withLatestFrom(props$::pick("fetchRedditData"))
            .flatMapLatest(([reddit, { fetchRedditData }]) => {

              return Rx.Observable
                  .of(reddit)
                  .filter(it => it)
                  .flatMap((reddit) => fetchRedditData(reddit))
                  .map(redditData => ({ expandedReddit: reddit.name, redditData: redditData.data }))
                  .startWith({
                      expandedReddit: reddit ? reddit.name : "",
                      redditData: undefined
                  })
            })
            .startWith({ expandedReddit: "", redditData: {} }),

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

        fetchRedditDetails: PropTypes.func.isRequired,

        expandedReddit: PropTypes.string.isRequired,
        redditData: PropTypes.object,
    }

    render() {
        console.log("this.props", this.props);
        if (this.props.isLoading) {
            return <div>Loading data...</div>
        }

        return (
            <div>
                Hello World

                <br /><br />

                {this.props.reddits.length === 0 && <span>No reddits available</span> }

                {this.props.reddits.map((reddit) => (
                    <div key={reddit.name}>
                        <div onClick={() => this.props.fetchRedditDetails(reddit)}>{reddit.name}</div>
                          {
                              reddit.name === this.props.expandedReddit && !this.props.redditData &&
                              <div>
                                  Loading data for {reddit.name}
                              </div>
                          }
                        {
                            reddit.name === this.props.expandedReddit && this.props.redditData &&
                            <div>
                                Children: {this.props.redditData.children.length}
                            </div>
                        }
                    </div>
                ))}
            </div>
        )
    }
}
