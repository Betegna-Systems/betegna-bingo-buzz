import { createSeededRNG, sampleUniqueInRange } from "./rng";

export type BingoGrid = number[][]; // 5x5, center can be 0 to represent FREE

// Generate a classic 75-ball bingo card deterministically from a cardId (1..100)
export const generateBingoCard = (cardId: number): BingoGrid => {
  const rnd = createSeededRNG(cardId);
  const B = sampleUniqueInRange(1, 15, 5, rnd);
  const I = sampleUniqueInRange(16, 30, 5, rnd);
  const Nnums = sampleUniqueInRange(31, 45, 4, rnd); // 4 because of free center
  const G = sampleUniqueInRange(46, 60, 5, rnd);
  const O = sampleUniqueInRange(61, 75, 5, rnd);

  const grid: BingoGrid = Array.from({ length: 5 }, () => Array(5).fill(0));
  // Fill columns B I N G O
  for (let r = 0; r < 5; r++) grid[r][0] = B[r];
  for (let r = 0; r < 5; r++) grid[r][1] = I[r];
  // N column with free center
  grid[0][2] = Nnums[0];
  grid[1][2] = Nnums[1];
  grid[2][2] = 0; // FREE
  grid[3][2] = Nnums[2];
  grid[4][2] = Nnums[3];
  for (let r = 0; r < 5; r++) grid[r][3] = G[r];
  for (let r = 0; r < 5; r++) grid[r][4] = O[r];

  return grid;
};

export const flattenGrid = (grid: BingoGrid): number[] => grid.flat();

export const getMarkedFromDrawn = (grid: BingoGrid, drawnNumbers: number[]): number[] => {
  const set = new Set(drawnNumbers);
  return flattenGrid(grid).filter((n) => n !== 0 && set.has(n));
};

export const hasBingo = (grid: BingoGrid, drawnNumbers: number[]): { pattern: string } | null => {
  const set = new Set(drawnNumbers);
  const isMarked = (r: number, c: number) => (r === 2 && c === 2) || set.has(grid[r][c]);

  // Rows
  for (let r = 0; r < 5; r++) {
    let ok = true;
    for (let c = 0; c < 5; c++) ok = ok && isMarked(r, c);
    if (ok) return { pattern: `row-${r + 1}` };
  }
  // Cols
  for (let c = 0; c < 5; c++) {
    let ok = true;
    for (let r = 0; r < 5; r++) ok = ok && isMarked(r, c);
    if (ok) return { pattern: `col-${c + 1}` };
  }
  // Main diag
  if ([0, 1, 2, 3, 4].every((i) => isMarked(i, i))) return { pattern: "diag-main" };
  // Anti diag
  if ([0, 1, 2, 3, 4].every((i) => isMarked(i, 4 - i))) return { pattern: "diag-anti" };

  return null;
};
