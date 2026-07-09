<template>
    <el-button type="info" :icon="FullScreen" @click="toggleFullscreen" :loading="isLoading">
        {{ isFullscreen ? "退出全屏" : "全屏模式" }}
    </el-button>
</template>

<script setup lang="ts">
const isFullscreen = ref(false)
const isLoading = ref(false)

// 检查当前是否全屏
const checkFullscreen = () => {
    if (typeof document === "undefined") return false

    const fullscreenElement =
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement

    return !!fullscreenElement
}

// 进入全屏
const enterFullscreen = async () => {
    const element = document.documentElement

    try {
        if (element.requestFullscreen) {
            await element.requestFullscreen()
        } else if ((element as any).webkitRequestFullscreen) {
            await (element as any).webkitRequestFullscreen()
        } else if ((element as any).mozRequestFullScreen) {
            await (element as any).mozRequestFullScreen()
        } else if ((element as any).msRequestFullscreen) {
            await (element as any).msRequestFullscreen()
        } else {
            ElMessage.warning("您的浏览器不支持全屏功能")
        }
    } catch (error) {
        ElMessage.error("进入全屏失败")
        console.error("Enter fullscreen error:", error)
    }
}

// 退出全屏
const exitFullscreen = async () => {
    try {
        if (document.exitFullscreen) {
            await document.exitFullscreen()
        } else if ((document as any).webkitExitFullscreen) {
            await (document as any).webkitExitFullscreen()
        } else if ((document as any).mozCancelFullScreen) {
            await (document as any).mozCancelFullScreen()
        } else if ((document as any).msExitFullscreen) {
            await (document as any).msExitFullscreen()
        }
    } catch (error) {
        ElMessage.error("退出全屏失败")
        console.error("Exit fullscreen error:", error)
    }
}

// 切换全屏
const toggleFullscreen = async () => {
    if (isLoading.value) return

    isLoading.value = true

    try {
        if (!checkFullscreen()) {
            await enterFullscreen()
        } else {
            await exitFullscreen()
        }
    } finally {
        isLoading.value = false
    }
}

// 监听全屏变化事件
const handleFullscreenChange = () => {
    isFullscreen.value = checkFullscreen()
}

onMounted(() => {
    // 初始化状态
    isFullscreen.value = checkFullscreen()

    // 监听全屏变化
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("mozfullscreenchange", handleFullscreenChange)
    document.addEventListener("MSFullscreenChange", handleFullscreenChange)
})

onUnmounted(() => {
    document.removeEventListener("fullscreenchange", handleFullscreenChange)
    document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
    document.removeEventListener("MSFullscreenChange", handleFullscreenChange)
})
</script>
