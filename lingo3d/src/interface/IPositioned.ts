import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Nullable from "./utils/Nullable"
import {
    TransformControlsMode,
    TransformControlsPhase
} from "../events/onTransformControls"
import DefaultMethod from "./utils/DefaultMethod"
import { Point3d } from "@lincode/math"
import { nullableCallback } from "./utils/NullableCallback"
import { hideSchema } from "./utils/nonEditorSchemaSet"

export default interface IPositioned {
    x: number
    y: number
    z: number

    onTransformControls: Nullable<
        (phase: TransformControlsPhase, mode: TransformControlsMode) => void
    >
    onMove: Nullable<() => void>
    onMoveToEnd: Nullable<() => void>

    moveTo: Function | Array<any>
    lerpTo: Function | Array<any>
    placeAt: Function | Array<any>

    translateX: Function | Array<any>
    translateY: Function | Array<any>
    translateZ: Function | Array<any>
}

export const positionedSchema: Required<ExtractProps<IPositioned>> = {
    x: Number,
    y: Number,
    z: Number,

    onTransformControls: Function,
    onMove: Function,
    onMoveToEnd: Function,

    moveTo: [Function, Array],
    lerpTo: [Function, Array],
    placeAt: [Function, Array],

    translateX: [Function, Array],
    translateY: [Function, Array],
    translateZ: [Function, Array]
}
hideSchema(["onTransformControls"])

export const positionedDefaults = extendDefaults<IPositioned>([], {
    x: 0,
    y: 0,
    z: 0,

    onTransformControls: undefined,
    onMove: nullableCallback(undefined),
    onMoveToEnd: nullableCallback(undefined),

    moveTo: new DefaultMethod([String, Point3d]),
    lerpTo: new DefaultMethod([String, Point3d]),
    placeAt: new DefaultMethod([String, Point3d]),

    translateX: new DefaultMethod(Number),
    translateY: new DefaultMethod(Number),
    translateZ: new DefaultMethod(Number)
})
