import { createContext, useState } from "react"

const CursorWaitContext = createContext({})

const CursorWaitProvider = ({children}) => {
    const [cursorWait, setCursorWait] = useState(false)
    return (
        <CursorWaitContext.Provider value={{cursorWait, setCursorWait}}>
            {children}
        </CursorWaitContext.Provider>
        )
}

export {CursorWaitProvider, CursorWaitContext}