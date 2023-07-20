<template>
    <v-rect :config="rectCollection"/>
</template>

<script setup>
/* ---------------- props ------------------- */
/* ---------------- data -------------------- */
const rectCollection = {
    x: 0,
    y: 5,
    width: 40,
    height: 40,
    fill: 'yellow',
    stroke: 'black',
    strokeWidth: 4,
}
/* ---------------- refs -------------------- */
/* ---------------- computed ---------------- */
/* ---------------- functions --------------- */
/* ---------------- watchers ---------------- */
</script>

<style>
</style>