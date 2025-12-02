AFRAME.registerComponent('expand-light-after', {
  schema: {
    zThreshold: {default: -20},   // the yellow cube Z position
    newDistance: {default: 80}    // how far the light should reach after passing it
  },

  tick: function () {
    const rig = document.querySelector('#rig');
    const light = document.querySelector('#camLight');

    if (!rig || !light) return;

    const z = rig.object3D.position.z;

    if (z < this.data.zThreshold) {
      light.setAttribute('distance', this.data.newDistance);
    }
  }
});
