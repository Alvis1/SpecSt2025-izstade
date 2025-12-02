AFRAME.registerComponent('forward-back', {
  init() {
    this.speed = 0.1;
    this.keys = {};
    this.freeMovement = false;
    this.startPosition = new THREE.Vector3(0, 1.6, 0);
    this.startRotation = new THREE.Euler(0, 0, 0, 'YXZ');
    this.hasLeftStartZone = false;

    this.cameraEl = this.el.querySelector('[camera]');
    this.el.object3D.position.copy(this.startPosition);
    this.el.object3D.rotation.copy(this.startRotation);

    if (this.cameraEl) {
      this.cameraEl.object3D.rotation.copy(this.startRotation);
      this.cameraEl.setAttribute('look-controls', 'enabled', false);
      this.cameraEl.object3D.updateMatrixWorld(true);
    }

    window.addEventListener('keydown', e => (this.keys[e.code] = true));
    window.addEventListener('keyup', e => (this.keys[e.code] = false));
  },

  tick() {
    const pos = this.el.object3D.position;
    const moveSpeed = this.speed;

    // Leave start zone check
    if (pos.z < -1) this.hasLeftStartZone = true;

    // --- Unlock near the yellow cube ---
    if (pos.z <= -58 && !this.freeMovement && this.hasLeftStartZone) {
      this.freeMovement = true;

      if (this.cameraEl) {
        // reset look direction before enabling controls
        this.cameraEl.object3D.rotation.copy(this.startRotation);
        this.cameraEl.object3D.updateMatrixWorld(true);

        // re-enable look-controls cleanly
        this.cameraEl.removeAttribute('look-controls');
        this.cameraEl.setAttribute('look-controls', 'enabled: true');
      }
    }

    // --- Snap back and reset near the red cube ---
    if (this.freeMovement && pos.z > 2 && Math.abs(pos.x) < 1) {
      this.el.object3D.position.copy(this.startPosition);
      this.el.object3D.rotation.copy(this.startRotation);

      if (this.cameraEl) {
        // Reset orientation completely and disable look-controls cleanly
        this.cameraEl.removeAttribute('look-controls');
        this.cameraEl.object3D.rotation.copy(this.startRotation);
        this.cameraEl.object3D.updateMatrixWorld(true);
        this.cameraEl.setAttribute('look-controls', 'enabled: false');
      }

      this.keys = {};
      this.freeMovement = false;
      this.hasLeftStartZone = false;
      this.el.object3D.position.z = 1.5;
    }

    // --- Direction vectors based on camera facing ---
    if (!this.cameraEl) return;
    let forwardDir = new THREE.Vector3();
    this.cameraEl.object3D.getWorldDirection(forwardDir);
    forwardDir.y = 0;
    forwardDir.normalize();

    let rightDir = new THREE.Vector3();
    rightDir.crossVectors(new THREE.Vector3(0, 1, 0), forwardDir).normalize();

    // --- Movement controls ---
    if (this.keys['KeyW']) pos.addScaledVector(forwardDir, -moveSpeed); // forward
    if (this.keys['KeyS']) pos.addScaledVector(forwardDir, moveSpeed);  // backward

    if (this.freeMovement) {
      if (this.keys['KeyA']) pos.addScaledVector(rightDir, -moveSpeed); // left
      if (this.keys['KeyD']) pos.addScaledVector(rightDir, moveSpeed);  // right
    }
  }
});
