import { SHADOW_BIAS } from "../globals"
import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"

export default interface ILightBase extends IObjectManager {
    color: string
    intensity: number
    shadowResolution: Nullable<number>
    shadowBias: Nullable<number>
    helper: boolean
}

export const lightBaseSchema: Required<ExtractProps<ILightBase>> = {
    ...objectManagerSchema,
    color: String,
    intensity: Number,
    shadowResolution: Number,
    shadowBias: Number,
    helper: Boolean
}

export const lightBaseDefaults: Defaults<ILightBase> = {
    ...objectManagerDefaults,
    color: "#ffffff",
    intensity: 1,
    shadowResolution: new NullableDefault(256),
    shadowBias: new NullableDefault(SHADOW_BIAS),
    helper: true
}
