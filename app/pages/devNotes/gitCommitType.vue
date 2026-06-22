<template>
    <el-card class="text-[14px]">
        <el-custom-card-title> GIT 提交类型 </el-custom-card-title>

        <p>
            <el-tag effect="dark">feat</el-tag>
            新增功能（MINOR）
        </p>
        <p>
            <el-tag effect="dark">fix</el-tag>
            修复 Bug（PATCH）
        </p>
        <p>
            <el-tag effect="dark">docs</el-tag>
            仅文档变更
        </p>
        <p>
            <el-tag effect="dark">style</el-tag>
            代码格式调整，不影响逻辑
        </p>
        <p>
            <el-tag effect="dark">refactor</el-tag>
            代码重构，不修 Bug 不加功能
        </p>
        <p>
            <el-tag effect="dark">perf</el-tag>
            性能优化
        </p>
        <p>
            <el-tag effect="dark">test</el-tag>
            添加或修改测试
        </p>
        <p>
            <el-tag effect="dark">chore</el-tag>
            杂项，不涉及业务代码
        </p>
        <p>
            <el-tag effect="dark">build</el-tag>
            构建系统或外部依赖变更
        </p>
        <p>
            <el-tag effect="dark">ci</el-tag>
            持续集成配置修改
        </p>
        <p>
            <el-tag effect="dark">revert</el-tag>
            撤销某次提交
        </p>
        <p>
            <el-tag effect="dark">init</el-tag>
            项目初始化（部分团队）
        </p>
        <p>
            <el-tag effect="dark">i18n</el-tag>
            国际化/多语言配置（部分团队）
        </p>
    </el-card>
</template>

<script lang="ts" setup></script>

<style scoped>
p + p {
    margin-top: 10px;
}

.el-tag {
    width: 80px;
    font-weight: 700;
    margin-right: 8px;
}
</style>
