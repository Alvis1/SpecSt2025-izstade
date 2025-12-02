AFRAME.registerComponent('auto-hide-corridor-walls', {
  schema: {
    triggerZ: {type: 'number', default: -20}
  },

  init: function () {
    // Find the rig
    this.rig = document.querySelector('#rig');

    // Find the corridor walls by exact dimensions & position
    const allBoxes = Array.from(document.querySelectorAll('a-box'));

    this.corridorWalls = allBoxes.filter(box => {
      const w = parseFloat(box.getAttribute('width'));
      const h = parseFloat(box.getAttribute('height'));
      const d = parseFloat(box.getAttribute('depth'));
      const pos = box.getAttribute('position');

      return (
        w === 0.3 &&         // narrow
        h === 4 &&           // tall
        d === 50 &&          // long
        (pos.x === -5 || pos.x === 5) // corridor sides
      );
    });

    console.log("Corridor walls detected:", this.corridorWalls);
  },

  tick: function () {
    if (!this.rig || this.corridorWalls.length < 2) return;

    const z = this.rig.object3D.position.z;

    if (z <= this.data.triggerZ) {
      this.corridorWalls.forEach(wall => {
        wall.setAttribute('visible', false);
      });
    }
  }
});
