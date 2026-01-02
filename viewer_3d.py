import base64

def get_3d_viewer_html(fbx_file_path):
    """
    Reads an FBX file and returns an HTML string with a Three.js viewer
    that embeds the model as a base64 string.
    """
    try:
        with open(fbx_file_path, "rb") as f:
            encoded_model = base64.b64encode(f.read()).decode()
    except Exception as e:
        return f"<div>Error loading 3D model: {str(e)}</div>"

    html_code = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>3D Viewer</title>
        <style>
            body {{ margin: 0; overflow: hidden; background: transparent; }}
            canvas {{ display: block; }}
        </style>
        <!-- Import Three.js and loaders from CDN -->
        <script type="importmap">
            {{
                "imports": {{
                    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
                    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
                }}
            }}
        </script>
    </head>
    <body>
        <div id="container"></div>
        <script type="module">
            import * as THREE from 'three';
            import {{ OrbitControls }} from 'three/addons/controls/OrbitControls.js';
            import {{ FBXLoader }} from 'three/addons/loaders/FBXLoader.js';

            // Scene Setup
            const container = document.getElementById('container');
            const scene = new THREE.Scene();
            // Transparent background to blend with Streamlit app
            scene.background = null; 

            // Camera
            const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
            camera.position.set(100, 200, 300);

            // Renderer
            const renderer = new THREE.WebGLRenderer({{ antialias: true, alpha: true }});
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            container.appendChild(renderer.domElement);

            // Controls
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.target.set(0, 100, 0);
            controls.update();

            // Lighting
            const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
            hemiLight.position.set(0, 200, 0);
            scene.add(hemiLight);

            const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
            dirLight.position.set(0, 200, 100);
            dirLight.castShadow = true;
            scene.add(dirLight);

            // Animation Mixer
            let mixer;
            const clock = new THREE.Clock();

            // Load Model (Base64 Blob)
            const modelBase64 = "{encoded_model}";
            
            // Helper to convert base64 to blob
            function base64ToBlob(base64, mimeType) {{
                const byteCharacters = atob(base64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {{
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }}
                const byteArray = new Uint8Array(byteNumbers);
                return new Blob([byteArray], {{ type: mimeType }});
            }}

            const blob = base64ToBlob(modelBase64, 'application/octet-stream');
            const url = URL.createObjectURL(blob);

            const loader = new FBXLoader();
            loader.load(url, function (object) {{
                
                mixer = new THREE.AnimationMixer(object);
                const action = mixer.clipAction(object.animations[0]);
                action.play();

                object.traverse(function (child) {{
                    if (child.isMesh) {{
                        child.castShadow = true;
                        child.receiveShadow = true;
                        // Simple material fix if textures fail to load (which they will in blob mode)
                        child.material = new THREE.MeshStandardMaterial({{ 
                            color: 0x22d3ee, 
                            roughness: 0.4,
                            metalness: 0.2
                        }}); 
                    }}
                }});

                scene.add(object);
                
                // Cleanup URL
                URL.revokeObjectURL(url);

            }}, undefined, function (e) {{
                console.error(e);
            }});

            // Resize Handler
            window.addEventListener('resize', onWindowResize);
            function onWindowResize() {{
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }}

            // Animation Loop
            function animate() {{
                requestAnimationFrame(animate);
                const delta = clock.getDelta();
                if (mixer) mixer.update(delta);
                renderer.render(scene, camera);
            }}

            animate();
        </script>
    </body>
    </html>
    """
    return html_code
