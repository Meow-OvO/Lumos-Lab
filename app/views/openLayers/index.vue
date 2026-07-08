<!-- pages/index.vue -->
<template>
    <div>
        <h1
            style="
                position: absolute;
                top: 20px;
                left: 20px;
                z-index: 1000;
                background: rgba(255, 255, 255, 0.9);
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 16px;
                margin: 0;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                pointer-events: none;
            "
        >
            🗺️ 应急GIS演示 - OpenLayers + 高德地图
        </h1>
        <gisMap />
    </div>
</template>

<script setup lang="ts">
import gisMap from "./gisMap.vue"
</script>
