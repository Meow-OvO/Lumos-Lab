<template>
    <div class="p-5">
        <el-row :gutter="20">
            <el-col :span="6">
                <gitCommitType />
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import gitCommitType from "./gitCommitType.vue"
</script>

<style></style>
