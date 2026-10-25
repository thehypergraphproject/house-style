# Video

Videos are optional; the written notes always come first and must stand alone. A step has at most one video, which follows the notes rather than replacing them.

## Who publishes

Every video is published by The Hypergraph Project on its own YouTube channel, never on a contributor's channel. The contributor submits the finished file and its sources; the project reviews it, uploads it and credits everyone who made it, in the description, on the end card and on the step page. Never tell a contributor to upload a video themselves.

## Delivery spec

| | |
| --- | --- |
| Frame | 1920×1080, 16:9, square pixels |
| Frame rate | 30 fps (animations rendered at 30 too) |
| File | MP4, H.264, high profile, 12–20 Mbit/s; AAC audio 48 kHz, 192 kbit/s or more |
| Loudness | −14 LUFS integrated, true peak no higher than −1 dBTP |
| Length | 5 to 20 minutes. Longer means the step is two steps, or the video covers too much. |
| Captions | Required. English `.srt`, edited by a person (raw automatic captions are not accepted), in `video/captions.en.srt` |

## Structure

1. **Title card**, 3 seconds, silent: `assets/title-card.html`. Track code, track name, step title, hours.
2. **The body.** Start with the question, as the notes do. No channel intro, no "hey everyone", no asking viewers to like or subscribe, no sponsor segments.
3. **End card**, 8 seconds: `assets/end-card.html`. Everyone who made the video, and where the notes are.

Chapters follow the notes' sections and go in the description as timestamps.

## Look

- Content scenes on the ground colour `#F5F5F4`, drawn in ink, following the figure rules. Title and end cards on black `#0F0F0F`. No colour, anywhere.
- Type: Geist; maths in LaTeX Computer Modern (Manim's default `MathTex`); code in Geist Mono at 28px or more.
- Emphasis by weight, a filled shape, an underline or a box: never by colour or by flashing.
- Motion is slow and purposeful: elements appear as they are spoken about and stay put. No spinning, bouncing, zoom punches or transitions between scenes beyond a cut or a short fade.
- Text on screen is at least 28px at 1080p and stays long enough to read twice.

## Making the parts

- **Animations: Manim Community Edition** with `assets/hypergraph_manim.py`, which sets the palette, frame, fonts and stroke weights. Scene sources go in `video/src/`, so anyone can re-render them: `manim -qh video/src/scenes.py SceneName`.
- **Screen recordings** (code, a simulation): 1920×1080, browser or editor zoomed so text is 28px or more, light theme, notifications off, cursor visible. OBS Studio works well.
- **Narration:** a quiet room, a decent USB microphone, no music under speech. A face camera is optional; if used, small, in the bottom right, and never covering content.
- **Music:** none, or only tracks from the project's own library once it has one. Never commercial music: it triggers copyright claims on the project's channel.
- **Editing:** any editor (DaVinci Resolve, Kdenlive and Shotcut are free). Cuts and short fades only.
- **Cards and thumbnail:** render the HTML templates to PNG (instructions in each file's header comment). The thumbnail is the title card at 1280×720.

## What to submit

In the step's folder, by pull request:

```
video/
  captions.en.srt          edited captions
  description.md           filled from assets/video-description.md
  script.md                the narration script, if there is one
  src/                     Manim scenes and any other sources
  cards/                   rendered title card, end card and thumbnail PNGs
```

and in the step's front matter:

```yaml
video:
  youtube:                 # left empty: the project fills it after upload
  by: [github-handle]      # everyone who made the video, in order of contribution
  captions: video/captions.en.srt
```

The master MP4 is not committed (it is too large for Git). Attach a download link to the **Video submission** issue in the track repository instead. The maintainer and one reviewer watch it in full against this page and the notes; then the project uploads it, sets `youtube`, and the step page shows it.

## Licence

By submitting a video you license it, like the notes, under CC BY-SA 4.0, and give the project permission to publish it on its channel and in the library. You keep your copyright and can publish your own copy anywhere under the same licence.
