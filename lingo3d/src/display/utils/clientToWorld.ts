import { containerBounds } from "../../engine/renderLoop/renderSetup"
import { MouseEventPayload } from "../../interface/IMouse"
import { getCameraRendered } from "../../states/useCameraRendered"
import { getPickingMode } from "../../states/usePickingMode"
import { vector3 } from "./reusables"

export default (ev: { clientX: number, clientY: number }, forceMouse?: boolean) => {
    const rect = containerBounds[0]
    const clientX = ev.clientX - rect.x
    const clientY = ev.clientY - rect.y

    if (getPickingMode() === "camera" && !forceMouse)
        return new MouseEventPayload()

    const xNorm = (clientX / rect.width) * 2 - 1
    const yNorm = -(clientY / rect.height) * 2 + 1

    const camera = getCameraRendered()
    vector3.set(xNorm, yNorm, 0.5)
    vector3.unproject(camera)
    vector3.sub(camera.position).normalize()
    const { x, y, z } = camera.position.clone().add(vector3.multiplyScalar(5))

    return new MouseEventPayload(x, y, z, clientX, clientY, xNorm, yNorm)
}