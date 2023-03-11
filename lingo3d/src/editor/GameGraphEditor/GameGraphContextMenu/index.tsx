import { GameObjectType } from "../../../api/serializer/types"
import ContextMenu from "../../component/ContextMenu"
import ContextMenuItem from "../../component/ContextMenu/ContextMenuItem"
import gameGraphMenuSignal from "./gameGraphMenuSignal"

const GameGraphContextMenu = () => {
    return (
        <ContextMenu
            positionSignal={gameGraphMenuSignal}
            input={
                gameGraphMenuSignal.value?.create && {
                    label: "Node name",
                    onInput: (value) => {
                        console.log(value)
                    },
                    options: [
                        "incrementNode",
                        "mathNode",
                        "projectionNode",
                        "spawnNode",
                        "mouse",
                        "keyboard",
                        "joystick"
                    ] satisfies Array<GameObjectType>
                }
            }
        >
            <ContextMenuItem
                onClick={() => {
                    gameGraphMenuSignal.value = {
                        x: gameGraphMenuSignal.value?.x ?? 0,
                        y: gameGraphMenuSignal.value?.y ?? 0,
                        create: true
                    }
                }}
            >
                Create node
            </ContextMenuItem>
        </ContextMenu>
    )
}

export default GameGraphContextMenu