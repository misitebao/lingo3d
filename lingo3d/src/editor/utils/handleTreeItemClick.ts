import { Object3D } from "three"
import Appendable from "../../api/core/Appendable"
import { toggleRightClickPtr } from "../../api/mouse"
import { handleStopPropagation } from "../../engine/hotkeys"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { setSelectionNativeTarget } from "../../states/useSelectionNativeTarget"
import { setWorldPlay } from "../../states/useWorldPlay"

export default (
    e: MouseEvent,
    target?: Appendable | Object3D,
    rightClick?: boolean,
    nativeParent?: Appendable
) => {
    handleStopPropagation(e)
    setWorldPlay(false)
    rightClick && toggleRightClickPtr(e.clientX, e.clientY)
    if (target instanceof Object3D) {
        emitSelectionTarget(nativeParent, true)
        setSelectionNativeTarget(target)
    } else emitSelectionTarget(target, true)
}
