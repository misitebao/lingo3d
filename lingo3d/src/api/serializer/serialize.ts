import { equalsDefaultValue } from "../../interface/utils/getDefaultValue"
import Appendable from "../core/Appendable"
import toFixed, { toFixedPoint } from "./toFixed"
import { AppendableNode, SceneGraphNode } from "./types"
import { VERSION } from "../../globals"
import { nonSerializedAppendables, appendableRoot } from "../core/collections"
import { isPoint } from "../../utils/isPoint"
import nonSerializedProperties from "./nonSerializedProperties"
import unsafeGetValue from "../../utils/unsafeGetValue"
import Model from "../../display/Model"
import getStaticProperties from "../../display/utils/getStaticProperties"
import { isTemplateNode } from "../../visualScripting/TemplateNode"
import { isTemplate } from "../../display/Template"

const serialize = (
    children: Array<Appendable | Model> | Set<Appendable | Model>,
    skipUUID?: boolean,
    skipTemplateCheck?: boolean
) => {
    const dataParent: Array<AppendableNode> = []
    for (const child of children) {
        if (nonSerializedAppendables.has(child)) continue
        const { componentName, schema } = getStaticProperties(child)

        const data: Record<string, any> = skipTemplateCheck
            ? { type: componentName }
            : isTemplateNode(child)
            ? {
                  type: "templateNode",
                  source: componentName,
                  spawnNode: child.spawnNode
              }
            : isTemplate(child)
            ? { type: "template", source: componentName }
            : { type: componentName }
        for (const [key, type] of Object.entries(schema)) {
            if (
                type === Function ||
                (Array.isArray(type) && type.includes(Function)) ||
                nonSerializedProperties.includes(key) ||
                (skipUUID && key === "uuid")
            )
                continue

            let value: any
            if (key === "animations" && "serializeAnimations" in child) {
                value = child.serializeAnimations
                if (!value) continue
            } else if (key === "animation" && "serializeAnimation" in child) {
                value = child.serializeAnimation
                if (!value) continue
            } else value = unsafeGetValue(child, key)

            const t = typeof value
            if (equalsDefaultValue(value, child, key) || t === "function")
                continue

            if (t === "number") value = toFixed(value)
            else if (isPoint(value, t)) value = toFixedPoint(value)
            else if (Array.isArray(value) && value.some((v) => isPoint(v)))
                value = value.map((v) => (isPoint(v) ? toFixedPoint(v) : v))

            data[key] = value
        }
        if (child.children) {
            const dataChildren = serialize(
                child.children,
                skipUUID,
                skipTemplateCheck
            )
            if (dataChildren.length) data.children = dataChildren
        }
        dataParent.push(data as AppendableNode)
    }
    return dataParent
}

export const serializeAppendable = (appendable: Appendable) =>
    serialize([appendable], true, true)[0]

export default (
    versionStamp?: boolean,
    children: Array<Appendable> | Set<Appendable> = appendableRoot
) => {
    const result: Array<SceneGraphNode> = serialize(children)
    versionStamp && result.unshift({ type: "lingo3d", version: VERSION })
    return result
}
