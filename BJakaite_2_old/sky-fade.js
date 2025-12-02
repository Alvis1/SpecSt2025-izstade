AFRAME.registerComponent('sky-fade', {
  schema: {
    zTrigger: {default: -20},     // yellow cube Z position
    fadeSpeed: {default: 0.02}    // how fast sky fades in
  },

  init: function () {
    this.skyBright = document.querySelector('#skyBright');
    this.skyDark = document.querySelector('#skyDark');
    this.opacity = 0; // start transparent
  },

  tick: function () {
    const rig = document.querySelector('#rig');
    const z = rig.object3D.position.z;

    if (z < this.data.zTrigger && this.opacity < 1) {
      // Fade in bright sky
      this.opacity += this.data.fadeSpeed;
      if (this.opacity > 1) this.opacity = 1;

      this.skyBright.setAttribute('material', 'opacity', this.opacity);
      this.skyDark.setAttribute('material', 'opacity', 1 - this.opacity);
    }
  }
});
