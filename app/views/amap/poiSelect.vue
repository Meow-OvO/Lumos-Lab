<script setup>
const amapStore = useAmapStore()

const props = defineProps({ loading: { type: Boolean, default: false } })

const selectedPoi = defineModel({ type: [Object, String], default: () => "" })

const poiSearch = reactive({ selectedPoi: selectedPoi, poiList: [] })

const remotePoiSearchMethod = async query => {
    if (!query.trim()) return

    const url = "https://restapi.amap.com/v5/place/text"

    const params = new URLSearchParams({ key: amapStore.AMAP_WEB_KEY, keywords: query })

    try {
        const response = await fetch(`${url}?${params}`)
        const data = await response.json()

        // console.log("POI搜索结果:", data)

        poiSearch.poiList = data.pois
    } catch (error) {
        console.error("poi-select 组件请求异常:", error)
    }
}
</script>

<template>
    <el-select
        v-model="selectedPoi"
        :disabled="props.loading"
        filterable
        remote
        :remote-method="remotePoiSearchMethod"
        value-key="id"
        placeholder="请输入关键字搜索POI"
    >
        <el-option v-for="poi in poiSearch.poiList" :key="poi.id" :label="`${poi.name}`" :value="poi">
            <span class="mr-2">{{ poi.name }}</span>
            <span class="text-gray-300 text-[12px]">{{ poi.address }}</span>
        </el-option>
    </el-select>
</template>
