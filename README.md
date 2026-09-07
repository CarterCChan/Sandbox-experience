# WebGL Terrain Explorer

A small browser-based WebGL demo with first-person movement, lighting, a dynamic skybox, and terrain experimentation using heightmaps and material shading.

## Features

- WASD movement through the scene
- Arrow keys to pan/look around
- Dynamic skybox day/night cycle
- Heightmap-based terrain experimentation
- Lighting and material interaction
- WebGL rendering with basic camera and control systems

## Controls

- W / S: move forward and backward
- A / D: strafe left and right
- Arrow Up / Down: look up and down
- Arrow Left / Right: turn left and right

## Run it locally

Open the project in a browser, or serve it locally from the project folder:

```bash
cd "c:\Users\carte\Downloads\Final Project\Final Project"
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

This project includes an index page that redirects to the main app, so the root URL works cleanly.

You can also open the file directly in a browser, but using a local server is recommended for the most reliable behavior.

## Publish on GitHub Pages

Because this is a static WebGL project, GitHub Pages is the simplest way to publish it.

1. Push the project folder to a GitHub repository.
2. On GitHub, open the repository.
3. Go to Settings → Pages.
4. Set Source to "Deploy from a branch".
5. Choose the main branch and the /root folder.
6. Save.

After a few moments, GitHub will give you a URL like:

```text
https://<your-user-name>.github.io/<your-repository-name>/
```

The app is configured so the root URL loads the project correctly through [index.html](index.html), and you can also use:

```text
https://<your-user-name>.github.io/<your-repository-name>/main.html
```

## Notes for deployment

- Keep all image and texture files in the repository root so relative paths continue to work.
- Do not rely on local file paths or machine-specific file locations.
- GitHub Pages serves static files only, so this project is a good fit.

## Project Notes

This project explores:

- dynamic skybox lighting over a day/night cycle
- terrain generation and heightmap experimentation
- lighting models with ambient, diffuse, and specular effects
- interactive camera movement in a browser-based 3D scene

## Files

- main.html — main entry point
- lib.js — shared helpers
- vector.js — vector math
- matrix.js — matrix math
- normal_mesh.js — mesh and normals support
- controls.js — input handling
- cam.js — camera behavior
- lit_material.js — material/texturing logic
- light.js — lighting support
- skybox.js — skybox rendering

## Tips

- Move around the terrain to see how the lighting changes with the skybox.
- Try adjusting the scene and shader values to experiment with material response and terrain height.
- The project is intended as a learning/demo environment for real-time rendering concepts.
