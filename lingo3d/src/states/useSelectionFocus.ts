import store from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import MeshItem from "../display/core/MeshItem"

export const [setSelectionFocus, getSelectionFocus] = store<
    WeakSet<MeshItem> | undefined
>(undefined)

export const getChildManagers = (target: Appendable): WeakSet<Appendable> => {
    const set = new WeakSet<Appendable>()
    set.add(target)
    target.traverse((child) => set.add(child))
    return set
}