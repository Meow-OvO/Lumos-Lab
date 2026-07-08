<!-- components/GisMap.vue -->
<template>
    <div ref="mapContainer" class="map-container" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick } from "vue"
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import XYZ from "ol/source/XYZ"
import { fromLonLat } from "ol/proj"

const mapContainer = ref<HTMLElement | null>(null)
let map: Map | null = null

const initMap = () => {
    if (!mapContainer.value) return

    // 高德矢量瓦片 - 使用更稳定的URL
    const amapLayer = new TileLayer({
        // 降低并发数，避免被高德限制
        source: new XYZ({
            url: "https://webst{s}.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}",
            subdomains: ["01", "02", "03", "04"],
            // 最大并发请求数
            maxConnections: 4
        })
    })

    map = new Map({
        target: mapContainer.value,
        layers: [amapLayer],
        view: new View({
            center: fromLonLat([121.4737, 31.2304]), // 上海
            zoom: 14,
            projection: "EPSG:3857"
        }),
        // 添加控制项
        controls: []
    })

    // 延迟刷新尺寸确保地图正确渲染
    setTimeout(() => map?.updateSize(), 300)

    // 监听地图加载完成
    map.on("rendercomplete", () => {
        console.log("地图加载完成")
    })
}

onMounted(() => {
    nextTick(() => {
        initMap()
    })
})

onBeforeUnmount(() => {
    if (map) {
        map.setTarget(undefined)
        map.dispose()
        map = null
    }
})
</script>

<style scoped>
.map-container {
    width: 100%;
    height: 100vh;
    background: #f0f0f0;
    /* 加载失败时的背景色 */
}
</style>
