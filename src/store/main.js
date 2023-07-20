import { defineStore } from "pinia";



	
function state() {
  return {
    width: 11*window.innerHeight/16,
    height: window.innerHeight,
    listAvailable: {},
    listCurrent: {},
    count: 0,
    colors: ['#8f605b', '#e6e6c6', '#c7c6c6', '#dbaca2', '#9c888a', '#dccfc7', '#84848a'],
    stroke: ['#7f504b', '#d6d6b6', '#b7b6b6', '#cb9c92', '#8c787a', '#ccbfb7', '#74747a'],
    shapes: ['Rectangle', 'Ellipse', 'Diamond'],
    unit: window.innerHeight/100,
    selected: null,
    topLayer: null,
    shapeLayer: null,
  }
}

const getters = {
  nearby: (state) => (node1, node2) => {
    return Math.abs(node1.x() - node2.x()) + Math.abs(node1.y() - node2.y()) < 15
  }
}

const actions = {
  leave(item) {
    item.moveTo(this.topLayer);
    item.to({
      x: 0,
      y: 0,
      scaleX: 0,
      scaleY: 0,
      duration: 0.6,
      onFinish: () => delete this.listCurrent[item.id()],
    })
  },

  collect(delay) {
    Object.values(this.listCurrent).forEach(item => {
      if(item.gone || item.nodes.length != 2) return
      if(this.nearby(item.nodes[0], item.nodes[1])) {
        setTimeout(() => {
          this.leave(item.nodes[0]);
          this.leave(item.nodes[1]);
        }, Math.random() * delay);
        item.gone = true;
      }
    })
  },

  more(amount = 1, delay = 0) {
    // generate random items for 'available' list
    if(Object.keys(this.listAvailable).length < 2)
          this.generate();

    // add random item from 'available' to 'current' list
    const idx = Math.floor( Math.random() * Object.keys(this.listAvailable).length )
    const key = Object.keys(this.listAvailable)[idx];
    this.listCurrent[key] = this.listAvailable[key];
    delete this.listAvailable[key];


    // delayed recursive self-call
    setTimeout(() => {
      if(amount > 1) this.more(amount - 1, delay)
    }, Math.random() * delay)
  },

  generate() {
    const colorIdx = Math.floor( Math.random() * this.colors.length );
    const shape = {
      component: this.shapes[ Math.floor( Math.random() * this.shapes.length ) ],
      color:     this.colors[ colorIdx ],
      stroke:    this.stroke[ colorIdx ],
      width:  7*this.unit + 9*this.unit * Math.random(),
      height: 7*this.unit + 4*this.unit * Math.random(),
      skew:      0.12 + 0.25 * Math.random(),
      nodes:     [],
    }

    // add generated shape twice
    this.listAvailable["s" + Math.random().toString(16).slice(2,5)] = shape;
    this.listAvailable["s" + Math.random().toString(16).slice(2,5)] = shape;
  },
}

export const useStore = defineStore('main', {
    state,
    getters,
    actions,
})