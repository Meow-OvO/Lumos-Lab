<template>
    <el-row align="middle" justify="center">
        <span v-if="!showOriginal">{{ maskedPhone }}</span>
        <span v-else>{{ rawPhone }}</span>

        <Icon @click="toggleVisibility" :name="showOriginal ? 'mdi:eye-off' : 'mdi:eye'" size="16" class="cursor-pointer ml-1" />
    </el-row>
</template>

<script setup>
const maskPhone = phone => {
    const str = String(phone).replace(/\s/g, "")
    if (!str || str.length < 7) return "****"
    const head = str.slice(0, 3)
    const tail = str.slice(-4)
    return `${head}****${tail}`
}

const props = defineProps({
    phone: { type: [String, Number], default: "", required: true },
    defaultShow: { type: Boolean, default: false }
})

const showOriginal = ref(props.defaultShow)

const rawPhone = computed(() => String(props.phone).replace(/\s/g, ""))

const maskedPhone = computed(() => maskPhone(props.phone))

const toggleVisibility = () => {
    showOriginal.value = !showOriginal.value
}

defineExpose({ showOriginal, toggleVisibility })
</script>

<style scoped></style>
