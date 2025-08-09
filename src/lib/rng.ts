// Simple seeded RNG utilities (no external deps)
// LCG based PRNG for deterministic results per seed
export const createSeededRNG = (seedInput: number) => {
  let seed = (seedInput >>> 0) || 1;
  return () => {
    // Numerical Recipes LCG
    seed = (1664525 * seed + 1013904223) >>> 0;
    // Convert to [0,1)
    return seed / 0x100000000;
  };
};

export const shuffle = <T,>(arr: T[], rnd: () => number) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const sampleUniqueInRange = (
  min: number,
  max: number,
  count: number,
  rnd: () => number
) => {
  const pool: number[] = [];
  for (let n = min; n <= max; n++) pool.push(n);
  const s = shuffle(pool, rnd);
  return s.slice(0, count).sort((a, b) => a - b);
};
