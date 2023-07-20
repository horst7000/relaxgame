<template>
    <v-rect :config="rectMore" @click="onClick" @tap="onClick"/>
</template>

<script setup>
import { onMounted, ref } from '@vue/runtime-core';
import { useStore } from '../store/main';

/* ---------------- props ------------------- */
/* ---------------- data -------------------- */
const store = useStore();

const rectMore = {
    x: store.width-40,
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
function onClick() {
    store.collect(1000);

    setTimeout(() => {
      store.more(20, 200);
    }, 1600)
}

/* ---------------- watchers ---------------- */


</script>

<style>
</style>