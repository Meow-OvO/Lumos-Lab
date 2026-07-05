<template>
    <div class="p-5">
        <el-card>
            <el-custom-card-title class="text-lg font-bold mb-4">
                <span>高德地图示例</span>
            </el-custom-card-title>

            <el-row class="mb-5" align="middle">
                <el-button class="mr-4" type="primary" :icon="Location" :loading="loading.setupCurrentPosition" @click="setupCurrentPosition"
                    >定位当前位置</el-button
                >
                <div class="text-[14px]">{{ markerAddress }}</div>
            </el-row>

            <amap ref="amapInstance" @map-click="AMapClick" />
        </el-card>

        <!-- <el-row :gutter="20">
            <el-col :span="10">
                <el-card>
                    <el-custom-card-title class="text-lg font-bold mb-4">高德地图示例</el-custom-card-title>


                    <el-divider></el-divider>

                    <el-button type="primary" :loading="loading.setupCurrentPosition" @click="setupCurrentPosition">定位当前位置</el-button>
                    <span>{{ markerAddress }}</span>

                    <el-divider></el-divider>
                </el-card>
            </el-col>
            <el-col :span="14">
                <el-card>
                    <amap ref="amapInstance" @map-click="AMapClick" />
                </el-card>
            </el-col>
        </el-row> -->
    </div>
</template>

<script setup>
import amap from "./amap.vue"

const markerAddress = ref("")

const loading = reactive({
    setupCurrentPosition: false
})

const amapInstance = ref(null)

const setupCurrentPosition = async () => {
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

const AMapClick = async event => {
    const res = await amapInstance.value.getAddressByCoords(event.lnglat.lng, event.lnglat.lat)
    console.log("AMapClick", res, res.regeocode.formatted_address)

    markerAddress.value = res.regeocode.formatted_address

    amapInstance.value.markToPosition(event.lnglat.lng, event.lnglat.lat)
}
</script>

<style scoped></style>
