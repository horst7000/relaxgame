<template>
    <v-group :config="confGroup">
        <v-rect   v-if="isSelected" :config="confHelperRect"/>
        <v-circle v-if="isSelected" :config="confHelperCirc"/>
            <v-rect    v-if="item.component == 'Rectangle'"     ref="shapeEl"  :config="conf"/>
            <v-ellipse v-else-if="item.component == 'Ellipse'"  ref="shapeEl"  :config="conf"/>
            <v-rect    v-else-if="item.component == 'Diamond'"  ref="shapeEl"  :config="conf"/>
    </v-group>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from '@vue/runtime-core';
import Konva from 'konva';
import { useStore } from '../store/main';

/* ---------------- props ------------------- */
const props = defineProps({ id: String })

/* ---------------- data -------------------- */
const store = useStore();
const item = store.listCurrent[props.id];
const isEllipse = (item.component == 'Ellipse')
const isRect = (item.component == 'Rectangle')
const isDia = (item.component == 'Diamond')

const confEllipse = {
    radiusX: item.width * 0.5,
    radiusY: item.height * 0.5,
}
    
const confRectangle = {
    width: item.width,
    height: item.height,
    cornerRadius: store.unit,
}

const confDiamond = {
    width: item.height * 0.85,
    height: item.height * 0.85,
    cornerRadius: store.unit,
}

const confGroup = {
    x: store.width * ( 0.1 + Math.random() * 0.68),
    y: store.height * ( 0.1 + Math.random() * 0.68),
    id: props.id,
}

const confHelperRect = {
    x: -5 + (isRect ? item.width / 2 :
            isEllipse ? 0 :
            isDia ? 0 : null),
    y:  isRect ? item.height :
        isEllipse ? item.height / 2 :
        isDia ? item.height * (1.12+item.skew) : null,
    fill: 'white',
    width: 10,
    height: 50,
    opacity: 0.5,
    cornerRadius: 2,
}

const confHelperCirc = {
    x: confHelperRect.x + confHelperRect.width/2,
    y: confHelperRect.y + confHelperRect.height + 14,
    fill: 'white',
    radius: 15,
    opacity: 0.5,
}

/* ---------------- refs -------------------- */
const shapeEl = ref(null);

/* ---------------- computed ---------------- */
const conf = computed(() => {
    const confCommon = {
        fill: item.color,
        stroke: item.stroke,
        strokeWidth: store.unit,
        shadowOffset: { x: 10, y: 10 },
        shadowOpacity: 0.5,
        shadowForStrokeEnabled: false,
        perfectDrawEnabled: false,
        hitStrokeWidth: 0,
        scale: {x: 1, y: 0},
        rotation: 15,
    }
    return Object.assign(confCommon, 
        isEllipse ? confEllipse :
        isRect ? confRectangle :
        isDia ? confDiamond : null
    )
})

const isSelected = computed(() => {
    return store.selected == props.id
})

/* ---------------- functions --------------- */
/* ---------------- watchers ---------------- */
onMounted(() => {
    const node = shapeEl.value.getNode();
    if(isDia) node.skew({ x: item.skew, y: item.skew });

    // save group in store list
    item.nodes.push(node.parent);
    node.parent.moveTo(store.topLayer);

    node.to({
        scaleX: 1,
        scaleY: 1,
        duration: 0.3,
        rotation: isDia ? 45 : 0,
        easing: Konva.Easings.BackEaseOut,
        onFinish: () => node.parent.moveTo(store.shapeLayer),
    })
})
</script>

<style>
</style>