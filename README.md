# ✦ Arise Creatives — Premium Agency Website

> A world-class, single-page agency website built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools. Just the fundamentals, pushed to their limits.

---

## 📁 Project Structure

```
arise-creatives/
├── index.html    # Full page markup — all 8 sections
├── style.css     # All styling, animations, responsive layout
├── main.js       # Interactivity: Three.js, cursor, scroll, effects
└── README.md     # You are here
```

---

## 🛠️ Tech Stack

| Technology | Purpose | Version / Source |
|---|---|---|
| **HTML5** | Semantic page structure | Native |
| **CSS3** | Styling, animations, layout | Native |
| **Vanilla JavaScript (ES6+)** | All interactivity and logic | Native |
| **Three.js** | 3D hero canvas (shapes, particles, lighting) | CDN v0.160.0 |
| **Google Fonts — Inter** | Premium typography | CDN |

> **Zero dependencies installed.** No npm, no build step, no bundler. Open `index.html` and it works.

---

## 🎨 Design System

### Color Palette (CSS Custom Properties)

```css
--bg:      #080808   /* Deep black base */
--surface: #111111   /* Card / nav background */
--accent:  #a78bfa   /* Purple — primary brand accent */
--accent2: #38bdf8   /* Cyan — secondary accent */
--accent3: #f472b6   /* Pink — tertiary accent */
--text:    #f0f0f0   /* Primary text */
--text-muted: #888  /* Secondary text */
```

### Typography
- **Font:** Inter (Google Fonts)
- **Scale:** `clamp()` based — fluid across all screen sizes
- **Hero H1:** `clamp(2.8rem, 7vw, 6rem)` — scales from mobile to 4K

---

## ✨ Features & Techniques

### 1. Three.js 3D Hero Background
- 4 animated 3D meshes: `TorusKnotGeometry`, `OctahedronGeometry`, `IcosahedronGeometry`, `TorusGeometry`
- Mix of solid (`MeshStandardMaterial`) and wireframe materials
- `PointLight` sources in purple, cyan, and pink — dynamic color fills
- 300-point `BufferGeometry` particle field
- Mouse parallax: camera position reacts smoothly to cursor movement
- Scene loaded dynamically (CDN script injected at runtime)

### 2. Custom Cursor
- Two-layer system: dot cursor + hollow ring follower
- Follower uses lerp (linear interpolation) on `requestAnimationFrame` for smooth lag effect
- `mix-blend-mode: difference` — cursor inverts colors underneath it
- Scales up on hover over interactive elements

### 3. Scroll-Triggered Reveal Animations
- Built with `IntersectionObserver` API (no library needed)
- Elements start hidden (`opacity: 0; transform: translateY(40px)`)
- Staggered delay via `data-delay` attributes
- Once revealed, observer disconnects — performance-safe

### 4. Animated Number Counters
- Triggered when hero stats enter the viewport (via `IntersectionObserver`)
- Uses `setInterval` + easing math to count from 0 → target
- Runs at ~60fps, clears itself on completion

### 5. 3D Card Tilt Effect
- `mousemove` event reads cursor offset relative to card center
- Applies `perspective(800px) rotateX() rotateY()` CSS transform
- `mouseleave` gracefully resets with a timeout for smooth exit

### 6. Glassmorphism Cards
```css
background: rgba(255,255,255,0.035);
border: 1px solid rgba(255,255,255,0.07);
backdrop-filter: blur(20px);
```
- Requires a background behind to be visible — works because of the dark gradient base

### 7. Dark / Light Theme Toggle
- Uses `data-theme` attribute on `<html>`
- All colors defined as CSS Custom Properties — swap once, everything updates
- Zero JavaScript color manipulation — pure CSS cascade

### 8. Hero Scroll Parallax
- Listens to `window.scroll`
- Translates hero content down at 25% scroll speed (`scrollY * 0.25`)
- Fades out opacity as user scrolls away

### 9. CSS-Only Marquee
- Infinite horizontal scroll using `@keyframes marqueeScroll`
- Content duplicated in HTML so the loop appears seamless
- No JavaScript required

### 10. Sticky Frosted Navbar
- Monitors `window.scrollY`
- Adds `.scrolled` class past 60px → enables `backdrop-filter: blur(24px)` + dark tint
- CSS transition handles smooth appearance

