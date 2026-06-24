<!-- components/EnvironmentInfo.vue -->
<template>
    <div class="environment-info">
        <div class="header">
            <h3>🔍 环境信息</h3>
            <div class="controls">
                <span class="status" :class="{ updating: isUpdating }">
                    {{ isUpdating ? "⏳ 更新中..." : "✅ 已更新" }}
                </span>
                <span v-if="lastUpdate" class="update-time">
                    {{ formatTime(lastUpdate) }}
                </span>
                <button @click="refresh" :disabled="isUpdating" class="refresh-btn">🔄 刷新</button>
            </div>
        </div>

        <div class="info-grid">
            <!-- 浏览器信息 -->
            <div class="info-card">
                <div class="card-header">
                    <span class="icon">🌐</span>
                    <span class="title">浏览器</span>
                </div>
                <div class="card-content">
                    <div class="info-item">
                        <span class="label">名称</span>
                        <span class="value highlight">{{ envInfo.browser.name }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">版本</span>
                        <span class="value">{{ envInfo.browser.version }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">语言</span>
                        <span class="value">{{ envInfo.browser.language }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Cookie</span>
                        <span class="value" :class="{ enabled: envInfo.browser.cookieEnabled }">
                            {{ envInfo.browser.cookieEnabled ? "✅ 启用" : "❌ 禁用" }}
                        </span>
                    </div>
                    <div class="info-item brand">
                        <span class="label">品牌</span>
                        <span class="value">
                            <span v-if="envInfo.environment.isChrome" class="badge chrome">Chrome</span>
                            <span v-else-if="envInfo.environment.isFirefox" class="badge firefox">Firefox</span>
                            <span v-else-if="envInfo.environment.isSafari" class="badge safari">Safari</span>
                            <span v-else-if="envInfo.environment.isEdge" class="badge edge">Edge</span>
                            <span v-else class="badge other">{{ envInfo.browser.name }}</span>
                        </span>
                    </div>
                </div>
            </div>

            <!-- 操作系统 -->
            <div class="info-card">
                <div class="card-header">
                    <span class="icon">💻</span>
                    <span class="title">操作系统</span>
                </div>
                <div class="card-content">
                    <div class="info-item">
                        <span class="label">名称</span>
                        <span class="value highlight">{{ envInfo.os.name }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">版本</span>
                        <span class="value">{{ envInfo.os.version || "未知" }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">架构</span>
                        <span class="value">{{ envInfo.os.architecture || "未知" }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">平台标识</span>
                        <span class="value mono">{{ envInfo.os.platform }}</span>
                    </div>
                </div>
            </div>

            <!-- 屏幕信息 -->
            <div class="info-card">
                <div class="card-header">
                    <span class="icon">🖥️</span>
                    <span class="title">屏幕</span>
                </div>
                <div class="card-content">
                    <div class="info-item">
                        <span class="label">分辨率</span>
                        <span class="value">{{ envInfo.screen.width }} × {{ envInfo.screen.height }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">可用区域</span>
                        <span class="value">{{ envInfo.screen.availWidth }} × {{ envInfo.screen.availHeight }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">色彩深度</span>
                        <span class="value">{{ envInfo.screen.colorDepth }} bit</span>
                    </div>
                    <div class="info-item">
                        <span class="label">像素比</span>
                        <span class="value">{{ envInfo.screen.pixelRatio }}x</span>
                    </div>
                </div>
            </div>

            <!-- 窗口信息 -->
            <div class="info-card">
                <div class="card-header">
                    <span class="icon">📐</span>
                    <span class="title">窗口</span>
                </div>
                <div class="card-content">
                    <div class="info-item">
                        <span class="label">可视区域</span>
                        <span class="value">{{ envInfo.window.innerWidth }} × {{ envInfo.window.innerHeight }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">外部尺寸</span>
                        <span class="value">{{ envInfo.window.outerWidth }} × {{ envInfo.window.outerHeight }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">滚动位置</span>
                        <span class="value">X: {{ envInfo.window.scrollX }}, Y: {{ envInfo.window.scrollY }}</span>
                    </div>
                </div>
            </div>

            <!-- 设备信息 -->
            <div class="info-card">
                <div class="card-header">
                    <span class="icon">📱</span>
                    <span class="title">设备</span>
                </div>
                <div class="card-content">
                    <div class="info-item">
                        <span class="label">类型</span>
                        <span class="value device-type">{{ envInfo.device.type }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">触摸屏</span>
                        <span class="value" :class="{ enabled: envInfo.device.touch }">
                            {{ envInfo.device.touch ? "✅ 支持" : "❌ 不支持" }}
                        </span>
                    </div>
                    <div class="info-item" v-if="envInfo.device.memory.total">
                        <span class="label">系统内存</span>
                        <span class="value highlight">{{ envInfo.device.memory.total }} MB</span>
                    </div>
                    <div class="info-item" v-if="envInfo.device.memory.used">
                        <span class="label">浏览器内存使用</span>
                        <span class="value">{{ envInfo.device.memory.used }} MB</span>
                    </div>
                    <div class="info-item" v-if="envInfo.device.memory.total && envInfo.device.memory.used">
                        <span class="label">内存使用率</span>
                        <span class="value"> {{ Math.round((envInfo.device.memory.used / envInfo.device.memory.total) * 100) }}% </span>
                    </div>
                </div>
            </div>

            <!-- 网络信息 -->
            <div class="info-card">
                <div class="card-header">
                    <span class="icon">📶</span>
                    <span class="title">网络</span>
                </div>
                <div class="card-content">
                    <div class="info-item">
                        <span class="label">状态</span>
                        <span class="value" :class="{ online: envInfo.network.online }">
                            {{ envInfo.network.online ? "✅ 在线" : "❌ 离线" }}
                        </span>
                    </div>
                    <div class="info-item" v-if="envInfo.network.connectionType !== 'unknown'">
                        <span class="label">连接类型</span>
                        <span class="value">
                            <span class="badge" :class="envInfo.network.connectionType">
                                {{
                                    envInfo.network.connectionType === "wifi"
                                        ? "🛜 Wi-Fi"
                                        : envInfo.network.connectionType === "cellular"
                                          ? "📱 蜂窝网络"
                                          : envInfo.network.connectionType === "ethernet"
                                            ? "🔌 有线网络"
                                            : envInfo.network.connectionType
                                }}
                            </span>
                        </span>
                    </div>
                    <div class="info-item" v-if="envInfo.network.type !== 'unknown'">
                        <span class="label">网络速度</span>
                        <span class="value">
                            <span class="badge" :class="'speed-' + envInfo.network.type">
                                {{ envInfo.network.type.toUpperCase() }}
                            </span>
                        </span>
                    </div>
                    <div class="info-item" v-if="envInfo.network.downlink">
                        <span class="label">下载速度</span>
                        <span class="value">{{ envInfo.network.downlink }} Mbps</span>
                    </div>
                    <div class="info-item" v-if="envInfo.network.rtt">
                        <span class="label">网络延迟</span>
                        <span class="value">{{ envInfo.network.rtt }} ms</span>
                    </div>
                    <div class="info-item" v-if="envInfo.network.saveData">
                        <span class="label">省流量模式</span>
                        <span class="value">✅ 开启</span>
                    </div>
                </div>
            </div>

            <!-- 时间信息 -->
            <div class="info-card">
                <div class="card-header">
                    <span class="icon">⏰</span>
                    <span class="title">时间</span>
                </div>
                <div class="card-content">
                    <div class="info-item">
                        <span class="label">时区</span>
                        <span class="value">{{ envInfo.time.timezone }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">地区</span>
                        <span class="value">{{ envInfo.time.locale }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">本地时间</span>
                        <span class="value">{{ envInfo.time.localTime }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">UTC时间</span>
                        <span class="value">{{ formatTime(envInfo.time.timestamp) }}</span>
                    </div>
                </div>
            </div>

            <!-- 性能信息 -->
            <div class="info-card">
                <div class="card-header">
                    <span class="icon">⚡</span>
                    <span class="title">性能</span>
                </div>
                <div class="card-content">
                    <div class="info-item" v-if="envInfo.performance.timing">
                        <span class="label">页面加载时间</span>
                        <span class="value highlight">{{ envInfo.performance.timing.loadTime }} ms</span>
                    </div>
                    <div class="info-item" v-if="envInfo.performance.timing">
                        <span class="label">DOM 就绪时间</span>
                        <span class="value">{{ envInfo.performance.timing.domReady }} ms</span>
                    </div>
                    <div class="info-item" v-if="envInfo.performance.navigation">
                        <span class="label">导航类型</span>
                        <span class="value">{{ envInfo.performance.navigation.type }}</span>
                    </div>
                    <div class="info-item" v-if="envInfo.performance.navigation">
                        <span class="label">重定向次数</span>
                        <span class="value">{{ envInfo.performance.navigation.redirectCount }}</span>
                    </div>
                    <div class="info-item" v-if="envInfo.performance.memory">
                        <span class="label">JS堆内存</span>
                        <span class="value">{{ envInfo.performance.memory.used }} / {{ envInfo.performance.memory.limit }}</span>
                    </div>
                </div>
            </div>

            <!-- 环境判断 -->
            <div class="info-card full-width">
                <div class="card-header">
                    <span class="icon">🔧</span>
                    <span class="title">环境判断</span>
                </div>
                <div class="card-content tags">
                    <span class="tag" :class="{ active: envInfo.environment.isBrowser }"> 🌐 浏览器 </span>
                    <span class="tag" :class="{ active: envInfo.environment.isMobile }"> 📱 移动端 </span>
                    <span class="tag" :class="{ active: envInfo.environment.isTablet }"> 📊 平板 </span>
                    <span class="tag" :class="{ active: envInfo.environment.isDesktop }"> 💻 桌面端 </span>
                    <span class="tag" :class="{ active: envInfo.environment.isWeChat }"> 💬 微信 </span>
                    <span class="tag" :class="{ active: envInfo.environment.isChrome }"> 🟢 Chrome </span>
                    <span class="tag" :class="{ active: envInfo.environment.isFirefox }"> 🟠 Firefox </span>
                    <span class="tag" :class="{ active: envInfo.environment.isSafari }"> 🔵 Safari </span>
                    <span class="tag" :class="{ active: envInfo.environment.isEdge }"> 🔷 Edge </span>
                </div>
            </div>

            <!-- User Agent -->
            <div class="info-card full-width">
                <div class="card-header">
                    <span class="icon">📄</span>
                    <span class="title">User Agent</span>
                </div>
                <div class="card-content">
                    <div class="info-item">
                        <span class="value mono">{{ envInfo.browser.userAgent }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useEnvironment } from "./useEnvironment.js"

const props = defineProps({
    autoUpdate: {
        type: Boolean,
        default: true
    },
    updateInterval: {
        type: Number,
        default: 5000
    },
    enableNetworkMonitor: {
        type: Boolean,
        default: true
    },
    enableResizeMonitor: {
        type: Boolean,
        default: true
    }
})

const { envInfo, isUpdating, lastUpdate, refresh } = useEnvironment({
    autoUpdate: props.autoUpdate,
    updateInterval: props.updateInterval,
    enableNetworkMonitor: props.enableNetworkMonitor,
    enableResizeMonitor: props.enableResizeMonitor
})

const formatTime = timestamp => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleString("zh-CN", {
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    })
}
</script>

<style scoped>
.environment-info {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
    background: #f5f7fa;
    border-radius: 12px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 16px 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex-wrap: wrap;
    gap: 10px;
}

.header h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 20px;
}

.controls {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
}

.status {
    font-size: 14px;
    color: #27ae60;
}

.status.updating {
    color: #f39c12;
    animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.update-time {
    font-size: 13px;
    color: #95a5a6;
}

.refresh-btn {
    padding: 6px 16px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
}

.refresh-btn:hover:not(:disabled) {
    background: #2980b9;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.refresh-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 16px;
}

.info-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.3s ease;
}

.info-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
}

.info-card.full-width {
    grid-column: 1 / -1;
}

.card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
}

.card-header .icon {
    font-size: 20px;
}

.card-header .title {
    font-size: 15px;
    letter-spacing: 0.5px;
}

.card-content {
    padding: 12px 16px;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
    border-bottom: none;
}

.label {
    font-size: 13px;
    color: #7f8c8d;
    font-weight: 500;
}

.value {
    font-size: 13px;
    color: #2c3e50;
    text-align: right;
    max-width: 60%;
    word-break: break-all;
}

.value.enabled {
    color: #27ae60;
}

.value:not(.enabled) {
    color: #e74c3c;
}

.value.online {
    color: #27ae60;
}

.value:not(.online) {
    color: #e74c3c;
}

.value.device-type {
    font-weight: 600;
    color: #3498db;
}

.value.mono {
    font-family: "Courier New", monospace;
    font-size: 12px;
    max-width: 100%;
    word-break: break-all;
}

.highlight {
    font-weight: 600;
    color: #2c3e50;
}

.brand {
    margin-top: 4px;
    padding-top: 8px;
    border-top: 1px dashed #e0e0e0;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 4px 0;
}

.tag {
    display: inline-block;
    padding: 4px 12px;
    background: #ecf0f1;
    border-radius: 20px;
    font-size: 13px;
    color: #95a5a6;
    transition: all 0.3s;
}

.tag.active {
    background: #3498db;
    color: white;
}

.badge {
    display: inline-block;
    padding: 2px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    color: white;
}

.badge.chrome {
    background: #4285f4;
}

.badge.firefox {
    background: #ff9400;
}

.badge.safari {
    background: #1a1a1a;
}

.badge.edge {
    background: #0078d7;
}

.badge.other {
    background: #95a5a6;
}

.badge.wifi {
    background: #2196f3;
}

.badge.cellular {
    background: #ff9800;
}

.badge.ethernet {
    background: #4caf50;
}

.badge.speed-4g {
    background: #4caf50;
}

.badge.speed-3g {
    background: #ff9800;
}

.badge.speed-2g {
    background: #f44336;
}

.badge.speed-slow-2g {
    background: #d32f2f;
}

/* 响应式 */
@media (max-width: 768px) {
    .environment-info {
        padding: 12px;
    }

    .header {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
    }

    .controls {
        justify-content: space-between;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .info-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }

    .value {
        max-width: 100%;
        text-align: left;
    }
}
</style>
