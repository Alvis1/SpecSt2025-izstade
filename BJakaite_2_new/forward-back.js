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

    // ---- Leave start zone ----
    if (pos.z < -1) this.hasLeftStartZone = true;

// ⭐ Corridor walls disappear EXACTLY when visually reaching the yellow cube
if (pos.z < -55 && pos.z <= 40) {
  const leftWall  = document.getElementById("corridor-left");
  const rightWall = document.getElementById("corridor-right");

  if (leftWall)  leftWall.setAttribute("visible", "false");
  if (rightWall) rightWall.setAttribute("visible", "false");
}


    // ---- Unlock free movement near the yellow cube (original logic) ----
    if (pos.z <= -60 && !this.freeMovement && this.hasLeftStartZone) {
      this.freeMovement = true;

      if (this.cameraEl) {
        this.cameraEl.object3D.rotation.copy(this.startRotation);
        this.cameraEl.object3D.updateMatrixWorld(true);
        this.cameraEl.removeAttribute('look-controls');
        this.cameraEl.setAttribute('look-controls', 'enabled: true');
      }
    }

    // ---- Snap player back near red cube after exploring ----
    if (this.freeMovement && pos.z > 2 && Math.abs(pos.x) < 1) {
      this.el.object3D.position.copy(this.startPosition);
      this.el.object3D.rotation.copy(this.startRotation);

      if (this.cameraEl) {
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

    // ---- Calculate movement vectors ----
    if (!this.cameraEl) return;

    let forwardDir = new THREE.Vector3();
    this.cameraEl.object3D.getWorldDirection(forwardDir);
    forwardDir.y = 0;
    forwardDir.normalize();

    let rightDir = new THREE.Vector3();
    rightDir.crossVectors(new THREE.Vector3(0, 1, 0), forwardDir).normalize();

    // ---- Keyboard movement ----
    if (this.keys['KeyW']) pos.addScaledVector(forwardDir, -moveSpeed);
    if (this.keys['KeyS']) pos.addScaledVector(forwardDir, moveSpeed);

    if (this.freeMovement) {
      if (this.keys['KeyA']) pos.addScaledVector(rightDir, -moveSpeed);
      if (this.keys['KeyD']) pos.addScaledVector(rightDir, moveSpeed);
    }

    // ---------------------------------------------------------
    // 🚧 COLLISION BOUNDARIES (Dynamic Corridor → Full Room)
    // ---------------------------------------------------------
    let minX, maxX, minZ, maxZ;

    if (!this.freeMovement) {
      // BEFORE yellow cube → narrow corridor
      minX = -4.5;
      maxX =  4.5;
    } else {
      // AFTER yellow cube → full wider ground area
      minX = -19.5;
      maxX =  19.5;
    }

    // Z limits always active
    minZ = -95;
    maxZ =  45;

    // Clamp movement
    pos.x = Math.max(minX, Math.min(maxX, pos.x));
    pos.z = Math.max(minZ, Math.min(maxZ, pos.z));
    // ---------------------------------------------------------
  }
});

