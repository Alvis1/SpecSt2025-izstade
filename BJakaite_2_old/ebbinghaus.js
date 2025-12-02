AFRAME.registerComponent('ebbinghaus', {
  schema: {
    type: {default: 'large'}  // large or small
  },

  init: function () {
    const el = this.el;
    const type = this.data.type;

    // --- Central orange sphere (static) ---
    this.center = this.makeSphere(el, "#cc7a2b", 0.35, 0, 0, 0);

    // --- Surrounding spheres ---
    const groups = {
      large: {
        radius: 0.8,
        ringRadius: 1.4,
        count: 6
      },
      small: {
        radius: 0.25,
        ringRadius: 0.9,
        count: 8
      }
    };

    const g = groups[type];
    this.surrounding = [];

    // Create rotating group wrapper
    this.ring = document.createElement("a-entity");
    el.appendChild(this.ring);

    // Add spheres around the orange one
    for (let i = 0; i < g.count; i++) {
      const angle = (i / g.count) * Math.PI * 2;

      const x = Math.cos(angle) * g.ringRadius;
      const y = Math.sin(angle) * g.ringRadius;

      const s = this.makeSphere(this.ring, "#8b97ab", g.radius, x, y, 0);
      this.surrounding.push(s);
    }

    // Add animation to rotate the entire ring
    this.ring.setAttribute("animation", {
      property: "rotation",
      to: "0 0 360",
      loop: true,
      dur: 8000,
      easing: "linear"
    });
  },

  makeSphere(parent, color, radius, x, y, z) {
    const s = document.createElement("a-sphere");
    s.setAttribute("color", color);
    s.setAttribute("radius", radius);
    s.setAttribute("position", `${x} ${y} ${z}`);
    parent.appendChild(s);
    return s;
  }
});
