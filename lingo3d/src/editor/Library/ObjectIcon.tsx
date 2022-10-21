import { upperFirst } from "@lincode/utils"
import createObject from "../../api/serializer/createObject"
import { GameObjectType } from "../../api/serializer/types"
import Spinner from "../component/Spinner"
import drag, { dragImage } from "../utils/drag"

const setDraggingItem = drag<GameObjectType>(createObject)

type ObjectIconProps = {
    name: string
    iconName?: string
}

const ObjectIcon = ({ name, iconName = name }: ObjectIconProps) => {
    return (
        <div
            draggable
            onDragStart={(e) => {
                setDraggingItem(name as GameObjectType)
                e.dataTransfer!.setDragImage(dragImage, 0, 0)
            }}
            onDragEnd={() => setDraggingItem(undefined)}
            style={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 20,
                paddingBottom: 20
            }}
        >
            <div
                style={{
                    width: 50,
                    height: 50,
                    backgroundImage: `url(https://unpkg.com/lingo3d-editor@1.0.3/assets/${iconName}.png)`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            />
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
            <Spinner />
        </div>
    )
}

export default ObjectIcon
