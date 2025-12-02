AFRAME.registerShader('water', {
  schema: {
    color: { type: 'color', default: '#1E90FF', is: 'uniform' },
    edgeColor: { type: 'color', default: '#87CEEB', is: 'uniform' },
    shallowColor: { type: 'color', default: '#7FDBFF', is: 'uniform' },
    timeMsec: { type: 'time', is: 'uniform' },
    amplitude: { type: 'number', default: 0.05, is: 'uniform' },
    frequency: { type: 'number', default: 2.0, is: 'uniform' },
    speed: { type: 'number', default: 0.5, is: 'uniform' },
    edgePower: { type: 'number', default: 2.0, is: 'uniform' },
    depthFalloff: { type: 'number', default: 0.5, is: 'uniform' }
  },

  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vDepth;
    uniform float timeMsec;
    uniform float amplitude;
    uniform float frequency;
    uniform float speed;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec3 pos = position;
      float time = timeMsec / 1000.0 * speed;
      
      // Create wavy displacement
      float wave1 = sin(pos.x * frequency + time) * amplitude;
      float wave2 = cos(pos.z * frequency + time * 0.8) * amplitude;
      pos.y += wave1 + wave2;
      
      vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPosition.xyz;
      
      vec4 mvPosition = viewMatrix * worldPosition;
      vViewPosition = -mvPosition.xyz;
      vDepth = -mvPosition.z;
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  fragmentShader: `
    uniform vec3 color;
    uniform vec3 edgeColor;
    uniform vec3 shallowColor;
    uniform float edgePower;
    uniform float depthFalloff;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vDepth;

    void main() {
      // Fresnel effect for edge lighting
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), edgePower);
      
      // Depth-based color transition (simulates shallow water at object intersections)
      // Lower Y values (closer to ground/objects) will be lighter
      float heightFactor = smoothstep(-0.5, 1.0, vWorldPosition.y * depthFalloff);
      vec3 depthColor = mix(shallowColor, color, heightFactor);
      
      // Combine depth coloring with fresnel edge effect
      vec3 finalColor = mix(depthColor, edgeColor, fresnel * 0.8);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
});
