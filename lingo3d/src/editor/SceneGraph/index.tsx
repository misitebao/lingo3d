import register from "preact-custom-element"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import SceneGraphContextMenu from "./SceneGraphContextMenu"
import "./retargetBones"
import useInitCSS from "../utils/useInitCSS"
import useClickable from "../utils/useClickable"
import PanelSceneGraph from "./PanelSceneGraph"
import PanelAnimations from "./PanelAnimations"

const SceneGraph = () => {
    useInitCSS(true)
    const elRef = useClickable()

    return (
        <div
            ref={elRef}
            className="lingo3d-ui lingo3d-bg lingo3d-scenegraph"
            onClick={() => emitSelectionTarget()}
            onContextMenu={(el) => {
                el.preventDefault()
                emitSelectionTarget(undefined, true)
            }}
            style={{
                width: 200,
                height: "100%",
                display: "grid",
                gridTemplateRows: "1fr 50px"
            }}
        >
            <PanelSceneGraph />
            <PanelAnimations />
            <SceneGraphContextMenu />
        </div>
    )
}
export default SceneGraph

register(SceneGraph, "lingo3d-scenegraph")
