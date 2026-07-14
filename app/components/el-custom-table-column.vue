<script setup>
import { ElTableColumn } from "element-plus"
// import { omitBy, isUndefined } from "lodash-es"

defineOptions({ name: "ElCustomTableColumn", inheritAttrs: false })

const props = defineProps(ElTableColumn.props)
const emit = defineEmits(ElTableColumn.emits)

const attrs = useAttrs()
const slots = useSlots()
const instance = getCurrentInstance()

const isEmptyValue = value => lo_isUndefined(value) || value === ""
const finalAttrs = computed(() => lo_omitBy({ ...attrs, ...props }, isEmptyValue))

const eventListeners = computed(() => {
    const result = {}
    const propsData = instance?.vnode?.props || {}

    Object.keys(propsData).forEach(key => {
        if (key.startsWith("on") && typeof propsData[key] === "function") {
            const eventName = key.slice(2).toLowerCase()
            result[eventName] = propsData[key]
        }
    })

    return result
})
</script>

<template>
    <el-table-column v-bind="{ align: 'center', 'min-width': '120', ...finalAttrs }" v-on="eventListeners">
        <template v-for="(_, slotName) in slots" #[slotName]="slotData">
            <slot :name="slotName" v-bind="slotData" />
        </template>
    </el-table-column>
</template>
