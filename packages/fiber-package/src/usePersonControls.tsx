import {useEffect, useState} from "react";

export const usePersonControls = () => {
    const keys = {
        KeyW: 'forward',
        KeyS: 'backward',
        KeyA: 'left',
        KeyD: 'right',
        Space: 'jump',
        ShiftLeft: 'sprint',
        ControlLeft: 'crouch',
    }

    // @ts-ignore
    const moveFieldByKey = (key) => keys[key]

    const [movement, setMovement] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
        sprint: false,
        crouch: false,
    })

    useEffect(() => {
        const handleKeyDown = (e: { code: any; }) => {
            setMovement((m) => ({...m, [moveFieldByKey(e.code)]: true}))
        }
        const handleKeyUp = (e: { code: any; }) => {
            setMovement((m) => ({...m, [moveFieldByKey(e.code)]: false}))
        }
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
        }
    }, [])
    return movement
}