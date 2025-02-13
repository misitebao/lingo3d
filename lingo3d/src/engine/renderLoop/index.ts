import { createEffect } from "@lincode/reactivity"
import { emitAfterRender } from "../../events/onAfterRender"
import { emitBeforeRender } from "../../events/onBeforeRender"
import { getRenderer } from "../../states/useRenderer"
import { getResolution } from "../../states/useResolution"
import { getWebXR } from "../../states/useWebXR"
import { dtPtr, loop } from "../eventLoop"
import scene from "../scene"
import { getCameraRendered } from "../../states/useCameraRendered"
import { emitRender } from "../../events/onRender"
import effectComposer from "./effectComposer"
import { getSplitView } from "../../states/useSplitView"
import { getCameraComputed } from "../../states/useCameraComputed"
import { emitPhysXLoop } from "../../events/onPhysXLoop"
import { emitLoop } from "../../events/onLoop"

createEffect(() => {
    const renderer = getRenderer()
    if (!renderer) return

    const camera = getCameraRendered()

    if (getSplitView()) {
        const [resX, resY] = getResolution()
        const width = resX * 1
        const height = resY * 0.5

        const secondaryCamera = getCameraComputed()
        secondaryCamera.aspect = camera.aspect = width / height
        camera.updateProjectionMatrix()
        secondaryCamera.updateProjectionMatrix()

        const handle = loop(() => {
            emitPhysXLoop()
            emitBeforeRender()
            emitRender()
            emitLoop()

            renderer.setViewport(0, 0, width, height)
            renderer.setScissor(0, 0, width, height)
            renderer.setScissorTest(true)
            renderer.render(scene, secondaryCamera)

            renderer.setViewport(0, height, width, height)
            renderer.setScissor(0, height, width, height)
            renderer.render(scene, camera)

            emitAfterRender()
        })
        return () => {
            handle.cancel()

            renderer.setViewport(0, 0, resX, resY)
            renderer.setScissor(0, 0, resX, resY)
            renderer.setScissorTest(false)

            camera.aspect = resX / resY
            camera.updateProjectionMatrix()
        }
    }

    if (getWebXR()) {
        const handle = loop(() => {
            emitPhysXLoop()
            emitBeforeRender()
            emitRender()
            emitLoop()
            renderer.render(scene, camera)
            emitAfterRender()
        })
        return () => {
            handle.cancel()
        }
    }

    const handle = loop(() => {
        emitPhysXLoop()
        emitBeforeRender()
        emitRender()
        emitLoop()
        effectComposer.render(dtPtr[0])
        emitAfterRender()
    })
    return () => {
        handle.cancel()
    }
}, [
    getWebXR,
    getCameraRendered,
    getCameraComputed,
    getSplitView,
    getResolution,
    getRenderer
])
