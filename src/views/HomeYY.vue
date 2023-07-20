<template>
<div id="canvasContainer"></div>
</template>

<script setup>
import Konva from 'konva'
import { ref } from '@vue/reactivity';
import SuperShape from '../components/SuperShape.vue';
import BtnMore from '../components/BtnMore.vue';
import BtnCollection from '../components/BtnCollection.vue';
import { useStore } from '../store/main';
import { onMounted } from '@vue/runtime-core';

/* ---------------- props ------------------- */
/* ---------------- data -------------------- */
const store = useStore();

const configKonva = {
    width: store.width,
    height: store.height,
}


/* ---------------- refs -------------------- */
/* ---------------- computed ---------------- */
/* ---------------- functions --------------- */
let z = 0;
function handleDragstart(e) {
      e.target.moveToTop();
}

function handleDragend(e) {
}

/* ---------------- watchers ---------------- */
onMounted(() => {
    var stage = new Konva.Stage({
        container: 'canvasContainer',
        width: 11*window.innerHeight/16,
        height: window.innerHeight,
    });

    stage.on("dragstart", handleDragstart);

    var layer = new Konva.Layer();

    for (let i = 0; i < 20; i++) {        
        var star = new Konva.Star({
            x: 2*i + stage.width() / 2,
            y: 2*i + stage.height() / 2,
            numPoints: 6,
            innerRadius: 40,
            outerRadius: 70,
            fill: 'yellow',
            stroke: 'black',
            strokeWidth: 4,
            draggable: true,
            shadowOffset: { x: 10, y: 10 },
            shadowForStrokeEnabled: false,
            shadowOpacity: 0.5,
        });
        // add the shape to the layer
        layer.add(star);
    }


    // add the layer to the stage
    stage.add(layer);
})
</script>

<style>
</style>