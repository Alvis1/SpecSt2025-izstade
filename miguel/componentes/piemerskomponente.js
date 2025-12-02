AFRAME.registerComponent('piemers', {
  schema: {
    color: {default: '#FFF'},
    size: {type: 'int', default: 5}
  },

  init: function () {
    // Apply scaling to existing geometry
    var data = this.data;
    var el = this.el;

    // Scale the existing geometry uniformly
    var scale = data.size / 5; // Normalize to size 5 as base
    el.setAttribute('scale', {
      x: scale,
      y: scale,
      z: scale
    });

    // Set the material color
    el.setAttribute('material', {
      color: data.color
    });
  },

  update: function () {
    // Update the component when properties change
    var data = this.data;
    var el = this.el;

    // Update scaling of existing geometry
    var scale = data.size / 5; // Normalize to size 5 as base
    el.setAttribute('scale', {
      x: scale,
      y: scale,
      z: scale
    });
    
    // Update material color
    el.setAttribute('material', {
      color: data.color
    });
  }
});