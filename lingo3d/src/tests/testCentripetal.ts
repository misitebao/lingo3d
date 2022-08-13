import { Dummy, keyboard, Model, ThirdPersonCamera, settings, DirectionalLight, Sphere } from ".."
import { YBOT_URL } from "../globals"

export default {}

const spawn = new Sphere()
spawn.x = -3888.93
spawn.y = -3278.18
spawn.z = -976.08

const world = new Model()
world.src = "awei/map.glb"
world.resize = false
world.scale = 5
world.physics = "map"
world.frustumCulled = false
world.metalnessFactor = 0.1

const player = new Dummy()
player.y = 6000
player.physics = "character"
player.strideMove = true
player.strideMode = "free"
player.src = "awei/awei.fbx"
player.scale = 3
player.animations = {
    idle: "awei/idle.fbx",
    running: "awei/running.fbx"
}
player.placeAt(spawn)

const cam = new ThirdPersonCamera()
cam.append(player)
cam.transition = true
cam.mouseControl = true
cam.innerZ = 1000
cam.lockTargetRotation = "dynamic-lock"

keyboard.onKeyPress = (_, key) => {
    if (key.has("w")) player.strideForward = -10
    else if (key.has("s")) player.strideForward = 10
    else player.strideForward = 0

    if (key.has("a")) player.strideRight = 10
    else if (key.has("d")) player.strideRight = -10
    else player.strideRight = 0
}

keyboard.onKeyDown = (key) => {
    if (key === "Space")
        player.src = player.src === "player2.glb" ? YBOT_URL : "player2.glb"
}

settings.texture = "bg.png"
settings.centripetal = true
