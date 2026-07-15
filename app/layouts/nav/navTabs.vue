<script setup lang="ts">
import type { RouteLocationNormalized } from "vue-router"
import singleTab from "./singleTab.vue"
import { useHorizontalScroll } from "@/composables/useHorizontalScroll"

const navTabStore = useNavTabStore()
const router = useRouter()

const containerRef = ref<HTMLElement | null>(null)

interface DragState {
    isDragging: boolean
    isReady: boolean
    draggedPath: string
    nearestPath: string
    startX: number
    startY: number
}

const DRAG_THRESHOLD = 5

const drag: DragState = reactive({
    isDragging: false,
    isReady: false,
    draggedPath: "",
    nearestPath: "",
    startX: 0,
    startY: 0
})

const getSortBars = (): HTMLElement[] => {
    if (!containerRef.value) return []
    return Array.from(containerRef.value.querySelectorAll(".sort-base-bar")) as HTMLElement[]
}

const findClosestSortBar = (clientX: number, clientY: number): HTMLElement | null => {
    const bars = getSortBars()
    if (bars.length === 0) return null

    let closestBar = bars[0]
    let minDistance = Infinity

    for (const bar of bars) {
        const rect = bar.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distance = Math.hypot(clientX - centerX, clientY - centerY)

        if (distance < minDistance) {
            minDistance = distance
            closestBar = bar
        }
    }

    return closestBar
}

const reorderTabs = () => {
    const list = navTabStore.cachedTabs
    const { nearestPath, draggedPath } = drag

    // 前置占位条：移到最前面
    if (nearestPath === "") {
        const moveIndex = list.findIndex(item => item.path === draggedPath)
        if (moveIndex === -1) return

        const [movedItem] = list.splice(moveIndex, 1)
        list.unshift(movedItem)
        return
    }

    // 移到目标标签之后
    const moveIndex = list.findIndex(item => item.path === draggedPath)
    const targetIndex = list.findIndex(item => item.path === nearestPath)

    if (moveIndex === -1 || targetIndex === -1 || moveIndex === targetIndex) return

    const [movedItem] = list.splice(moveIndex, 1)
    const newTargetIndex = moveIndex < targetIndex ? targetIndex - 1 : targetIndex
    list.splice(newTargetIndex + 1, 0, movedItem)
}

const startDrag = (e: MouseEvent, tabElement: HTMLElement) => {
    const path = tabElement.getAttribute("data-tab-path")
    if (!path) return

    drag.isReady = true
    drag.draggedPath = path
    drag.startX = e.clientX
    drag.startY = e.clientY
    drag.nearestPath = ""

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
}

const activateDrag = () => {
    drag.isDragging = true
    drag.isReady = false
}

const updateNearestTarget = (clientX: number, clientY: number) => {
    const nearestBar = findClosestSortBar(clientX, clientY)
    drag.nearestPath = nearestBar?.getAttribute("data-sort-path") || ""
}

const resetDragState = () => {
    drag.isDragging = false
    drag.isReady = false
    drag.draggedPath = ""
    drag.nearestPath = ""
    drag.startX = 0
    drag.startY = 0

    document.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseup", onMouseUp)
}

// ==================== 事件处理器 ====================
const onMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const tabElement = target.closest(".single-tab")
    if (!tabElement) return

    startDrag(e, tabElement)
}

const onMouseMove = (e: MouseEvent) => {
    if (drag.isReady && !drag.isDragging) {
        const distance = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY)
        if (distance >= DRAG_THRESHOLD) {
            activateDrag()
        } else {
            return
        }
    }

    if (drag.isDragging) {
        updateNearestTarget(e.clientX, e.clientY)
    }
}

const onMouseUp = () => {
    if (drag.isDragging) {
        reorderTabs()
    }
    resetDragState()
}

useHorizontalScroll(containerRef, { speed: 1.5 })

const tabClick = (tab: RouteLocationNormalized) => router.push(tab.path)

onMounted(() => {
    containerRef.value?.addEventListener("mousedown", onMouseDown)
})

onBeforeUnmount(() => {
    containerRef.value?.removeEventListener("mousedown", onMouseDown)
    document.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseup", onMouseUp)
})
</script>

<template>
    <div ref="containerRef" v-auto-animate class="nav-tabs-container">
        <div class="sort-base-bar" data-sort-path="" :class="{ active: drag.nearestPath === '' && drag.isDragging }" />

        <template v-for="tab in navTabStore.cachedTabs" :key="tab.path">
            <singleTab
                class="single-tab"
                :data-tab-path="tab.path"
                :tab="tab"
                :closeable="!(tab.path === '/home' && navTabStore.cachedTabs.length === 1)"
                @tab-click="tabClick"
                @tab-close="navTabStore.tabsRemove"
            />

            <div class="sort-base-bar" :data-sort-path="tab.path" :class="{ active: drag.nearestPath === tab.path && drag.isDragging }" />
        </template>
    </div>
</template>

<style scoped>
.nav-tabs-container {
    display: flex;
    align-items: center;
    gap: 3px;
    height: 38px;
    padding: 0 12px;
    border-right: 1px solid #cbd5e1;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    user-select: none;
}

.nav-tabs-container::-webkit-scrollbar {
    height: 1px;
    margin-bottom: -1px;
}

.nav-tabs-container::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
}

.sort-base-bar {
    height: 20px;
    width: 3px;
    flex-shrink: 0;
    border-radius: 2px;
    background-color: transparent;
    transition: all 0.2s ease;
}

.sort-base-bar.active {
    background-color: #8d8d8d;
    height: 22px;
}
</style>
