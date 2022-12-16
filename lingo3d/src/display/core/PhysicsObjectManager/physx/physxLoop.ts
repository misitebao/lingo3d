import { createEffect } from "@lincode/reactivity"
import { onBeforeRender } from "../../../../events/onBeforeRender"
import { getPhysX } from "../../../../states/usePhysX"
import "../../../../engine/eventLoop"
import { managerActorMap, managerControllerMap } from "./pxMaps"
import { getPhysXCookingCount } from "../../../../states/usePhysXCookingCount"
import { getEditorPlay } from "../../../../states/useEditorPlay"
import { getFirstLoad } from "../../../../states/useFirstLoad"
import { dtPtr } from "../../../../engine/eventLoop"
import { setPxVec } from "./updatePxVec"

createEffect(() => {
    const { scene, getPxControllerFilters } = getPhysX()
    if (!scene || getPhysXCookingCount() || !getEditorPlay() || !getFirstLoad())
        return

    const handle = onBeforeRender(() => {
        scene.simulate(dtPtr[0])
        scene.fetchResults(true)

        if (managerControllerMap.size) {
            const filters = getPxControllerFilters()

            for (const [manager, controller] of managerControllerMap) {
                const actor = controller.getActor()
                const vy = actor.getLinearVelocity().get_y()
                // (vy - 9.81 * dtPtr[0]) * dtPtr[0]
                controller.move(
                    setPxVec(0, (vy - 1) * dtPtr[0], 0),
                    0.001,
                    dtPtr[0],
                    filters
                )
                manager.outerObject3d.position.copy(actor.getGlobalPose().p)
            }
        }
        for (const [manager, actor] of managerActorMap) {
            const { p, q } = actor.getGlobalPose()
            manager.outerObject3d.position.copy(p)
            manager.outerObject3d.quaternion.copy(q)
        }
    })
    return () => {
        handle.cancel()
    }
}, [getPhysX, getPhysXCookingCount, getEditorPlay, getFirstLoad])
