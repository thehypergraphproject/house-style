"""Running mean of fair coin flips, inside the band 1/2 +/- 2 sigma / sqrt(n).

Run from the track root:  python 06-limit-theorems/figures/src/running_mean.py
Writes:                   06-limit-theorems/figures/running-mean.svg
"""

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.ticker import FuncFormatter

SEED = 6
FLIPS = 2000
HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "running-mean.svg"

plt.style.use(HERE / "hypergraph.mplstyle")

rng = np.random.default_rng(SEED)
flips = rng.integers(0, 2, size=FLIPS)  # 1 is heads
n = np.arange(1, FLIPS + 1)
running = np.cumsum(flips) / n
band = 2 * 0.5 / np.sqrt(n)  # two standard deviations of the sample mean; sigma = 1/2 for a fair coin

fig, ax = plt.subplots()
ax.fill_between(n, 0.5 - band, 0.5 + band, color="#EBEBEA", linewidth=0)
ax.axhline(0.5, color="#8A8A88", linewidth=1, linestyle="--")
ax.plot(n, running)

ax.set_xscale("log")
ax.xaxis.set_major_formatter(FuncFormatter(lambda v, _: f"{v:,.0f}"))
ax.set_xlim(1, FLIPS)
ax.set_ylim(0, 1)
ax.set_xlabel("Number of flips (log scale)")
ax.set_ylabel("Proportion of heads so far")

# Direct labels instead of a legend.
ax.annotate("Running mean", xy=(FLIPS, running[-1]), xytext=(-6, 10), textcoords="offset points", ha="right")
ax.annotate("Two standard deviations either side of 1/2", xy=(40, 0.5 + band[39]), xytext=(4, 6),
            textcoords="offset points", color="#5C5C5C")

fig.savefig(OUT, metadata={"Date": None})
print(f"Wrote {OUT.relative_to(Path.cwd()) if OUT.is_relative_to(Path.cwd()) else OUT}")
