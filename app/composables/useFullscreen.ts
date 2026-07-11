interface ExtendedDocument extends Document {
    webkitFullscreenElement?: Element | null
    mozFullScreenElement?: Element | null
    msFullscreenElement?: Element | null
    webkitExitFullscreen?: () => Promise<void>
    mozCancelFullScreen?: () => Promise<void>
    msExitFullscreen?: () => Promise<void>
}

interface ExtendedHTMLElement extends HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>
    mozRequestFullScreen?: () => Promise<void>
    msRequestFullscreen?: () => Promise<void>
}

type FullscreenEventName = "fullscreenchange" | "webkitfullscreenchange" | "mozfullscreenchange" | "MSFullscreenChange"

interface UseFullscreenOptions {
    showError?: boolean
    errorMessages?: {
        enterFailed?: string
        exitFailed?: string
        notSupported?: string
        permissionDenied?: string
    }
    onToggle?: (isFullscreen: boolean) => void
    onError?: (error: Error) => void
}

interface UseFullscreenReturn {
    isFullscreen: Readonly<Ref<boolean>>
    isToggling: Readonly<Ref<boolean>>
    toggleFullscreen: () => Promise<void>
    enterFullscreen: () => Promise<void>
    exitFullscreen: () => Promise<void>
    updateFullscreenState: () => void
}

const isFullscreenSupported = (): boolean => {
    if (typeof document === "undefined") return false

    const doc = document as ExtendedDocument
    return !!(
        doc.fullscreenElement !== undefined ||
        doc.webkitFullscreenElement !== undefined ||
        doc.mozFullScreenElement !== undefined ||
        doc.msFullscreenElement !== undefined
    )
}

const getFullscreenElement = (): Element | null => {
    if (typeof document === "undefined") return null

    const doc = document as ExtendedDocument
    return (doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement || null) as Element | null
}

const getFullscreenEvents = (): FullscreenEventName[] => {
    if (typeof document === "undefined") return []

    const events: FullscreenEventName[] = ["fullscreenchange"]

    const doc = document as ExtendedDocument
    if (doc.webkitExitFullscreen) {
        events.push("webkitfullscreenchange")
    }
    if (doc.mozCancelFullScreen) {
        events.push("mozfullscreenchange")
    }
    if (doc.msExitFullscreen) {
        events.push("MSFullscreenChange")
    }

    return events
}

export function useFullscreen(options: UseFullscreenOptions = {}): UseFullscreenReturn {
    const {
        showError = true,
        errorMessages = {
            enterFailed: "进入全屏失败，请重试",
            exitFailed: "退出全屏失败，请重试",
            notSupported: "您的浏览器不支持全屏功能",
            permissionDenied: "全屏权限被拒绝，请允许后重试"
        },
        onToggle,
        onError
    } = options

    const isFullscreen = ref(false)
    const isToggling = ref(false)

    const checkFullscreen = (): boolean => {
        if (typeof document === "undefined") return false
        return !!getFullscreenElement()
    }

    const showErrorMessage = (message: string | undefined): void => {
        if (showError) {
            ElMessage.error(message)
        }
    }

    const handleError = (error: unknown, defaultMessage: string | undefined): void => {
        const err = error instanceof Error ? error : new Error(String(error))

        // 处理特定错误类型
        if (err.name === "NotAllowedError" || err.message.includes("denied")) {
            showErrorMessage(errorMessages.permissionDenied || defaultMessage)
        } else {
            showErrorMessage(defaultMessage)
        }

        onError?.(err)
        console.error("[useFullscreen] Error:", err)
    }

    const enterFullscreen = async (): Promise<void> => {
        if (typeof document === "undefined") {
            throw new Error("Fullscreen API is not available in server environment")
        }

        if (!isFullscreenSupported()) {
            const error = new Error(errorMessages.notSupported)
            showErrorMessage(errorMessages.notSupported)
            onError?.(error)
            throw error
        }

        const element = document.documentElement as ExtendedHTMLElement

        try {
            if (element.requestFullscreen) {
                await element.requestFullscreen()
            } else if (element.webkitRequestFullscreen) {
                await element.webkitRequestFullscreen()
            } else if (element.mozRequestFullScreen) {
                await element.mozRequestFullScreen()
            } else if (element.msRequestFullscreen) {
                await element.msRequestFullscreen()
            } else {
                const error = new Error(errorMessages.notSupported)
                showErrorMessage(errorMessages.notSupported)
                onError?.(error)
                throw error
            }
        } catch (error) {
            handleError(error, errorMessages.enterFailed)
            throw error
        }
    }

    const exitFullscreen = async (): Promise<void> => {
        if (typeof document === "undefined") {
            throw new Error("Fullscreen API is not available in server environment")
        }

        const doc = document as ExtendedDocument

        try {
            if (doc.exitFullscreen) {
                await doc.exitFullscreen()
            } else if (doc.webkitExitFullscreen) {
                await doc.webkitExitFullscreen()
            } else if (doc.mozCancelFullScreen) {
                await doc.mozCancelFullScreen()
            } else if (doc.msExitFullscreen) {
                await doc.msExitFullscreen()
            } else {
                if (checkFullscreen()) {
                    const error = new Error("Exit fullscreen is not supported")
                    showErrorMessage(errorMessages.exitFailed)
                    onError?.(error)
                    throw error
                }
            }
        } catch (error) {
            handleError(error, errorMessages.exitFailed)
            throw error
        }
    }

    const toggleFullscreen = async (): Promise<void> => {
        if (isToggling.value) return

        isToggling.value = true

        try {
            const isCurrentlyFullscreen = checkFullscreen()

            if (!isCurrentlyFullscreen) {
                await enterFullscreen()
            } else {
                await exitFullscreen()
            }

            onToggle?.(!isCurrentlyFullscreen)
        } catch (error) {
            console.warn("[useFullscreen] Toggle failed:", error)
        } finally {
            isToggling.value = false
        }
    }

    const updateFullscreenState = (): void => {
        if (typeof document === "undefined") return
        isFullscreen.value = checkFullscreen()
    }

    const handleFullscreenChange = (): void => {
        updateFullscreenState()
    }

    let cleanupFunctions: (() => void)[] = []

    onMounted(() => {
        if (typeof document === "undefined") return

        isFullscreen.value = checkFullscreen()

        const events = getFullscreenEvents()

        events.forEach(eventName => {
            document.addEventListener(eventName, handleFullscreenChange)
        })

        cleanupFunctions = events.map(eventName => {
            return () => {
                document.removeEventListener(eventName, handleFullscreenChange)
            }
        })

        const handleVisibilityChange = (): void => {
            if (document.hidden) {
                setTimeout(updateFullscreenState, 100)
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)
        cleanupFunctions.push(() => {
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        })
    })

    onUnmounted(() => {
        cleanupFunctions.forEach(cleanup => cleanup())
        cleanupFunctions = []
    })

    return {
        isFullscreen: readonly(isFullscreen),
        isToggling: readonly(isToggling),
        toggleFullscreen,
        enterFullscreen,
        exitFullscreen,
        updateFullscreenState
    }
}

export default useFullscreen
