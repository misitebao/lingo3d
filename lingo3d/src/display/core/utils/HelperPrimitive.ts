import { BufferGeometry } from "three"
import { hiddenAppendables } from "../../../api/core/collections"
import MeshAppendable from "../../../api/core/MeshAppendable"
import {
    positionedDefaults,
    positionedSchema
} from "../../../interface/IPositioned"
import Primitive from "../Primitive"

//@ts-ignore
export default abstract class HelperPrimitive extends Primitive {
    public static componentName = "helper"
    public static override defaults = positionedDefaults
    public static override schema = positionedSchema

    public target?: MeshAppendable

    public constructor(geometry: BufferGeometry) {
        super(geometry)
        hiddenAppendables.add(this)
        this.opacity = 0.5
        this.castShadow = false
        this.receiveShadow = false
    }

    public override get onTranslateControl() {
        return this.outerObject3d.userData.onTranslateControl
    }
    public override set onTranslateControl(cb: () => void) {
        this.outerObject3d.userData.onTranslateControl = cb
        if (this.target)
            this.target.outerObject3d.userData.onTranslateControl = cb
    }
}
