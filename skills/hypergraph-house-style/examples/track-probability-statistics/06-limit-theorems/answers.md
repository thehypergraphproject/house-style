# Answers

1. $\operatorname{Var}(\bar{X}_{100}) = 4 / 100 = 0.04$, so the standard deviation is $\sqrt{0.04} = 0.2$.

2. Chebyshev gives $P(\lvert \bar{X}_n - \tfrac12 \rvert \ge 0.01) \le \dfrac{1/4}{n \cdot 0.01^2} = \dfrac{2500}{n}$. For this to be at most 0.05 you need $n \ge 50{,}000$ flips.

3. The total $T$ of 36 waits has mean $36 \cdot 10 = 360$ minutes and variance $36 \cdot 10^2 = 3600$, so standard deviation 60 minutes. Seven hours is 420 minutes, one standard deviation above the mean: $P(T > 420) \approx 1 - \Phi(1) \approx 0.16$. The waits are continuous, so no continuity correction is needed.

4. The central limit theorem says $\bar{X}_n$ is approximately normal with standard deviation $0.5 / \sqrt{n}$. A normal variable is within 1.96 standard deviations of its mean with probability 0.95, so you need $1.96 \cdot 0.5 / \sqrt{n} \le 0.01$, that is $\sqrt{n} \ge 98$ and $n \ge 9{,}604$ flips. Chebyshev asked for 50,000 because its bound must hold for every distribution with variance $1/4$, including the most spread-out ones; it uses nothing about the shape. The central limit theorem uses the shape of the limit, so it gives a far smaller number. For coin flips at this scale the approximation is excellent, so 9,604 is the one to trust; Chebyshev's figure is a guarantee, not an estimate.

5. The coin has no memory: each flip is heads with probability one half whatever happened before. The proportion still returns towards one half, but by dilution, not by correction. If the next 10,000 flips are exactly half heads, there are $520 + 5{,}000 = 5{,}520$ heads in 11,000 flips, a proportion of about 0.502. The excess of 20 heads is still there; it has become a smaller fraction of a larger total.
