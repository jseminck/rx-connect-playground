import _ from "lodash";
import shallowEquals from "shallow-equals";

export default function pick(...props) {
    return this
        .map(it => _.pick(it, ...props))
        .distinctUntilChanged(it => it, shallowEquals)
}
