<template>
<div id="canvasContainer">
    <v-stage :config="configKonva"
      @mousedown="handleMousedown"
      @touchstart="handleTouchstart"
      @dragstart ="handleDragstart"
      @dragend="handleDragend">
        <v-layer>
            <BtnMore/>
            <BtnCollection/>
        </v-layer>
        <v-layer ref="shapeLayer">
            <TransitionGroup :css="false" :duration="5000">
                <SuperShape
                    v-for="(item,key) in store.listCurrent"
                    :key="key"
                    :id="key"
                    />
            </TransitionGroup>
        </v-layer>
        <v-layer ref="topLayer"></v-layer>
    </v-stage>
</div>
</template>

<script setup>
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
const dragItemId = ref(null);
const topLayer  = ref(null);
const shapeLayer = ref(null);

/* ---------------- computed ---------------- */
/* ---------------- functions --------------- */

// mouse
function handleMousedown(e) {
    const group = e.target.parent;
    if(!group || !group.id()) { 
        store.selected = null;
        return
    }
    
    group.moveTo(topLayer.value.getNode());
    group.startDrag();

    // catch click (mouseup on same position; doesnt trigger 'dragend' event or
    // 'mouseup' event on dragged target, therefore stopDrag manually)
    const stopDrag = function(windowEvent) {
        if(windowEvent.x == e.evt.x && windowEvent.y == e.evt.y)
            group.stopDrag();
        window.removeEventListener("mouseup",stopDrag);
    }
    window.addEventListener("mouseup", stopDrag);
}

// touch
function handleTouchstart(e) {
    const group = e.target.parent;
    if(!group || !group.id()) { 
        store.selected = null;
        return
    }

    let touchend = false;

    group.moveTo(topLayer.value.getNode());
    group.startDrag();
    
    // catch tap (touchend on same position; doesnt trigger 'dragend' event or
    // 'touchend' event on dragged target, therefore stopDrag manually)
    const stopDrag = function(windowEvent) {
        if(windowEvent.x == e.evt.x && windowEvent.y == e.evt.y)
            group.stopDrag();
        touchend = true;
        window.removeEventListener("touchend",stopDrag);
    }
    window.addEventListener("touchend", stopDrag);
}

function handleDragstart(e) { // e is group
    if(!e.target.id()) return
    
    // save drag element:
    dragItemId.value = e.target.id();
    store.selected = dragItemId.value;
    // move current element to the top:
    const item = store.listCurrent[dragItemId.value];
    // delete store.listCurrent[dragItemId.value];
    // store.listCurrent[dragItemId.value] = item;
}

function handleDragend(e) {
    dragItemId.value = null;
    const layer = shapeLayer.value.getNode();
    
    // move to big layer
    e.target.moveTo(layer);

    // move to nearest position
    let nearest;
    let dist = Infinity;
    let d = 0;
    layer.children.forEach(c => {
        d = Math.abs(c.x() - e.target.x()) + Math.abs(c.y() - e.target.y());

        if(c.id() != e.target.id() && d < dist) {
                nearest = c;
                dist    = d;                
        }
    });

    if(dist < 12)
        e.target.to({
            x: nearest.x() - 0.5 * store.unit,
            y: nearest.y() - 0.5 * store.unit,
            duration: 0.04,
        })
}

/* ---------------- watchers ---------------- */
onMounted(() => {
    store.shapeLayer = shapeLayer.value.getNode();
    store.topLayer   = topLayer.value.getNode();
    
    store.more(20, 100);
})
</script>

<style>
</style>