<template>
  <div>
    <v-stage
      ref="stage"
      :config="configKonva"
      @dragstart="handleDragstart"
      @dragend="handleDragend"
    >
      <v-layer ref="layer">
        <super-shape
          v-for="item in store.listCurrent"
          :key="item.id"
          :item="item"
        ></super-shape>
      </v-layer>
      <v-layer>
          <BtnMore/>
          <BtnCollection/>
      </v-layer>
    </v-stage>
  </div>
  <div>
      <p v-for="(item, key) in store.listAvailable" :key="key">{{ item }}</p>
  </div>
</template>

<script setup>
import SuperShape from '../components/SuperShape.vue';
import BtnMore from '../components/BtnMore.vue';
import BtnCollection from '../components/BtnCollection.vue';
import { onMounted, ref } from '@vue/runtime-core';
import { useStore } from '../store/main';
/* ---------------- props ------------------- */

/* ---------------- data -------------------- */
const width = window.innerWidth;
const height = window.innerHeight;
const configKonva = {
    width: width,
    height: height/2
}
const store = useStore();


/* ---------------- refs -------------------- */
const dragItemId = ref(null);

/* ---------------- computed ---------------- */
/* ---------------- functions --------------- */
let z = 0;
function handleDragstart(e) {
    // save drag element:
    dragItemId.value = e.target.id();
    // move current element to the top:
    const item = store.listCurrent.find(i => i.id === dragItemId.value);
    const index = store.listCurrent.indexOf(item);
    e.target.zIndex(++z);
    console.log(item);
    store.listCurrent.splice(index, 1);
    store.listCurrent.push(item);
}
function handleDragend(e) {
    dragItemId.value = null;
}
/* ---------------- watchers ---------------- */
onMounted(() => {
    store.more();
})
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
