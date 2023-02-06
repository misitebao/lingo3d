import { Point3d } from "@lincode/math"
import { Matrix3, Object3D, PropertyBinding, Quaternion } from "three"
import {
    frustum,
    matrix4,
    ray,
    vector3,
    vector3_1
} from "../../utils/reusables"
import { throttle, forceGetInstance } from "@lincode/utils"
import { OBB } from "three/examples/jsm/math/OBB"
import worldToCanvas from "../../utils/worldToCanvas"
import { Cancellable } from "@lincode/promiselikes"
import { point2Vec, vec2Point } from "../../utils/vec2Point"
import { LingoMouseEvent } from "../../../interface/IMouse"
import getCenter from "../../utils/getCenter"
import IStaticObjectManager from "../../../interface/IStaticObjectManager"
import { getCameraRendered } from "../../../states/useCameraRendered"
import getWorldPosition from "../../utils/getWorldPosition"
import getWorldDirection from "../../utils/getWorldDirection"
import {
    clickSet,
    mouseDownSet,
    mouseUpSet,
    mouseOverSet,
    mouseOutSet,
    mouseMoveSet
} from "./raycast/sets"
import "./raycast"
import fpsAlpha from "../../utils/fpsAlpha"
import { emitName } from "../../../events/onName"
import { CM2M, M2CM } from "../../../globals"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { uuidMap } from "../../../api/core/collections"
import renderSystem from "../../../utils/renderSystem"
import renderSystemWithData from "../../../utils/renderSystemWithData"
import Nullable from "../../../interface/utils/Nullable"

const thisOBB = new OBB()
const targetOBB = new OBB()

const updateFrustum = throttle(
    () => {
        const camera = getCameraRendered()
        frustum.setFromProjectionMatrix(
            matrix4.multiplyMatrices(
                camera.projectionMatrix,
                camera.matrixWorldInverse
            )
        )
    },
    200,
    "leading"
)

const userIdMap = new Map<string, Set<StaticObjectManager>>()

export const getMeshAppendablesById = (
    id: string
): Array<MeshAppendable> | Set<MeshAppendable> => {
    const uuidInstance = uuidMap.get(id)
    if (uuidInstance && "object3d" in uuidInstance) return [uuidInstance]
    return userIdMap.get(id) ?? []
}

const isStringArray = (array: Array<unknown>): array is Array<string> =>
    typeof array[0] === "string"

export const getMeshAppendables = (
    val: string | Array<string> | MeshAppendable | Array<MeshAppendable>
): Array<MeshAppendable> | Set<MeshAppendable> => {
    if (typeof val === "string") return getMeshAppendablesById(val)
    if (Array.isArray(val)) {
        const result: Array<MeshAppendable> = []
        if (isStringArray(val))
            for (const id of val)
                for (const meshAppendable of getMeshAppendablesById(id))
                    result.push(meshAppendable)
        else for (const meshAppendable of val) result.push(meshAppendable)
        return result
    }
    return [val]
}

const hitCache = new WeakMap<
    StaticObjectManager,
    WeakSet<StaticObjectManager>
>()
const [addHitTestSystem, deleteHitTestSystem] = renderSystem(
    (manager: StaticObjectManager) => {
        for (const target of getMeshAppendables(manager.hitTarget!)) {
            const cache = forceGetInstance(hitCache, manager, WeakSet)
            if (manager.hitTest(target)) {
                if (!cache.has(target)) {
                    cache.add(target)
                    manager.onHitStart?.(target)
                }
                manager.onHit?.(target)
                continue
            }
            if (!cache.has(target)) continue
            cache.delete(target)
            manager.onHitEnd?.(target)
        }
    }
)

const [addLookSystem, deleteLookSystem] = renderSystemWithData(
    (
        self: StaticObjectManager,
        data: { quaternion: Quaternion; quaternionNew: Quaternion; a1?: number }
    ) => {
        const { quaternion, quaternionNew, a1 } = data
        quaternion.slerp(quaternionNew, fpsAlpha(a1 ?? 0.05))

        const x = Math.abs(quaternion.x - quaternionNew.x)
        const y = Math.abs(quaternion.y - quaternionNew.y)
        const z = Math.abs(quaternion.z - quaternionNew.z)
        const w = Math.abs(quaternion.w - quaternionNew.w)
        if (x + y + z + w < 0.001) {
            self.cancelHandle("lookTo", undefined)
            self.onLookToEnd?.()

            quaternion.copy(quaternionNew)
        }
    }
)

