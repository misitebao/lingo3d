import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import Nullable from "./utils/Nullable"
import { nullableCallback } from "./utils/NullableCallback"
import { defaultMethod, defaultMethodPt3dArg } from "./utils/DefaultMethod"

export default interface IDirectioned {
    rotationX: number
    rotationY: number
    rotationZ: number
    rotation: number

    onLookToEnd: Nullable<() => void>

    lookAt: Function | Array<any>
    lookTo: Function | Array<any>
}

export const directionedSchema: Required<ExtractProps<IDirectioned>> = {
    rotationX: Number,
    rotationY: Number,
    rotationZ: Number,
    rotation: Number,

    onLookToEnd: Function,

    lookAt: [Function, Array],
    lookTo: [Function, Array]
}

export const directionedDefaults = extendDefaults<IDirectioned>(
    [],
    {
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        rotation: 0,

        onLookToEnd: nullableCallback(),

        lookAt: defaultMethod(defaultMethodPt3dArg),
        lookTo: defaultMethod(defaultMethodPt3dArg)
    },
    {
        rotationX: new Range(0, 360),
        rotationY: new Range(0, 360),
        rotationZ: new Range(0, 360),
        rotation: new Range(0, 360)
    }
)
