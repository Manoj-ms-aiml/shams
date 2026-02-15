# Media Assets Required

To complete this cinematic experience, you need to add the following media files to the `public` directory:

## Audio Files

Place these in `public/audio/`:

- `tudum.mp3` - Netflix-style sound effect for the intro (6-8 seconds)
- `season1.mp3` - Narration audio for Season 1 (~45 seconds)
- `season2.mp3` - Narration audio for Season 2 (~40 seconds)
- `season3.mp3` - Narration audio for Season 3 (~40 seconds)
- `season4.mp3` - Narration audio for Season 4 (~50 seconds)
- `finale.mp3` - Ambient music for the final scene (15-20 seconds, looping)

## Video Files

Place these in `public/videos/`:

- `prologue.mp4` - Opening cinematic video (15-30 seconds recommended)

## Subtitle Timing

The subtitle timings are already configured in `src/data/seasonData.ts`. If your audio narration timing differs, adjust the `time` values in that file to match your actual audio recordings.

## Tips for Audio Recording

1. Speak slowly and clearly
2. Add 1-2 seconds of silence at the beginning
3. Use a warm, conversational tone
4. Record in a quiet environment
5. Export as MP3 for web compatibility

## Video Guidelines

- Format: MP4 (H.264 codec recommended)
- Resolution: 1920x1080 or higher
- Should be cinematic and visually engaging
- Keep file size reasonable for web delivery (under 20MB if possible)
