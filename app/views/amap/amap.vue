<template>
    <div id="amap-container"></div>
</template>

<script setup>
import AMapLoader from "@amap/amap-jsapi-loader"

const emit = defineEmits(["mapClick"])

let AMap = null
let map = null
let geolocation = null

let marker = null

const AMAP_JS_KEY = "eb469a90dd8476c0cf8210006d25afc3" // 注意：请使用Web服务类型Key，区别于JS API的Key
const AMAP_WEB_KEY = "930ed13b65a9685b396b5b117d98b67a"

const setupAmap = async () => {
    window._AMapSecurityConfig = { securityJsCode: "75786255f35fa7e3680556c0b5d12516" }

    // try {
    AMap = await AMapLoader.load({ key: AMAP_JS_KEY, version: "2.0", plugins: ["AMap.Scale", "AMap.Geolocation"] })

    map = new AMap.Map("amap-container", { viewMode: "3D", zoom: 12 })

    map.on("click", event => {
        console.log("点击坐标:", event.lnglat.lng, event.lnglat.lat, event)

        emit("mapClick", event)

        // 在这里可以调用逆地理编码，将坐标转为地址
        // 或者添加一个临时标记等
    })

    geolocation = new AMap.Geolocation({ enableHighAccuracy: true, timeout: 16000, zoomToAccuracy: true })

    // setupCurrentPosition()
    // geolocation.getCurrentPosition((status, result) => {
    //     if (status === "complete") {
    //         map.setZoomAndCenter(16, result.position)
    //         new AMap.Marker({ position: result.position, animation: "AMAP_ANIMATION_BOUNCE" }).setMap(map)
    //     } else {
    //         console.warn("定位失败，使用默认位置:", result.massage)
    //     }
    // })

    AMap.plugin("AMap.ToolBar", () => {
        var toolbar = new AMap.ToolBar() //缩放工具条实例化
        map.addControl(toolbar) //添加控件
    })

    AMap.plugin("AMap.Scale", () => {
        var scale = new AMap.Scale()
        map.addControl(scale)
    })

    AMap.plugin("AMap.ControlBar", () => {
        var ControlBar = new AMap.ControlBar()
        map.addControl(ControlBar)
    })

    // AMap.plugin("AMap.Geolocation", () => {
    //     var Geolocation = new AMap.Geolocation()
    //     map.addControl(Geolocation)
    // })

    // AMap.plugin("AMap.HawkEye", () => {
    //     var HawkEye = new AMap.HawkEye()
    //     map.addControl(HawkEye)
    // })

    AMap.plugin("AMap.MapType", () => {
        var MapType = new AMap.MapType()
        map.addControl(MapType)
    })
}

const setupAMapClick = event => {
    console.log("AMap clicked", event)
}

const setupCurrentPosition = () =>
    new Promise((resolve, reject) => {
        if (geolocation) {
            geolocation.getCurrentPosition((status, result) => {
                if (status === "complete") {
                    // map.setZoomAndCenter(16, result.position)
                    // new AMap.Marker({ position: result.position, animation: "AMAP_ANIMATION_BOUNCE" }).setMap(map)

                    markToPosition(result.position.lng, result.position.lat)

                    resolve(result)
                } else {
                    console.warn("定位失败，使用默认位置:", result.massage)
                    reject(result.massage)
                }
            })
        }
    })

const markToPosition = (lng, lat) => {
    // Remove the existing marker if it exists
    if (marker) map.remove(marker)

    if (map) {
        map.setZoomAndCenter(16, [lng, lat])
        marker = new AMap.Marker({ position: [lng, lat], animation: "AMAP_ANIMATION_BOUNCE" })
        map.add(marker)
    }
}

const getAddressByCoords = async (lng, lat, radius = 1000, extensions = "all") => {
    const url = "https://restapi.amap.com/v3/geocode/regeo"

    const params = new URLSearchParams({ location: `${lng},${lat}`, key: AMAP_WEB_KEY, radius: radius, extensions: extensions, output: "JSON" })

    try {
        const response = await fetch(`${url}?${params}`)
        const data = await response.json()

        if (data.status === "1" && data.info === "OK") {
            // 请求成功，解析地址信息
            // const regeocode = data.regeocode
            // console.log("完整地址:", regeocode.formatted_address)
            // console.log("省/市/区:", regeocode.addressComponent)
            // console.log("附近POI:", regeocode.pois)
            return data // 返回数据给调用者
        } else {
            console.error("逆地理编码失败:", data.info)
            throw new Error(data.info)
        }
    } catch (error) {
        console.error("请求异常:", error)
        throw error
    }
}

onMounted(() => {
    setupAmap()
})

onUnmounted(() => {
    map?.destroy()
})

defineExpose({
    setupCurrentPosition,
    getAddressByCoords,
    markToPosition
})
</script>

<style scoped>
#amap-container {
    height: calc(100vh - 236px);
    width: 100%;
}
</style>
