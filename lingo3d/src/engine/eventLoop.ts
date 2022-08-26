import { Cancellable } from "@lincode/promiselikes"
import { Clock } from "three"
import { getRenderer } from "../states/useRenderer"

export const timer = (time: number, repeat: number, cb: () => void) => {
    let count = 0
    const handle = setInterval(() => {
        if (document.hidden) return
        cb()
        if (repeat !== -1 && ++count >= repeat) clearInterval(handle)
    }, time)
    return new Cancellable(() => clearInterval(handle))
}

const callbacks = new Set<() => void>()

const clock = new Clock()
let delta = 0

getRenderer((renderer) => {
    renderer?.setAnimationLoop(() => {
        delta += clock.getDelta()
        if (delta < 0.03) return
        delta = 0
        for (const cb of callbacks) cb()
    })
})

export const loop = (cb: () => void) => {
    callbacks.add(cb)
    return new Cancellable(() => callbacks.delete(cb))
}
