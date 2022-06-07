import { LinearToneMapping, NoToneMapping, PCFSoftShadowMap } from "three"
import { getExposure } from "../../states/useExposure"
import { getResolution, setResolution } from "../../states/useResolution"
import { getPerformance } from "../../states/usePerformance"
import { getPixelRatio } from "../../states/usePixelRatio"
import { createEffect, createNestedEffect } from "@lincode/reactivity"
import { getVR } from "../../states/useVR"
import { getRenderer } from "../../states/useRenderer"
import { getPBR } from "../../states/usePBR"
import { getViewportSize } from "../../states/useViewportSize"
import { getSecondaryCamera } from "../../states/useSecondaryCamera"
import { VRButton } from "./VRButton"
import { getDefaultLightScale } from "../../states/useDefaultLightScale"
import { getDefaultLight } from "../../states/useDefaultLight"
import { getAutoMount } from "../../states/useAutoMount"
import { onEditorMountChange } from "../../events/onEditorMountChange"
import { debounce } from "@lincode/utils"

export const rootContainer = document.createElement("div")
Object.assign(rootContainer.style, {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "100%",
    height: "100%"
})

export const container = document.createElement("div")
Object.assign(container.style, {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "100%",
    zIndex: "10"
})
rootContainer.appendChild(container)
getSecondaryCamera(cam => container.style.height = cam ? "50%" : "100%")

export const containerBounds = [container.getBoundingClientRect()]

const useResize = (el: Element) => {
    createNestedEffect(() => {
        const handleResize = () => {
            containerBounds[0] = container.getBoundingClientRect()
            setResolution(el === document.body ? [window.innerWidth, window.innerHeight] : [el.clientWidth, el.clientHeight])
        }
        handleResize()

        const handleResizeDebounced = debounce(handleResize, 100, "trailing")
        window.addEventListener("resize", handleResizeDebounced)
        const handle = onEditorMountChange(handleResizeDebounced)

        return () => {
            window.removeEventListener("resize", handleResize)
            handle.cancel()
        }
    }, [])
}

createEffect(() => {
    const autoMount = getAutoMount()
    if (!autoMount) return

    if (typeof autoMount === "string") {
        const el = document.querySelector(autoMount)
        if (!el) return

        el.appendChild(rootContainer)
        useResize(el)

        return () => {
            el.removeChild(rootContainer)
        }
    }

    if (autoMount === true) {
        document.body.appendChild(rootContainer)
        useResize(document.body)

        return () => {
            document.body.removeChild(rootContainer)
        }
    }
    
    autoMount.appendChild(rootContainer)
    useResize(autoMount)

    return () => {
        autoMount.removeChild(rootContainer)
    }
}, [getAutoMount])

export const referenceOutline = document.createElement("div")
Object.assign(referenceOutline.style, {
    border: "1px solid blue",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    pointerEvents: "none"
})
container.appendChild(referenceOutline)

createEffect(() => {
    const [vw, vh] = getViewportSize() ?? getResolution()
    const [rx, ry] = getResolution()
    referenceOutline.style.display = (getSecondaryCamera() || (rx === vw && ry === vh)) ? "none" : "block"
    
}, [getResolution, getViewportSize, getSecondaryCamera])

createEffect(() => {
    const canvas = getRenderer().domElement
    rootContainer.appendChild(canvas)
    Object.assign(canvas.style, { position: "absolute", left: "0px", top: "0px" })
    return () => {
        rootContainer.removeChild(canvas)
    }
}, [getRenderer])

createEffect(() => {
    const renderer = getRenderer()

    const [w, h] = getResolution()
    renderer.setSize(w, h)
    renderer.setPixelRatio(getPixelRatio())

}, [getRenderer, getResolution, getPixelRatio])

createEffect(() => {
    const renderer = getRenderer()

    // renderer.shadowMap.type = PCFSoftShadowMap
    renderer.shadowMap.enabled = getPerformance() !== "speed"

}, [getRenderer, getPerformance])

createEffect(() => {
    const renderer = getRenderer()
    renderer.physicallyCorrectLights = getPBR()

}, [getRenderer, getPBR])

createEffect(() => {
    const renderer = getRenderer()
    const defaultLight = getDefaultLight()
    const exposure = typeof defaultLight === "string" && defaultLight !== "default"
        ? getExposure() * getDefaultLightScale() * (defaultLight === "studio" ? 2 : 1)
        : getExposure()

    renderer.toneMapping = exposure !== 1 ? LinearToneMapping : NoToneMapping
    renderer.toneMappingExposure = exposure

}, [getExposure, getRenderer, getDefaultLight, getDefaultLightScale])

createEffect(() => {
    if (getVR() !== "webxr") return

    const renderer = getRenderer()
    renderer.xr.enabled = true
    
    const button = VRButton.createButton(renderer)
    container.appendChild(button)

    button.ontouchstart = () => button.onclick?.(new MouseEvent("click"))

    return () => {
        renderer.xr.enabled = false
        container.removeChild(button)
    }
}, [getVR, getRenderer])