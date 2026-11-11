"""Draws the app's sound effects as small WAV files in assets/sounds/.

Run:  python tools/generate_sounds.py
Plain Python (no extra packages). Each sound is a few notes with a quick
fade-out, kept short and quiet so they sit under the music instead of on top.
"""
import math
import struct
import wave
from pathlib import Path

RATE = 22050
OUT = Path(__file__).resolve().parent.parent / "assets" / "sounds"


def tone(freq, ms, volume=0.5, decay=28.0, shape="sine"):
    """One note: `decay` is how fast it fades (higher = shorter ring)."""
    n = int(RATE * ms / 1000)
    out = []
    for i in range(n):
        t = i / RATE
        phase = 2 * math.pi * freq * t
        if shape == "soft-square":  # a bit of buzz, for the error sound
            s = math.sin(phase) + 0.33 * math.sin(3 * phase)
            s /= 1.33
        else:
            s = math.sin(phase) + 0.18 * math.sin(2 * phase)
            s /= 1.18
        attack = min(1.0, i / (RATE * 0.002))  # 2 ms fade-in: no click
        out.append(s * math.exp(-decay * t) * attack * volume)
    return out


def silence(ms):
    return [0.0] * int(RATE * ms / 1000)


def save(name, samples):
    OUT.mkdir(parents=True, exist_ok=True)
    peak = max(1e-9, max(abs(s) for s in samples))
    gain = min(1.0, 0.8 / peak)  # never above 80% of full scale
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(
            b"".join(struct.pack("<h", int(max(-1, min(1, s * gain)) * 32767)) for s in samples)
        )


# A light tap
save("tap", tone(1500, 45, 0.5, decay=70))
# Opening a folder: two notes going up
save("open", tone(660, 50, 0.45, decay=38) + tone(990, 80, 0.45, decay=34))
# Going back: two notes going down
save("back", tone(900, 50, 0.45, decay=38) + tone(600, 80, 0.45, decay=34))
# Opening a file: a small bright arpeggio
save(
    "file",
    tone(660, 55, 0.4, decay=30) + tone(830, 55, 0.4, decay=30) + tone(1100, 110, 0.45, decay=26),
)
# Error: two low, short buzzes
save(
    "error",
    tone(220, 90, 0.5, decay=14, shape="soft-square")
    + silence(40)
    + tone(196, 130, 0.5, decay=12, shape="soft-square"),
)
print("sounds written to", OUT)
