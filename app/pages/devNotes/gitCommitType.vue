<script setup lang="ts">
import { ref } from "vue"

type commitTypeItem = {
    type: string
    desc: string
    status: "normal" | "clicked" | "error"
}

const commitType = ref<commitTypeItem[]>([
    { type: "feat", desc: "新增功能（MINOR）", status: "normal" },
    { type: "fix", desc: "修复 Bug（PATCH）", status: "normal" },
    { type: "docs", desc: "仅文档变更", status: "normal" },
    { type: "style", desc: "代码格式调整，不影响逻辑", status: "normal" },
    { type: "refactor", desc: "代码重构，不修 Bug 不加功能", status: "normal" },
    { type: "perf", desc: "性能优化", status: "normal" },
    { type: "test", desc: "添加或修改测试", status: "normal" },
    { type: "chore", desc: "杂项，不涉及业务代码", status: "normal" },
    { type: "build", desc: "构建系统或外部依赖变更", status: "normal" },
    { type: "ci", desc: "持续集成配置修改", status: "normal" },
    { type: "revert", desc: "撤销某次提交", status: "normal" },
    { type: "init", desc: "项目初始化", status: "normal" },
    { type: "i18n", desc: "国际化/多语言配置", status: "normal" }
])

const copyCommitType = async (commitType: commitTypeItem) => {
    if (commitType.status !== "normal") return

    try {
        await navigator.clipboard.writeText(commitType.type)
        commitType.status = "clicked"
    } catch (error) {
        commitType.status = "error"
    }

    setTimeout(() => (commitType.status = "normal"), 2000)
}
</script>

<template>
    <el-card class="text-[14px]">
        <el-custom-card-title> GIT 提交类型 </el-custom-card-title>

        <p v-for="item in commitType">
            <el-tag effect="dark" :class="{ 'cursor-pointer': item.status === 'normal' }" @click="copyCommitType(item)">
                <el-row>
                    <span class="mr-2">{{ item.type }}</span>
                    <Icon v-if="item.status === 'normal'" name="tabler:copy-filled" />
                    <Icon v-if="item.status === 'clicked'" name="el:ok" />
                    <Icon v-if="item.status === 'error'" name="icon-park-solid:error" />
                </el-row>
            </el-tag>

            <span>{{ item.desc }}</span>
        </p>
    </el-card>
</template>

<style scoped>
p + p {
    margin-top: 10px;
}

.el-tag {
    width: 100px;
    font-weight: 700;
    margin-right: 8px;
    font-size: 14px;
}
</style>
