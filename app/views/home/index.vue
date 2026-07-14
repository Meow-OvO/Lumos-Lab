<script setup lang="ts">
import libsJson from "./libs.json"
import toolsJson from "./tools.json"

const env = process.env.NODE_ENV
const config = useRuntimeConfig()

const libs = reactive({ keyword: "", list: libsJson })

const tools = reactive({ keyword: "", list: toolsJson })

const filteredLibsList = computed(() => {
    const keyword = libs.keyword.trim().toLowerCase()
    if (!keyword) return libs.list
    return libs.list.filter(item => {
        return Object.values(item).some(value => {
            if (typeof value === "string") return value.toLowerCase().includes(keyword)
            return String(value).toLowerCase().includes(keyword)
        })
    })
})

const filteredToolsList = computed(() => {
    const keyword = tools.keyword.trim().toLowerCase()
    if (!keyword) return tools.list
    return tools.list.filter(item => {
        return Object.values(item).some(value => {
            if (typeof value === "string") return value.toLowerCase().includes(keyword)
            return String(value).toLowerCase().includes(keyword)
        })
    })
})
</script>

<template>
    <div class="p-3">
        <el-row :gutter="12">
            <el-col :span="6">
                <el-card>
                    <el-custom-card-title>关于这个模板 ✨❤️🎉</el-custom-card-title>

                    <p class="text-[14px] mb-4">🚀 感谢您使用 Lomos Lab , 这是一个个人作品集项目 , 同时也是一套可复用的前端启动配置 .</p>

                    <p class="text-[14px] mb-4">
                        🧩 选择 Nuxt 4 , Element Plus 和 Pinia 作为基础栈 , 配置集中在 nuxt.config 中 , 精简且克制 . 路由层面使用 router.options.ts
                        接管默认的文件路由 , 页面相关的组件 , 方法 , worker 与页面放在同一目录下 , components/ 只存放与业务完全无关的公共组件 . 这样做的原因是 ,
                        当业务发生变化时 , 修改范围被限制在单个页面文件夹内 , 搜索和定位逻辑不需要跨目录查找 , 代码的可读性和可维护性不会随着项目膨胀而下降 .
                    </p>

                    <p class="text-[14px] mb-4">
                        🎨 样式方面 , 不通过全局覆盖去调整组件库的默认表现 . 默认 Layout 就是干净的画布 , 不需要额外建 blank.vue ; 导航独立封装在单独的 layout
                        中 , 页面从零开始时无需额外的心智负担 . 业务会变 , 全局覆盖的代价是每一次变化都可能需要额外的覆写去抵消之前的覆写 . 保持样式来源清晰 ,
                        意味着长期维护时调整成本更低 .
                    </p>

                    <p class="text-[14px] mb-4">
                        ⚙️ 配置层面的修改都经过取舍 , 非必要不介入全局行为 , 不修改原型链 , 不污染 window , 不强制 UI 风格 . 只有在长期验证后确认有必要时 ,
                        才会做例外处理 .
                    </p>

                    <p class="text-[14px]">
                        🛠️ 开发体验方面 , 已配置 Prettier , EditorConfig 和 VS Code 工作区设置 , 保存即格式化 . 端口与启动指令已预设 , 无需额外配置 .
                    </p>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card>
                    <el-custom-card-title>开发文档地址</el-custom-card-title>

                    <el-input v-model="libs.keyword" class="mb-4" placeholder="输入关键字筛选" clearable></el-input>

                    <el-scrollbar height="calc(100vh - 252px)">
                        <template v-for="(item, index) in filteredLibsList">
                            <el-divider v-if="index" :style="{ margin: '10px 0' }"></el-divider>

                            <el-link underline="never" :href="item.documentUrl" target="_blank">
                                <div class="libs-item-grid">
                                    <Icon
                                        :name="item.icon"
                                        :style="{
                                            'grid-row': '1 / 3',
                                            'justify-self': 'center',
                                            'max-width': '24px',
                                            'max-height': '24px',
                                            width: '100%',
                                            height: '100%',
                                            color: item.color
                                        }"
                                    />

                                    <span class="pl-1 font-bold text-ellipsis text-nowrap overflow-hidden" :title="item.packageName">{{
                                        item.packageName
                                    }}</span>

                                    <span class="pl-1 text-ellipsis text-nowrap overflow-hidden text-[12px]" :title="item.documentUrl">{{
                                        item.documentUrl
                                    }}</span>
                                </div>
                            </el-link>
                        </template>
                    </el-scrollbar>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card>
                    <el-custom-card-title>辅助工具地址</el-custom-card-title>

                    <el-input v-model="tools.keyword" class="mb-4" placeholder="输入关键字筛选" clearable></el-input>

                    <el-scrollbar height="calc(100vh - 252px)">
                        <template v-for="(item, index) in filteredToolsList">
                            <el-divider v-if="index" :style="{ margin: '10px 0' }"></el-divider>

                            <el-link underline="never" :href="item.toolUrl" target="_blank">
                                <div class="tools-item-grid">
                                    <Icon
                                        :name="item.icon"
                                        :style="{
                                            'grid-row': '1 / 3',
                                            'justify-self': 'center',
                                            'max-width': '24px',
                                            'max-height': '24px',
                                            width: '100%',
                                            height: '100%',
                                            color: item.color
                                        }"
                                    />

                                    <span class="pl-1 font-bold text-ellipsis text-nowrap overflow-hidden" :title="item.toolName">{{ item.toolName }}</span>

                                    <span class="pl-1 text-ellipsis text-nowrap overflow-hidden text-[12px]" :title="item.toolUrl">{{ item.toolUrl }}</span>
                                </div>
                            </el-link>
                        </template>
                    </el-scrollbar>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card class="mb-3">
                    <el-custom-card-title>联系方式</el-custom-card-title>

                    <div class="text-[14px]">
                        <p class="mb-2">
                            本应用的任何问题 , 或者希望在本应用中看到任何内容 , 可以提 issue 给我 , 也许不一定能及时实现 , 但每一条我都会认真查阅 .
                        </p>

                        <p class="mb-1">
                            <strong>代码仓库: </strong>

                            <a href="https://github.com/Meow-OvO/Lumos-Lab" class="underline" target="blank">https://github.com/Meow-OvO/Lumos-Lab</a>
                        </p>
                    </div>
                </el-card>

                <el-card class="mb-3">
                    <el-custom-card-title>关于应用</el-custom-card-title>

                    <div class="text-[14px]">
                        <p class="mb-2">
                            🕗
                            <strong>构建时间: </strong>
                            {{ config.public.buildTime }}
                        </p>

                        <p class="mb-2">
                            🌳
                            <strong>当前环境: </strong>
                            {{ env }}
                        </p>
                    </div>
                </el-card>

                <el-card class="mb-3">
                    <el-custom-card-title>已经完成的内容</el-custom-card-title>

                    <el-tag type="primary" effect="dark">手动路由行为</el-tag>
                    <el-tag type="primary" effect="dark">导航layout</el-tag>
                    <el-tag type="primary" effect="dark">github page部署</el-tag>
                    <el-tag type="primary" effect="dark">百万级数据 Echarts</el-tag>
                    <el-tag type="primary" effect="dark">构建时间打标</el-tag>
                </el-card>

                <el-card>
                    <el-custom-card-title>正在规划中的内容</el-custom-card-title>

                    <el-tag type="primary" effect="dark">NavTab标签导航</el-tag>
                    <el-tag type="primary" effect="dark">SPA的页面手动刷新</el-tag>
                    <el-tag type="primary" effect="dark">GIS</el-tag>
                    <el-tag type="primary" effect="dark">国内外地图调用</el-tag>
                    <el-tag type="primary" effect="dark">国内访问地址</el-tag>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
.libs-item-grid,
.tools-item-grid {
    display: grid;
    grid-template-columns: 36px 1fr;
    grid-template-rows: 1fr 1fr;
    align-items: center;
    /* gap: 10px; */
    /* height: 300px; */
}

.el-tag {
    margin-bottom: 12px;
    margin-right: 12px;
}
</style>
