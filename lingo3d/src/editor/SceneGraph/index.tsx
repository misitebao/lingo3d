import { h } from "preact"
import { useLayoutEffect, useMemo, useState } from "preact/hooks"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import { onSceneChange } from "../../events/onSceneChange"
import { appendableRoot } from "../../api/core/Appendable"
import TreeItem from "./TreeItem"
import Model from "../../display/Model"
import ModelTreeItem from "./ModelTreeItem"
import { multipleSelectionGroupManagers } from "../../states/useMultipleSelectionTargets"
import GroupIcon from "./icons/GroupIcon"
import DeleteIcon from "./icons/DeleteIcon"
import TitleBarButton from "./TitleBarButton"
import { useCamera, useMultipleSelectionTargets, useSelectionTarget } from "../states"
import deleteSelected from "../Editor/deleteSelected"
import { emitEditorGroupItems } from "../../events/onEditorGroupItems"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import EmptyItem from "./EmptyItem"
import mainCamera from "../../engine/mainCamera"

preventTreeShake(h)

const SceneGraph = () => {
    const [r, render] = useState({})

    useLayoutEffect(() => {
        const handle = onSceneChange(() => render({}))
        return () => {
            handle.cancel()
        }
    }, [])

    const appendables = useMemo(() => [...appendableRoot].filter(item => !multipleSelectionGroupManagers.has(item)), [r])

    const [multipleSelectionTargets] = useMultipleSelectionTargets()
    const [selectionTarget] = useSelectionTarget()
    const [camera] = useCamera()
    const enabled = camera === mainCamera

    return (
        <div
         className="lingo3d-ui"
         onClick={() => emitSelectionTarget(undefined)}
         style={{
             width: 200,
             height: "100%",
             background: "rgb(40, 41, 46)",
             padding: 4,
             paddingTop: 0,
             display: "flex",
             flexDirection: "column",
             overflow: "hidden",
             pointerEvents: enabled ? "auto" : "none"
         }}
        >
            <div style={{
                height: 24,
                borderBottom: "1px solid rgb(255,255,255,0.1)",
                opacity: enabled ? 0.5 : 0.25,
                display: "flex",
                alignItems: "center",
                paddingLeft: 30,
            }}>
                <div>scenegraph</div>
                <div style={{ flexGrow: 1 }} />
                <TitleBarButton active={!!multipleSelectionTargets.length} onClick={emitEditorGroupItems}>
                    <GroupIcon />
                </TitleBarButton>
                <TitleBarButton active={!!selectionTarget} onClick={deleteSelected}>
                    <DeleteIcon />
                </TitleBarButton>
            </div>
            <div style={{ overflow: "scroll", opacity: enabled ? 1 : 0.5 }} className="lingo3d-ui">
                {appendables.map(appendable => (
                    appendable instanceof Model ? (
                        <ModelTreeItem appendable={appendable} level={0} />
                    ) : (
                        <TreeItem key={appendable.uuid} appendable={appendable} level={0} />
                    )
                ))}
                <EmptyItem />
            </div>
        </div>
    )
}

register(SceneGraph, "lingo3d-scenegraph")