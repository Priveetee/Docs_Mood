# Advanced Visual Components (WebGL)

The Mood application features a highly dynamic and unique visual identity, powered by custom WebGL shaders rendered via `react-three-fiber` and `ogl`. These are not standard React components; they are full-fledged graphics applications embedded within the UI.

## Core Technology

- **`react-three-fiber` / `ogl`**: These libraries act as bridges between React and WebGL, allowing us to manage a WebGL canvas and its scene using a declarative, component-based syntax.
- **GLSL (OpenGL Shading Language)**: The visual logic itself is written in GLSL. A **shader** is a small program that runs directly on the GPU. We use a `vertexShader` to define the shape (a simple plane) and a `fragmentShader` to calculate the color of every single pixel on that shape, creating complex, animated patterns.

---

## The `Silk` Component

`Silk` is the animated, generative background used throughout the admin dashboard and on the root page.

- **File**: `src/components/Silk.tsx`
- **Functionality**: It renders a full-screen plane and applies a custom fragment shader to create a flowing, silk-like pattern.
- **Props**: It is highly configurable via props (`speed`, `scale`, `color`, `noiseIntensity`), which are passed directly to the shader as `uniforms`.
- **Color Transition**: The shader is designed to smoothly `lerp` (linearly interpolate) from its current color to a new target color. This is visible when changing themes in the admin dashboard.

### `SilkContext`

- **File**: `src/app/admin/SilkContext.tsx`
- **Purpose**: The admin dashboard needs to be able to change the `Silk` background color from child components (e.g., when hovering over a chart). This React Context exposes a `setSilkColor` function, which is provided at the `admin/layout.tsx` level and allows any child component to command a color change.

### `PollSilk`

- **File**: `src/components/PollSilk.tsx`
- **Purpose**: This is a slightly specialized, less configurable version of `Silk` used on the public poll page. Its parameters are mostly hardcoded for a consistent look, and it simply accepts a `color` prop to transition between mood colors.

---

## The `FaultyTerminal` Component

This component creates the retro, glitchy terminal effect seen on the "Poll Closed" page.

- **File**: `src/components/FaultyTerminal.tsx`
- **Technology**: It uses `ogl`, a smaller, lower-level WebGL library, for maximum performance.
- **Functionality**: Similar to `Silk`, it runs a complex fragment shader that simulates the visual artifacts of an old CRT monitor, including:
  - Generative digit patterns
  - Scanlines
  - Screen curvature (barrel distortion)
  - Chromatic aberration
  - Flickering and glitch effects
- **Interactivity**: It is configured to react to mouse movement (`mouseReact`), subtly distorting the pattern as the user's cursor moves over the canvas, adding a layer of immersive interactivity.
- **Dynamic Import**: This is a graphically intensive component. To optimize performance, it is loaded dynamically only when needed on the `poll/closed/client-page.tsx` using `next/dynamic` with `ssr: false`.
