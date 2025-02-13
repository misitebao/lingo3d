import { useState } from "preact/hooks"

type MenuItemProps = {
    disabled?: boolean
    highlight?: boolean
    onClick?: (e: MouseEvent) => void
    children: string
}

const MenuButton = ({
    disabled,
    highlight,
    onClick,
    children
}: MenuItemProps) => {
    const [hover, setHover] = useState(false)

    return (
        <div
            style={{
                padding: 6,
                paddingLeft: 20,
                paddingRight: 20,
                whiteSpace: "nowrap",
                background: disabled
                    ? undefined
                    : hover
                    ? "rgba(255, 255, 255, 0.1)"
                    : highlight
                    ? "rgba(255, 255, 255, 0.2)"
                    : undefined,
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? undefined : "pointer"
            }}
            onClick={disabled ? undefined : onClick}
            onMouseEnter={disabled ? undefined : () => setHover(true)}
            onMouseLeave={disabled ? undefined : () => setHover(false)}
        >
            {children}
        </div>
    )
}
export default MenuButton
