AFRAME.registerComponent('cloak', {         
  init: function () {
    let el = this.el;
    let comp = this;
    let data = this.data;
    comp.scene = el.sceneEl.object3D;  
    comp.counter = 0;   
    comp.treeModels = [];
    comp.modelLoaded = false;

    // Function to apply cloak material
    function applyCloak() {
      let mesh = el.getObject3D('mesh'); 
      if (!mesh){return;}
      mesh.traverse(function(node){
         if (node.isMesh){  
           let mat = new THREE.MeshBasicMaterial();
           let color = new THREE.Color(0xaa5511);
           mat.color = color;
           mat.wireframe = false;
           mat.colorWrite = false;
           node.material = mat;                  
         }
      });
      comp.modelLoaded = true;
    }

    // Apply immediately (for primitives)
    applyCloak();

    // Apply when model loads (for obj/gltf)
    el.addEventListener('model-loaded', function(ev){
      applyCloak();
    });   
  }
});