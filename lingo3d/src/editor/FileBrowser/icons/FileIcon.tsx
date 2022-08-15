import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"

preventTreeShake(h)

const FileIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            className="icon"
            viewBox="0 0 1024 1024"
        >
            <path
                fill="#fff"
                d="M888.495 313.883l-198.02-198.02c-7.992-7.992-20.957-7.992-28.95 0s-7.992 20.947 0 28.939L824.61 307.886H608.815v-265.2c0-11.307-9.159-20.466-20.466-20.466H180.254c-11.307 0-20.466 9.159-20.466 20.466v938.628c0 11.297 9.159 20.466 20.466 20.466h693.761c11.308 0 20.466-9.169 20.466-20.466V328.352a20.463 20.463 0 00-5.986-14.47zm-34.946 646.965H200.72V63.152h367.163v265.2c0 11.308 9.169 20.466 20.466 20.466h265.2v612.03z"
            ></path>
        </svg>
    )
}

export default FileIcon