export default class StaticObjectManager<T extends Object3D = Object3D>
    extends MeshAppendable<T>
    implements IStaticObjectManager
{
    protected override _dispose() {
        super._dispose()
        this._id && userIdMap.get(this._id)!.delete(this)
        deleteHitTestSystem(this)
    }

    protected _id?: string
    public get id() {
        return this._id
    }
    public set id(val) {
        this._id && userIdMap.get(this._id)!.delete(this)
        this._id = val
        val && forceGetInstance(userIdMap, val, Set).add(this)
    }

    public addToRaycastSet(set: Set<Object3D>) {
        set.add(this.object3d)
        return new Cancellable(() => set.delete(this.object3d))
    }

    private _onClick?: (e: LingoMouseEvent) => void
    public get onClick() {
        return this._onClick
    }
    public set onClick(cb) {
        this._onClick = cb
        this.cancelHandle(
            "onClick",
            cb && (() => this.addToRaycastSet(clickSet))
        )
    }

    private _onMouseDown?: (e: LingoMouseEvent) => void
    public get onMouseDown() {
        return this._onMouseDown
    }
    public set onMouseDown(cb) {
        this._onMouseDown = cb
        this.cancelHandle(
            "onMouseDown",
            cb && (() => this.addToRaycastSet(mouseDownSet))
        )
    }

    private _onMouseUp?: (e: LingoMouseEvent) => void
    public get onMouseUp() {
        return this._onMouseUp
    }
    public set onMouseUp(cb) {
        this._onMouseUp = cb
        this.cancelHandle(
            "onMouseUp",
            cb && (() => this.addToRaycastSet(mouseUpSet))
        )
    }

    private _onMouseOver?: (e: LingoMouseEvent) => void
    public get onMouseOver() {
        return this._onMouseOver
    }
    public set onMouseOver(cb) {
        this._onMouseOver = cb
        this.cancelHandle(
            "onMouseOver",
            cb && (() => this.addToRaycastSet(mouseOverSet))
        )
    }

    private _onMouseOut?: (e: LingoMouseEvent) => void
    public get onMouseOut() {
        return this._onMouseOut
    }
    public set onMouseOut(cb) {
        this._onMouseOut = cb
        this.cancelHandle(
            "onMouseOut",
            cb && (() => this.addToRaycastSet(mouseOutSet))
        )
    }

    private _onMouseMove?: (e: LingoMouseEvent) => void
    public get onMouseMove() {
        return this._onMouseMove
    }
    public set onMouseMove(cb) {
        this._onMouseMove = cb
        this.cancelHandle(
            "onMouseMove",
            cb && (() => this.addToRaycastSet(mouseMoveSet))
        )
    }

    public get name() {
        return this.outerObject3d.name
    }
    public set name(val) {
        this.outerObject3d.name = PropertyBinding.sanitizeNodeName(val)
        emitName(this)
    }

    protected getRay() {
        return ray.set(
            getWorldPosition(this.object3d),
            getWorldDirection(this.object3d)
        )
    }

    public pointAt(distance: number) {
        return vec2Point(this.getRay().at(distance * CM2M, vector3))
    }

    public hitTest(target: MeshAppendable) {
        if (this.done) return false
        if (target.done) return false
        if (this === target) return false

        thisOBB.set(
            getWorldPosition(this.object3d),
            vector3_1.clone(),
            new Matrix3()
        )
        thisOBB.applyMatrix4(this.object3d.matrixWorld)
        targetOBB.set(
            getWorldPosition(target.object3d),
            vector3_1.clone(),
            new Matrix3()
        )
        targetOBB.applyMatrix4(target.object3d.matrixWorld)
        return thisOBB.intersectsOBB(targetOBB)
    }

    private _hitTarget?:
        | string
        | Array<string>
        | MeshAppendable
        | Array<MeshAppendable>
    public get hitTarget() {
        return this._hitTarget
    }
    public set hitTarget(val) {
        this._hitTarget = val
        this.cancelHandle(
            "hitTarget",
            val &&
                (() => {
                    addHitTestSystem(this)
                    return new Cancellable(() => {
                        deleteHitTestSystem(this)
                    })
                })
        )
    }

    public onHit: Nullable<(instance: MeshAppendable) => void>
    public onHitStart: Nullable<(instance: MeshAppendable) => void>
    public onHitEnd: Nullable<(instance: MeshAppendable) => void>

    public get canvasX() {
        return worldToCanvas(this.object3d).x
    }

    public get canvasY() {
        return worldToCanvas(this.object3d).y
    }

    public get frustumVisible() {
        updateFrustum()
        return frustum.containsPoint(getCenter(this.object3d))
    }

    public lookAt(target: MeshAppendable | Point3d): void
    public lookAt(x: number, y: number | undefined, z: number): void
    public lookAt(
        a0: MeshAppendable | Point3d | number,
        a1?: number,
        a2?: number
    ) {
        if (typeof a0 === "number") {
            this.lookAt(
                new Point3d(
                    a0,
                    a1 === undefined ? this.position.y * M2CM : a1,
                    a2!
                )
            )
            return
        }
        if ("outerObject3d" in a0)
            this.outerObject3d.lookAt(getWorldPosition(a0.object3d))
        else this.outerObject3d.lookAt(point2Vec(a0))
    }

    public onLookToEnd: (() => void) | undefined

    public lookTo(target: MeshAppendable | Point3d, alpha?: number): void
    public lookTo(
        x: number,
        y: number | undefined,
        z: number,
        alpha?: number
    ): void
    public lookTo(
        a0: MeshAppendable | Point3d | number,
        a1: number | undefined,
        a2?: number,
        a3?: number
    ) {
        if (typeof a0 === "number") {
            this.lookTo(
                new Point3d(
                    a0,
                    a1 === undefined ? this.position.y * M2CM : a1,
                    a2!
                ),
                a3
            )
            return
        }
        const { quaternion } = this.outerObject3d
        const quaternionOld = quaternion.clone()
        this.lookAt(a0)
        const quaternionNew = quaternion.clone()

        quaternion.copy(quaternionOld)

        this.cancelHandle("lookTo", () => {
            addLookSystem(this, { quaternion, quaternionNew, a1 })
            return new Cancellable(() => deleteLookSystem(this))
        })
    }

    public getWorldPosition(): Point3d {
        return vec2Point(getWorldPosition(this.object3d))
    }

    public getWorldDirection(): Point3d {
        return getWorldDirection(this.object3d)
    }
}
