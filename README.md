# Data Privacy & Security: Apple vs. FBI (Team Privacy)

React slide deck for the Digital Transformation team assignment. Our recommendation to Tim Cook: do not build the backdoor, and keep helping law enforcement through every lawful channel.

**Team:** Anika Sriram, Gavin Liu, Sandy Yang, Shreyas Anand, Tianyue Yin, Yule Xi, Ziming Xu

## Run it

```bash
npm install
npm run dev      # open the URL Vite prints
npm run build    # static site in dist/
```

## Using the deck

| Key | Action |
| --- | --- |
| → / Space / PageDown | Next build step, then next slide |
| ← / PageUp | Previous |
| O | Overview grid: click any slide to jump |
| N | Speaker script with timing, `click` cues, and on-pace indicator |
| T | Start / reset the talk timer (shows ahead / behind in the notes) |
| F | Fullscreen, for recording the video |
| D | Debate drill: 17 prompts with a 60-second clock (also `/?drill`) |
| P | Print view: every slide fully built with its script, then the debate notes |
| ? | Keyboard help |

Open `/?print` to go straight to the print view, then use **Print / Save as PDF**. No devices are allowed in the debate, so print this.
Open `/?built` to show every slide fully built (handy for still screenshots).

### Interactive exhibits
- **Slide 5 (Exhibit 1):** switch the Pew poll between all adults, ages 18–29, and iPhone owners.
- **Slide 6 (master key):** the signed tool opens the one target phone, then every phone; "Change device ID" unlocks one more per click.
- **Slide 7 (Exhibit 3):** passcode calculator: odds of guessing as the iPhone ships vs. time to crack with the ordered tool (4-digit, 6-digit, alphanumeric).
- **Slide 2:** agenda items jump to their section.

## Files

- `src/App.js`: the slides, speaker notes and presenter shell (overview, timer, print view)
- `src/interactive.js`: build steps, charts (Exhibits 1–4), master-key and passcode demos
- `src/Practice.js`: debate drill mode
- `src/data.js`: every number used, with its source (S1–S19)
- `src/debateNotes.js`: 60-second answers, rebuttals, and weak spots for the live debate
- `src/styles.css`: styling, including print layout

## Outline (about 9 min 55 s of script)

1. Introduction: our answer up front
2. Problem scoping: case timeline, stakeholders, both sides (Exhibit 1: Pew poll)
3. Problem: the four assignment questions (master-key demo; Exhibit 3: passcode calculator; Exhibit 2: FBI locked-phone count)
4. Recommended solution: "Secure by default, lawful by design"
5. Solution details: technology and management (Exhibit 4: Apple transparency report)
6. Expected outcomes and ROI
7. Conclusion, then sources
