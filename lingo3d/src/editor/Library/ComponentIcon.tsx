import { upperFirst } from "@lincode/utils"
import createObject from "../../api/serializer/createObject"
import { GameObjectType } from "../../api/serializer/types"
import GameGraph from "../../visualScripting/GameGraph"
import { setGameGraph } from "../../states/useGameGraph"
import drag, { setDragImage } from "../utils/drag"
import ComponentIconImage from "./ComponentIconImage"

const setDraggingItem = drag<GameObjectType>((val) => {
    const result = createObject(val)
    if (result instanceof GameGraph) setGameGraph(result)
    return result
})

type Props = {
    name: GameObjectType
    iconName?: string
    onDragStart?: (name: GameObjectType) => void
    onDragEnd?: () => void
}

const ComponentIcon = ({
    name,
    iconName = name,
    onDragStart,
    onDragEnd
}: Props) => {
    return (
        <div
            draggable
            onDragStart={(e) => {
                setDraggingItem(name)
                setDragImage(e)
                onDragStart?.(name)
            }}
            onDragEnd={() => {
                setDraggingItem(undefined)
                onDragEnd?.()
            }}
            className="lingo3d-flexcenter lingo3d-flexcol"
            style={{ width: "50%", paddingTop: 20, paddingBottom: 20 }}
        >
            <ComponentIconImage iconName={iconName} />
            <div
                style={{
                    marginTop: 6,
                    opacity: 0.75,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%"
                }}
            >
                {upperFirst(name)}
            </div>
        </div>
    )
}

export default ComponentIcon
