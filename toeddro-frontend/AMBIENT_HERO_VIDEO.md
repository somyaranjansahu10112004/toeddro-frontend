# Toeddro Ambient Hero Video

The experimental Three.js / React Three Fiber / GSAP scene has been removed.
The homepage keeps its existing hero layout and uses a real, muted, looping
nature video as the hero background when configured.

## Add the video
1. Download a landscape MP4 nature clip that you have permission to use.
2. Prefer 1920x1080 H.264, 8–20 seconds, with clouds/mist/trees and minimal camera movement.
3. Save it as `homepage/public/media/toeddro-hero.mp4` (create the `media` folder).
4. Add this to `homepage/.env`:

```env
VITE_HERO_VIDEO_URL=/media/toeddro-hero.mp4
```

5. Restart Vite after changing `.env`.

A suggested free clip is Motionwell's "Snow-Capped Mountain with Pine Trees and
Misty Clouds": https://motionwell.co/video/snow-capped-mountain-with-pine-trees-and-misty-clouds
The publisher lists it as free for personal and commercial use with no attribution
required. Review the license on the source page before deployment.

A second option is Pixabay's "Mountains, Trees, Clouds":
https://pixabay.com/videos/mountains-trees-clouds-water-227011/
Pixabay identifies it as free under the Pixabay Content License.

## Behavior
- Video is muted, autoplaying, looping and inline.
- Existing image remains the visual fallback if no video URL is configured.
- No WebGL, Three.js, R3F, Drei or GSAP runtime is used.
- `prefers-reduced-motion: reduce` hides the video and disables hero drift.
- Existing search, navigation, discovery, chatbot, reviews and API integrations are unchanged.
