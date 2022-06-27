import { Object3D, Vector3 } from "three"
import { onAfterRender } from "../../events/onAfterRender"

const cache = new WeakMap<Object3D, Vector3>()

export default (object3d: Object3D, clearCache?: boolean) => {
    if (cache.has(object3d) && !clearCache)
        return cache.get(object3d)!

    const result = object3d.getWorldPosition(new Vector3())

    cache.set(object3d, result)
    onAfterRender(() => cache.delete(object3d), true)

    return result
}