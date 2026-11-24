# Quadratic Placement — Bilingual EDA Lesson

A dark-teal, bilingual teaching site and short EDA lesson on fixed-pad
quadratic placement.

## Website

**Live site:** <https://muranfei.github.io/quadratic-placement-lesson/>

The public site is published from [`docs/`](docs/) with GitHub Pages.

## Lesson scope

- Real-life seating analogy for placement and fixed constraints
- Mapping people and friendships to cells and nets
- HPWL from bounding rectangles
- Starter HPWL arithmetic: `52`
- Quadratic spring intuition
- Damped neighbor averaging with a `0.55` blend
- Six iterations and the constrained result near `48`
- Comparison with an unconstrained force-directed result near `18.7`
- Density and overlap as separate quality checks
- Browser-lab walkthrough and a six-question self-check

## Site features

- English and Chinese interface switching
- 5:07 lesson video with English narration and bilingual subtitles
- 13 chapter jumps and browser playback-speed control
- Interactive HPWL calculator
- Six scored exercises with immediate explanations and reset
- Downloadable video, subtitle file, lesson notes, timeline JSON, poster, and
  contact sheet
- Desktop and mobile responsive layout

## Source and attribution

The lesson is based on:

<https://yongfu-li.github.io/eda-learning/courses/learn_placement/labs/quadratic-place/index.html>

The original course repository does not declare a reuse license, so its
slides and transcript are not redistributed in this repository. The site links
to the original course for attribution and further study.

## Local preview

Open `docs/index.html` directly, or run:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000/docs/`.

## Useful downloadable files

- `docs/videos/quadratic_placement_full_en_v1.mp4`
- `docs/downloads/quadratic_placement_full_en_v1.srt`
- `docs/downloads/quadratic_placement_lesson_notes.md`
- `docs/downloads/lesson-timeline.json`

## Licensing

- Source code and site implementation: MIT, see [LICENSE](LICENSE).
- Original generated lesson text, narration, video, graphics, and notes:
  CC BY 4.0, see [CONTENT-LICENSE.md](CONTENT-LICENSE.md).
- Linked third-party course material remains the property of its original
  authors.
