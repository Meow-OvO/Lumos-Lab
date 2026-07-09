<template>
    <div class="p-5">
        <!-- <el-card>
            <el-custom-card-title class="text-lg font-bold mb-4">
                <span>高德地图示例</span>
            </el-custom-card-title>

            <el-row class="mb-5" align="middle">
                <el-button class="mr-4" type="primary" :icon="Location" :loading="loading.setupCurrentPosition" @click="setupCurrentPosition"
                    >定位当前位置</el-button
                >
                <div class="text-[14px]">{{ markerAddress }}</div>
            </el-row>

            <amap ref="amapInstance" @map-click="AMapMarkChange" />
        </el-card> -->

        <el-row :gutter="20">
            <el-col :span="10">
                <el-card>
                    <el-custom-card-title>高德地图示例</el-custom-card-title>

                    <el-scrollbar height="calc(100vh - 180px)">
                        <p class="text-sm mb-3">🌐 根据浏览器位置信息定位 , 或者点击地图定位</p>

                        <el-button type="primary" :icon="Location" class="mr-3" :loading="loading.setupCurrentPosition" @click="setupCurrentPosition"
                            >定位当前位置</el-button
                        >
                        <span class="text-sm text-gray-500 font-bold">{{ markerAddress }}</span>

                        <el-divider :style="{ margin: '18px 0 14px' }"></el-divider>

                        <p class="text-sm mb-3">🔍 地点搜索</p>

                        <el-row align="middle">
                            <poi-select v-model="poiSearch.selectedPoi" class="mr-5" :style="{ width: '200px' }" />

                            <el-button type="primary" :icon="Location" :disabled="loading.setupCurrentPosition" @click="markToSelectedPoi"
                                >定位到所选位置</el-button
                            >
                        </el-row>

                        <el-divider :style="{ margin: '18px 0 14px' }"></el-divider>

                        <p class="text-sm mb-3">🗺️ 路线规划</p>

                        <p class="text-sm mb-3">选择起点和终点 , 然后点击“规划驾车路线”按钮</p>

                        <el-row class="mb-3" align="middle">
                            <Icon name="mingcute:location-line" class="mr-1"></Icon>
                            <span class="text-sm mr-3">起点</span>
                            <poi-select v-model="routeStartPoi" :style="{ width: '200px' }" />
                        </el-row>

                        <el-row class="mb-3" align="middle">
                            <Icon name="mingcute:location-line" class="mr-1"></Icon>
                            <span class="text-sm mr-3">终点</span>
                            <poi-select v-model="routeEndPoi" :style="{ width: '200px' }" />
                        </el-row>

                        <el-button
                            type="primary"
                            :disabled="loading.setupCurrentPosition || !routeStartPoi.location || !routeEndPoi.location"
                            :icon="Guide"
                            @click="
                                amapInstance.setupDrivingRoute(
                                    routeStartPoi.location.split(',')[0],
                                    routeStartPoi.location.split(',')[1],
                                    routeEndPoi.location.split(',')[0],
                                    routeEndPoi.location.split(',')[1]
                                )
                            "
                            >规划驾车路线</el-button
                        >
                    </el-scrollbar>
                </el-card>
            </el-col>
            <el-col :span="14">
                <el-card>
                    <amap ref="amapInstance" @mark-change="AMapMarkChange" />
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import amap from "./amap.vue"
import poiSelect from "./poiSelect.vue"

const AMAP_JS_KEY = "eb469a90dd8476c0cf8210006d25afc3"
const AMAP_WEB_KEY = "930ed13b65a9685b396b5b117d98b67a"
const AMAP_SECURITY_JS_CODE = "75786255f35fa7e3680556c0b5d12516"

const markerAddress = ref("")

const loading = reactive({ setupCurrentPosition: false })

const poiSearch = reactive({ selectedPoi: "" })

const routeStartPoi = ref("")
const routeEndPoi = ref("")

const amapInstance = ref(null)

const setupCurrentPosition = async () => {
    // markerAddress.value = address
    poiSearch.selectedPoi = ""

    let coordsRes = null
    loading.setupCurrentPosition = true

    try {
        if (amapInstance.value) coordsRes = await amapInstance.value.setupCurrentPosition()

        const addressRes = await amapInstance.value.getAddressByCoords(coordsRes.position.lng, coordsRes.position.lat)
        markerAddress.value = addressRes.regeocode.formatted_address
        loading.setupCurrentPosition = false
    } catch (error) {
        ElMessage.error("定位失败，请检查浏览器是否允许定位或网络是否正常")
        loading.setupCurrentPosition = false
    }
}

const AMapMarkChange = async address => {
    markerAddress.value = address
    poiSearch.selectedPoi = ""

    // const res = await amapInstance.value.getAddressByCoords(event.lnglat.lng, event.lnglat.lat)
    // console.log("AMapMarkChange", res, res.regeocode.formatted_address)

    // markerAddress.value = res.regeocode.formatted_address

    // amapInstance.value.markToPosition(event.lnglat.lng, event.lnglat.lat)
}

const markToSelectedPoi = () => {
    if (!(poiSearch.selectedPoi && poiSearch.selectedPoi.location)) return
    const [lng, lat] = poiSearch.selectedPoi.location.split(",").map(Number)
    amapInstance.value.markToPosition(lng, lat)
    markerAddress.value = poiSearch.selectedPoi.address

    // }

    // console.log("Selected POI:", poiSearch.selectedPoi.address)
}
</script>

<style scoped></style>
