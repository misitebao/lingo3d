import { MIN_POLAR_ANGLE, MAX_POLAR_ANGLE, NEAR, FAR } from "../globals"
import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import Choices from "./utils/Choices"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { nullableDefault } from "./utils/NullableDefault"
import Range from "./utils/Range"

export type MouseControl = boolean | "drag"

export default interface ICameraBase extends IObjectManager {
    mouseControl: MouseControl

    fov: number
    zoom: number
    near: number
    far: number
    active: boolean
    transition: Nullable<boolean | number>

    minPolarAngle: number
    maxPolarAngle: number

    minAzimuthAngle: number
    maxAzimuthAngle: number

    polarAngle: Nullable<number>
    azimuthAngle: Nullable<number>

    enableDamping: boolean
}

export const cameraBaseSchema: Required<ExtractProps<ICameraBase>> = {
    ...objectManagerSchema,

    mouseControl: [Boolean, String],

    fov: Number,
    zoom: Number,
    near: Number,
    far: Number,
    active: Boolean,
    transition: [Boolean, Number],

    minPolarAngle: Number,
    maxPolarAngle: Number,

    minAzimuthAngle: Number,
    maxAzimuthAngle: Number,

    polarAngle: Number,
    azimuthAngle: Number,

    enableDamping: Boolean
}

export const cameraBaseDefaults = extendDefaults<ICameraBase>(
    [objectManagerDefaults],
    {
        mouseControl: false,

        fov: 75,
        zoom: 1,
        near: NEAR,
        far: FAR,
        active: false,
        transition: nullableDefault(false),

        minPolarAngle: MIN_POLAR_ANGLE,
        maxPolarAngle: MAX_POLAR_ANGLE,

        minAzimuthAngle: -Infinity,
        maxAzimuthAngle: Infinity,

        polarAngle: nullableDefault(0),
        azimuthAngle: nullableDefault(0),

        enableDamping: false
    },
    {
        mouseControl: new Choices({ true: true, false: false, drag: "drag" }),
        fov: new Range(30, 120, 5),
        zoom: new Range(0.1, 10),
        near: new Range(0.1, 10000),
        far: new Range(0.1, 10000),
        minPolarAngle: new Range(0, 180, 1),
        maxPolarAngle: new Range(0, 180, 1),
        polarAngle: new Range(0, 180),
        azimuthAngle: new Range(0, 360)
    }
)
