import { WATERNORMALS_URL } from "../globals"
import IVisibleObjectManager, {
    visibleObjectManagerDefaults,
    visibleObjectManagerSchema
} from "./IVisibleObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface IWater extends IVisibleObjectManager {
    shape: "plane" | "sphere"
    normalMap: string
    resolution: number
    speed: number
}

export const waterSchema: Required<ExtractProps<IWater>> = {
    ...visibleObjectManagerSchema,
    shape: String,
    normalMap: String,
    resolution: Number,
    speed: Number
}

export const waterDefaults = extendDefaults<IWater>([
    visibleObjectManagerDefaults,
    {
        shape: "plane",
        normalMap: WATERNORMALS_URL,
        resolution: 512,
        speed: 1,
        rotationX: -90
    }
])
