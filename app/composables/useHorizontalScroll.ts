export interface UseHorizontalScrollOptions {
    /** 滚动速度倍率，默认为 1 */
    speed?: number
    /** 是否反转滚动方向，默认 false */
    reverse?: boolean
    /** 是否需要按住特定键才触发，如 'ctrl' | 'shift' | 'alt'，默认 null 表示无需按键 */
    modifierKey?: "ctrl" | "shift" | "alt" | null
}

export const useHorizontalScroll = (target: Ref<HTMLElement | null> | HTMLElement | null, options: UseHorizontalScrollOptions = {}) => {
    const { speed = 1, reverse = false, modifierKey = null } = options

    const element = ref<HTMLElement | null>(null)

    const onWheel = (e: WheelEvent) => {
        if (modifierKey) {
            const keyMap = { ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey }
            if (!keyMap[modifierKey]) return
        }

        const el = element.value
        if (!el) return

        e.preventDefault()
        el.scrollLeft += e.deltaY * speed * (reverse ? -1 : 1)
    }

    const bind = () => {
        const el = target instanceof HTMLElement ? target : target?.value
        if (el) {
            element.value = el
            el.addEventListener("wheel", onWheel, { passive: false })
        }
    }

    const unbind = () => {
        const el = element.value
        if (el) {
            el.removeEventListener("wheel", onWheel)
            element.value = null
        }
    }

    onMounted(bind)
    onUnmounted(unbind)

    return { element, bind, unbind }
}