---

## 📐 Layout Approaches Used

| Technique | Where Used |
|---|---|
| **CSS Grid** | Services (2-col), Work (2-col), Process (4-col), Footer |
| **Flexbox** | Navbar, hero CTA, testimonials, all card rows |
| **CSS clamp()** | All headings — fluid type scale |
| **position: absolute/fixed** | Cursor, canvas, badges, scroll hint |
| **CSS Custom Properties** | Full design token system, theme switching |

---

## 📱 Responsive Strategy

- **Mobile-first breakpoints:** 1024px, 768px, 480px
- Grids collapse from multi-column → single column on mobile
- Navigation switches to hamburger menu via `display: none` toggle
- Hero headline scales down with `clamp()` — no media query needed for type
- 3D orbital decoration hidden on tablet to avoid overflow

---

## 🧠 Key Developer Learnings

### JavaScript
- **`IntersectionObserver`** — the right way to detect when elements enter the viewport, far more performant than scroll event listeners
- **`requestAnimationFrame`** — the browser's native animation loop; always use this instead of `setInterval` for visual updates
- **Lerp (Linear Interpolation):** `current += (target - current) * factor` — the simplest way to create smooth, lagging animations
- **Dynamic script injection** — load heavy libraries (Three.js) only when needed, not blocking initial render
- **`clamp()` in CSS** — replaces multiple media queries for typography/spacing

### CSS
- **CSS Custom Properties (`var()`)** — the foundation of any themeable design system
- **`backdrop-filter: blur()`** — glassmorphism without JavaScript; requires a non-opaque background
- **`mix-blend-mode`** — powerful compositing effects (cursor inverting content beneath it)
- **`@keyframes` animation** — CSS handles marquees, rings, floating badges — no JS needed
- **`clamp(min, preferred, max)`** — fluid scaling for headings across all device sizes
- **`overflow: hidden` + transforms** — how to contain 3D tilt without layout breaking

### Three.js
- **Scene graph:** everything lives in a `Scene`, viewed through a `Camera`, rendered by a `WebGLRenderer`
- **Geometry + Material = Mesh:** every 3D object is the combination of these two
- **`BufferGeometry` for particles** — the performant way to render thousands of points
- **`PointLight` placement** — colored lights dramatically change the feel of 3D scenes
- **Resize handling** — always update `camera.aspect` and call `renderer.setSize()` on window resize
- **`devicePixelRatio` cap** — `Math.min(window.devicePixelRatio, 2)` prevents performance issues on high-DPI screens

### Performance
- `IntersectionObserver.unobserve()` after element is revealed — don't keep watching what you don't need
- `will-change` properties handled by `transform` and `opacity` only — GPU-accelerated
- Three.js loads from CDN dynamically — doesn't block page render
- Images replaced with CSS gradients + Three.js — zero external image requests

---

## 🚀 How to Run

No build step needed.

**Option 1 — Direct open:**
```bash
open index.html
```

**Option 2 — Local server (recommended, required for Three.js CDN):**
```bash
python3 -m http.server 3456
# Then visit: http://localhost:3456
```

---

## 🌐 Browser Support

| Feature | Chrome | Safari | Firefox | Edge |
|---|---|---|---|---|
| CSS Custom Properties | ✅ | ✅ | ✅ | ✅ |
| `backdrop-filter` | ✅ | ✅ | ✅ (partial) | ✅ |
| `IntersectionObserver` | ✅ | ✅ | ✅ | ✅ |
| Three.js WebGL | ✅ | ✅ | ✅ | ✅ |
| CSS `clamp()` | ✅ | ✅ | ✅ | ✅ |

---

## 📚 What to Study Next

1. **[Three.js Journey](https://threejs-journey.com)** — the best course to go deep on 3D web
2. **[CSS Tricks — Custom Properties](https://css-tricks.com/a-complete-guide-to-custom-properties/)** — mastering design tokens
3. **[web.dev — IntersectionObserver](https://web.dev/intersectionobserver-v2/)** — beyond scroll events
4. **[GSAP](https://gsap.com)** — the industry standard for advanced JavaScript animation
5. **[Awwwards](https://awwwards.com)** — study the world's best websites for design inspiration

---

*Built by Arise Creatives · 2026*
# Arise_Creatives
