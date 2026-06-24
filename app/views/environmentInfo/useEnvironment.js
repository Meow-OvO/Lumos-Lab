// composables/useEnvironment.js
import { ref, reactive, onMounted, onUnmounted } from "vue"

export function useEnvironment(options = {}) {
    const { autoUpdate = true, updateInterval = 5000, enableNetworkMonitor = true, enableResizeMonitor = true } = options

    const envInfo = reactive({
        browser: {
            name: "",
            version: "",
            language: "",
            cookieEnabled: false,
            userAgent: ""
        },
        os: {
            name: "",
            version: "",
            platform: "",
            architecture: ""
        },
        screen: {
            width: 0,
            height: 0,
            availWidth: 0,
            availHeight: 0,
            colorDepth: 0,
            pixelRatio: 1
        },
        window: {
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0,
            scrollX: 0,
            scrollY: 0
        },
        device: {
            type: "Desktop",
            touch: false,
            pixelRatio: 1,
            memory: {
                total: null,
                used: null,
                limit: null
            }
        },
        network: {
            online: true,
            type: "unknown",
            downlink: null,
            rtt: null,
            saveData: false,
            connectionType: "unknown"
        },
        time: {
            timezone: "",
            locale: "",
            timestamp: "",
            localTime: ""
        },
        performance: {
            memory: null,
            navigation: null,
            timing: null
        },
        environment: {
            isNode: false,
            isBrowser: true,
            isWeChat: false,
            isMobile: false,
            isTablet: false,
            isDesktop: true,
            isChrome: false,
            isFirefox: false,
            isSafari: false,
            isEdge: false,
            isIE: false
        }
    })

    const isUpdating = ref(false)
    const lastUpdate = ref(null)
    let updateTimer = null
    let networkListener = null
    let resizeListener = null

    // 精确检测浏览器
    const getBrowserInfo = () => {
        const ua = navigator.userAgent
        let name = "Unknown"
        let version = ""

        // 检测Edge (基于Chromium)
        if (ua.indexOf("Edg/") > -1) {
            name = "Microsoft Edge"
            const match = ua.match(/Edg\/(\d+\.\d+)/)
            if (match) version = match[1]
        }
        // 检测Opera或Oculus
        else if (ua.indexOf("OPR/") > -1 || ua.indexOf("Opera/") > -1) {
            name = "Opera"
            const match = ua.match(/(?:OPR|Opera)\/(\d+\.\d+)/)
            if (match) version = match[1]
        }
        // 检测Chrome (但不是Edge或Opera)
        else if (ua.indexOf("Chrome/") > -1 && ua.indexOf("Edg/") === -1 && ua.indexOf("OPR/") === -1) {
            name = "Google Chrome"
            const match = ua.match(/Chrome\/(\d+\.\d+)/)
            if (match) version = match[1]
        }
        // 检测Safari
        else if (ua.indexOf("Safari/") > -1) {
            name = "Safari"
            const match = ua.match(/Version\/(\d+\.\d+)/)
            if (match) version = match[1]
        }
        // 检测Firefox
        else if (ua.indexOf("Firefox/") > -1) {
            name = "Mozilla Firefox"
            const match = ua.match(/Firefox\/(\d+\.\d+)/)
            if (match) version = match[1]
        }
        // 检测IE
        else if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1) {
            name = "Internet Explorer"
            const match = ua.match(/(?:MSIE |rv:)(\d+\.\d+)/)
            if (match) version = match[1]
        }

        return { name, version, userAgent: ua }
    }

    // 精确检测操作系统
    const getOSInfo = () => {
        const ua = navigator.userAgent
        const platform = navigator.platform
        let name = "Unknown"
        let version = ""
        let architecture = ""

        // 检测Windows
        if (ua.indexOf("Windows") > -1) {
            name = "Windows"
            const versionMap = {
                "10.0": "11", // Windows 11 也报告为 10.0
                6.3: "8.1",
                6.2: "8",
                6.1: "7",
                "6.0": "Vista",
                5.2: "XP x64",
                5.1: "XP",
                "5.0": "2000"
            }

            const match = ua.match(/Windows NT (\d+\.\d+)/)
            if (match) {
                const ntVersion = match[1]
                // Windows 11 检查
                if (ntVersion === "10.0" && (ua.indexOf("ARM64") > -1 || ua.indexOf("Win64") > -1)) {
                    // 检测是否为Windows 11 (通过build number)
                    const buildMatch = ua.match(/Windows NT 10\.0\.(\d+)/)
                    if (buildMatch && parseInt(buildMatch[1]) >= 22000) {
                        version = "11"
                    } else {
                        version = "10"
                    }
                } else {
                    version = versionMap[ntVersion] || ntVersion
                }
            }

            // 检测架构
            if (ua.indexOf("ARM64") > -1) architecture = "ARM64"
            else if (ua.indexOf("Win64") > -1 || ua.indexOf("x64") > -1) architecture = "x64"
            else if (ua.indexOf("WOW64") > -1) architecture = "x64 (32-bit app)"
            else if (ua.indexOf("Win32") > -1) architecture = "x86"
        }
        // 检测macOS
        else if (ua.indexOf("Mac OS X") > -1 || ua.indexOf("Macintosh") > -1) {
            name = "macOS"
            const match = ua.match(/Mac OS X (\d+[._]\d+)/)
            if (match) {
                version = match[1].replace("_", ".")
            }
            if (ua.indexOf("ARM") > -1) architecture = "ARM64 (Apple Silicon)"
            else architecture = "x64 (Intel)"
        }
        // 检测iOS
        else if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1 || ua.indexOf("iPod") > -1) {
            name = "iOS"
            const match = ua.match(/OS (\d+[._]\d+)/)
            if (match) {
                version = match[1].replace("_", ".")
            }
            architecture = "ARM64"
        }
        // 检测Android
        else if (ua.indexOf("Android") > -1) {
            name = "Android"
            const match = ua.match(/Android (\d+\.\d+)/)
            if (match) {
                version = match[1]
            }
            architecture = "ARM64"
        }
        // 检测Linux
        else if (ua.indexOf("Linux") > -1) {
            name = "Linux"
            if (ua.indexOf("x86_64") > -1) architecture = "x64"
            else if (ua.indexOf("i686") > -1) architecture = "x86"
            else architecture = "Unknown"
        }

        return { name, version, platform, architecture }
    }

    // 获取设备类型（更精确）
    const getDeviceType = () => {
        const ua = navigator.userAgent
        const maxTouchPoints = navigator.maxTouchPoints || 0

        // 检测是否为平板
        if (
            /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua) ||
            ua.indexOf("iPad") > -1 ||
            (ua.indexOf("Android") > -1 && screen.width >= 768 && maxTouchPoints > 0)
        ) {
            return "Tablet"
        }

        // 检测是否为手机
        if (
            /Mobile|Android|iPhone|iPod|BlackBerry|Windows Phone|webOS/i.test(ua) ||
            ua.indexOf("iPhone") > -1 ||
            (ua.indexOf("Android") > -1 && screen.width < 768 && maxTouchPoints > 0)
        ) {
            return "Mobile"
        }

        return "Desktop"
    }

    // 获取网络信息（更精确）
    const getNetworkInfo = () => {
        const info = {
            online: navigator.onLine,
            type: "unknown",
            connectionType: "unknown",
            downlink: null,
            rtt: null,
            saveData: false
        }

        if ("connection" in navigator) {
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
            if (conn) {
                // effectiveType: 'slow-2g', '2g', '3g', '4g'
                info.type = conn.effectiveType || "unknown"

                // 更精确的连接类型
                if (conn.type) {
                    info.connectionType = conn.type // 'wifi', 'cellular', 'ethernet', 'none'
                }

                info.downlink = conn.downlink || null
                info.rtt = conn.rtt || null
                info.saveData = conn.saveData || false
            }
        }

        return info
    }

    // 获取内存信息
    const getMemoryInfo = () => {
        const info = {
            total: null,
            used: null,
            limit: null
        }

        // 浏览器内存（Chrome Only）
        if (performance.memory) {
            info.used = Math.round(performance.memory.usedJSHeapSize / 1048576)
            info.total = Math.round(performance.memory.totalJSHeapSize / 1048576)
            info.limit = Math.round(performance.memory.jsHeapSizeLimit / 1048576)
        }

        // 尝试获取系统内存（部分浏览器支持）
        if (navigator.deviceMemory) {
            info.total = navigator.deviceMemory * 1024 // 转换为MB
        }

        return info
    }

    // 检测浏览器是否为Chrome
    const isChrome = () => {
        const ua = navigator.userAgent
        return ua.indexOf("Chrome/") > -1 && ua.indexOf("Edg/") === -1 && ua.indexOf("OPR/") === -1 && ua.indexOf("Safari/") > -1
    }

    // 更新所有环境信息
    const updateEnvironment = () => {
        isUpdating.value = true

        try {
            const browserInfo = getBrowserInfo()
            const osInfo = getOSInfo()
            const deviceType = getDeviceType()
            const networkInfo = getNetworkInfo()
            const memoryInfo = getMemoryInfo()

            // 浏览器信息
            envInfo.browser = {
                name: browserInfo.name,
                version: browserInfo.version,
                language: navigator.language,
                cookieEnabled: navigator.cookieEnabled,
                userAgent: browserInfo.userAgent
            }

            // 操作系统
            envInfo.os = {
                name: osInfo.name,
                version: osInfo.version,
                platform: osInfo.platform,
                architecture: osInfo.architecture
            }

            // 屏幕信息
            envInfo.screen = {
                width: screen.width,
                height: screen.height,
                availWidth: screen.availWidth,
                availHeight: screen.availHeight,
                colorDepth: screen.colorDepth,
                pixelRatio: window.devicePixelRatio || 1
            }

            // 窗口信息
            envInfo.window = {
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                outerWidth: window.outerWidth,
                outerHeight: window.outerHeight,
                scrollX: window.scrollX || window.pageXOffset,
                scrollY: window.scrollY || window.pageYOffset
            }

            // 设备信息
            envInfo.device = {
                type: deviceType,
                touch: "ontouchstart" in window || navigator.maxTouchPoints > 0,
                pixelRatio: window.devicePixelRatio || 1,
                memory: memoryInfo
            }

            // 网络信息
            envInfo.network = networkInfo

            // 时间信息
            envInfo.time = {
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                locale: navigator.language,
                timestamp: new Date().toISOString(),
                localTime: new Date().toLocaleString("zh-CN", {
                    hour12: false,
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                })
            }

            // 性能信息
            envInfo.performance = {
                memory: performance.memory
                    ? {
                          used: Math.round(performance.memory.usedJSHeapSize / 1048576) + "MB",
                          total: Math.round(performance.memory.totalJSHeapSize / 1048576) + "MB",
                          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) + "MB"
                      }
                    : null,
                navigation: performance.navigation
                    ? {
                          type:
                              performance.navigation.type === 0
                                  ? "Normal"
                                  : performance.navigation.type === 1
                                    ? "Reload"
                                    : performance.navigation.type === 2
                                      ? "Back/Forward"
                                      : "Prerender",
                          redirectCount: performance.navigation.redirectCount
                      }
                    : null,
                timing: performance.timing
                    ? {
                          loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                          domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
                      }
                    : null
            }

            // 环境判断
            const isWeChat = /MicroMessenger/i.test(navigator.userAgent)
            const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent)
            const isTablet = deviceType === "Tablet"

            envInfo.environment = {
                isNode: false,
                isBrowser: true,
                isWeChat,
                isMobile,
                isTablet,
                isDesktop: deviceType === "Desktop",
                isChrome: isChrome(),
                isFirefox: /Firefox/i.test(navigator.userAgent),
                isSafari: /Safari/i.test(navigator.userAgent) && !isChrome(),
                isEdge: /Edg/i.test(navigator.userAgent),
                isIE: /MSIE|Trident/i.test(navigator.userAgent)
            }

            lastUpdate.value = new Date()
        } catch (error) {
            console.error("Error updating environment info:", error)
        } finally {
            isUpdating.value = false
        }
    }

    // 网络状态变化监听
    const handleNetworkChange = () => {
        const networkInfo = getNetworkInfo()
        envInfo.network = {
            ...envInfo.network,
            ...networkInfo
        }
    }

    // 窗口大小变化监听
    const handleResize = () => {
        envInfo.window = {
            ...envInfo.window,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            outerWidth: window.outerWidth,
            outerHeight: window.outerHeight,
            scrollX: window.scrollX || window.pageXOffset,
            scrollY: window.scrollY || window.pageYOffset
        }
    }

    // 启动自动更新
    const startAutoUpdate = () => {
        if (!autoUpdate) return

        if (enableNetworkMonitor) {
            window.addEventListener("online", handleNetworkChange)
            window.addEventListener("offline", handleNetworkChange)

            if ("connection" in navigator) {
                const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
                if (conn) {
                    conn.addEventListener("change", handleNetworkChange)
                }
            }
        }

        if (enableResizeMonitor) {
            window.addEventListener("resize", handleResize)
            window.addEventListener("scroll", handleResize)
        }

        if (updateInterval > 0) {
            updateTimer = setInterval(updateEnvironment, updateInterval)
        }
    }

    // 停止自动更新
    const stopAutoUpdate = () => {
        if (updateTimer) {
            clearInterval(updateTimer)
            updateTimer = null
        }

        window.removeEventListener("online", handleNetworkChange)
        window.removeEventListener("offline", handleNetworkChange)
        window.removeEventListener("resize", handleResize)
        window.removeEventListener("scroll", handleResize)

        if ("connection" in navigator) {
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
            if (conn) {
                conn.removeEventListener("change", handleNetworkChange)
            }
        }
    }

    // 手动刷新
    const refresh = () => {
        updateEnvironment()
    }

    onMounted(() => {
        updateEnvironment()
        startAutoUpdate()
    })

    onUnmounted(() => {
        stopAutoUpdate()
    })

    return {
        envInfo,
        isUpdating,
        lastUpdate,
        refresh,
        startAutoUpdate,
        stopAutoUpdate
    }
}
