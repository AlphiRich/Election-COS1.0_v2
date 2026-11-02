/* Election results model for the Analyst kit.
   Seat maths follows Schedule 1, Municipal Structures Act 117 of 1998 (Items 12, 13, 16) as set out in the
   municipal-electoral-quota-config skill. Ward/VD results below are INVENTED demo data for an example
   municipality (EX101) — never present them as real. The NW405 2021 fixture is real (Tier 2) and is used
   only to validate the calculator. */
window.EL = (() => {
  const rng = seed => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const gauss = r => { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const PARTIES = [
    { key: 'A', label: 'Party A', color: '#1A2246' }, { key: 'B', label: 'Party B', color: '#33427E' },
    { key: 'C', label: 'Party C', color: '#8A6A2A' }, { key: 'D', label: 'Party D', color: '#2F7E4A' },
    { key: 'E', label: 'Party E', color: '#6A6E7E' } ];
  const IND = { key: 'IND', label: 'Independent', color: '#B9B3A6' };
  const KEYS = PARTIES.map(p => p.key);
  const P = Object.fromEntries([...PARTIES, IND].map(p => [p.key, p]));
  const MUNI = { code: 'EX101', name: 'Example Local Municipality', B: 40, nWards: 20, event: 'Baseline LGE (invented)', prevEvent: 'Previous LGE (invented)', demarcation: 'Example ward delimitation v1' };
  const norm = o => { const s = Object.values(o).reduce((a, b) => a + Math.max(0.001, b), 0); const r = {}; for (const k in o) r[k] = Math.max(0.001, o[k]) / s; return r; };

  const r = rng(4052);
  const WARDS = [];
  for (let i = 1; i <= MUNI.nWards; i++) {
    const urban = i <= 10;
    const prof = urban ? { A: .53, B: .27, C: .08, D: .07, E: .05 } : { A: .37, B: .11, C: .39, D: .08, E: .05 };
    const pr = norm(Object.fromEntries(KEYS.map(k => [k, prof[k] + gauss(r) * 0.04])));
    const ps = { A: .035, B: -.012, C: -.02, D: .002, E: -.005 };
    const prev = norm(Object.fromEntries(KEYS.map(k => [k, pr[k] + ps[k] + gauss(r) * 0.015])));
    const reg = Math.round(6000 + r() * 3500);
    const turnout = clamp((urban ? .46 : .53) + gauss(r) * .045, .3, .7);
    const prevTurnout = clamp(turnout + .03 + gauss(r) * .025, .3, .75);
    const vds = [0, 1, 2].map(j => ({ code: String(10100000 + i * 100 + j + 1), w: .25 + r() * .2, noise: Object.fromEntries(KEYS.map(k => [k, gauss(r) * .035])), tn: gauss(r) * .035 }));
    const ws = vds.reduce((a, v) => a + v.w, 0); vds.forEach(v => { v.w /= ws; v.reg = Math.round(reg * v.w); });
    WARDS.push({ i, code: 'EX101-W' + String(i).padStart(2, '0'), name: 'Ward ' + String(i).padStart(2, '0'), urban, pr, prev, reg, turnout, prevTurnout, ind: i === 14 ? .36 : 0, vds });
  }
  // Split-ticket stress test: Party A ward candidates run well ahead of the party list, forcing Item 16.
  const STRESS = { party: 'A', pp: 14, prPP: -10, wards: WARDS.map(w => w.i) };

  function ballot(prShares, ind, bonus, wi) {
    let ws = { ...prShares };
    if (bonus && bonus.wards.includes(wi)) { ws[bonus.party] += bonus.pp / 100; ws = norm(ws); }
    const out = {}; KEYS.forEach(k => out[k] = ws[k] * (1 - ind)); if (ind) out.IND = ind;
    return out;
  }
  function rank(shares) { const s = Object.entries(shares).sort((a, b) => b[1] - a[1]); return { winner: s[0][0], second: s[1][0], margin: (s[0][1] - s[1][1]) * 100 }; }
  function outcome(base, { swing = {}, tDelta = 0, noise = 0, r = null, bonus = null, wi, ind = 0 }) {
    const raw = norm(Object.fromEntries(KEYS.map(k => [k, base.pr[k] + (swing[k] || 0) / 100 + (r ? gauss(r) * noise / 100 : 0)])));
    const pr = bonus && bonus.prPP && bonus.wards.includes(wi) ? norm({ ...raw, [bonus.party]: raw[bonus.party] + bonus.prPP / 100 }) : raw;
    const t = clamp(base.turnout * (1 + tDelta / 100) + (r ? gauss(r) * noise / 200 : 0), .15, .9);
    const valid = Math.round(base.reg * t * .985);
    const indS = ind ? clamp(ind + (r ? gauss(r) * .05 : 0), 0, .8) : 0;
    const wardShares = ballot(raw, indS, bonus, wi);
    return { pr, wardShares, t, valid, reg: base.reg, ...rank(wardShares) };
  }
  function allocate({ votes, wards = {}, B, C = 0 }) {
    const keys = Object.keys(votes);
    const A = keys.reduce((a, k) => a + votes[k], 0);
    const Q = Math.floor(A / (B - C)) + 1;                       // Item 12
    const rows = keys.map(k => { const raw = Math.floor(votes[k] / Q); return { key: k, votes: votes[k], ratio: votes[k] / Q, raw, rem: votes[k] - raw * Q, extra: 0 }; });
    let left = (B - C) - rows.reduce((a, x) => a + x.raw, 0);
    const order = rows.slice().sort((a, b) => b.rem - a.rem || b.votes - a.votes); // Item 13, tie → higher votes
    order.forEach((x, i) => x.rank = i + 1);
    let i = 0; while (left > 0 && order.length) { order[i % order.length].extra++; left--; i++; }
    rows.forEach(x => { x.total = x.raw + x.extra; x.wards = wards[x.key] || 0; x.item16 = x.wards > 0 && x.wards >= x.total; x.pr = x.item16 ? 0 : x.total - x.wards; x.held = Math.max(x.total, x.wards); }); // Item 16: keep wards, no list seats, never capped
    const size = rows.reduce((a, x) => a + x.held, 0) + C;
    return { A, B, C, Q, rows, size, overhang: size - B };
  }
  function council(outs, B) {
    const votes = Object.fromEntries(KEYS.map(k => [k, 0])), wards = Object.fromEntries(KEYS.map(k => [k, 0])); let C = 0;
    outs.forEach(o => { KEYS.forEach(k => votes[k] += Math.round(o.valid * o.pr[k]) + Math.round(o.valid * o.wardShares[k])); if (o.winner === 'IND') C++; else wards[o.winner]++; });
    return allocate({ votes, wards, B, C });
  }
  const agg = list => {
    const reg = list.reduce((a, o) => a + o.reg, 0), valid = list.reduce((a, o) => a + o.valid, 0);
    const pr = Object.fromEntries(KEYS.map(k => [k, list.reduce((a, o) => a + o.valid * o.pr[k], 0) / valid]));
    const ballotKeys = [...KEYS, ...(list.some(o => o.wardShares.IND) ? ['IND'] : [])];
    const wardShares = Object.fromEntries(ballotKeys.map(k => [k, list.reduce((a, o) => a + o.valid * (o.wardShares[k] || 0), 0) / valid]));
    return { reg, valid, t: valid / reg / .985, pr, wardShares, ...rank(pr) };
  };

  function baseline({ bonus = null } = {}) {
    const wards = WARDS.map(w => {
      const o = outcome(w, { wi: w.i, ind: w.ind, bonus });
      const p = outcome({ ...w, pr: w.prev, turnout: w.prevTurnout }, { wi: w.i, ind: w.ind ? w.ind - .08 : 0, bonus });
      const vds = w.vds.map(v => {
        const vo = outcome({ pr: norm(Object.fromEntries(KEYS.map(k => [k, o.pr[k] + v.noise[k]]))), turnout: clamp(o.t + v.tn, .2, .85), reg: v.reg }, { wi: -1, ind: w.ind });
        const vp = outcome({ pr: norm(Object.fromEntries(KEYS.map(k => [k, p.pr[k] + v.noise[k] * .8]))), turnout: clamp(p.t + v.tn, .2, .85), reg: v.reg }, { wi: -1, ind: w.ind ? w.ind - .08 : 0 });
        return { v, o: vo, p: vp };
      });
      return { w, o, p, vds };
    });
    return { wards, muni: agg(wards.map(x => x.o)), prevMuni: agg(wards.map(x => x.p)), council: council(wards.map(x => x.o), MUNI.B) };
  }

  function simulate({ runs = 1000, swing = {}, sigma = 2, noise = 1.5, tDelta = 0, bonus = null, seed = 2026 }) {
    const r = rng(seed);
    const seats = Object.fromEntries(KEYS.map(k => [k, []])); const sizes = []; const maj = { hung: 0 }; KEYS.forEach(k => maj[k] = 0);
    const item16 = Object.fromEntries(KEYS.map(k => [k, 0])); let overhangRuns = 0;
    for (let n = 0; n < runs; n++) {
      const sw = Object.fromEntries(KEYS.map(k => [k, (swing[k] || 0) + gauss(r) * sigma]));
      const outs = WARDS.map(w => outcome(w, { swing: sw, tDelta, noise, r, bonus, wi: w.i, ind: w.ind }));
      const c = council(outs, MUNI.B);
      c.rows.forEach(x => { seats[x.key].push(x.held); if (x.item16 && x.wards > x.total) item16[x.key]++; });
      sizes.push(c.size); if (c.overhang > 0) overhangRuns++;
      const need = Math.floor(c.size / 2) + 1; const top = c.rows.find(x => x.held >= need);
      if (top) maj[top.key]++; else maj.hung++;
    }
    const q = (arr, p) => { const s = arr.slice().sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
    const dist = Object.fromEntries(KEYS.map(k => [k, { p5: q(seats[k], .05), p50: q(seats[k], .5), p95: q(seats[k], .95), hist: seats[k].reduce((h, v) => (h[v] = (h[v] || 0) + 1, h), {}) }]));
    return { runs, dist, sizeMedian: q(sizes, .5), sizeMax: Math.max(...sizes), maj, item16, overhangRuns };
  }
  function sensitivity({ swing = {}, tDelta = 0, bonus = null, focus = 'A' }) {
    // Entitlement = votes ÷ Q (fractional). Wards = wards won outright. Under Schedule 1 a party's total depends on its own
    // vote share; who the votes move to changes which WARDS it wins, which only alters its total via Item 16.
    const at = (sw, td) => { const c = council(WARDS.map(w => outcome(w, { swing: sw, tDelta: td, wi: w.i, ind: w.ind, bonus })), MUNI.B); const r = c.rows.find(x => x.key === focus); return { ent: r.ratio, wards: r.wards, held: r.held }; };
    const base = at(swing, tDelta);
    const shift = (k, d) => k === focus ? { ...swing, [k]: (swing[k] || 0) + d } : { ...swing, [k]: (swing[k] || 0) + d, [focus]: (swing[focus] || 0) - d };
    const mk = (label, lo, hi) => ({ label, lo: Math.min(lo.ent, hi.ent), hi: Math.max(lo.ent, hi.ent), wLo: Math.min(lo.wards, hi.wards), wHi: Math.max(lo.wards, hi.wards) });
    const items = KEYS.map(k => mk(k === focus ? P[k].label + ' swing ±5 pp' : P[k].label + ' ⇄ ' + P[focus].label + ' 5 pp', at(shift(k, -5), tDelta), at(shift(k, 5), tDelta)));
    items.push(mk('Turnout ±10%', at(swing, tDelta - 10), at(swing, tDelta + 10)));
    return { base: base.ent, baseWards: base.wards, items: items.sort((x, y) => (y.hi - y.lo) + (y.wHi - y.wLo) / 4 - (x.hi - x.lo) - (x.wHi - x.wLo) / 4) };
  }
  function pearson(xs, ys) { const n = xs.length, mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n; let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < n; i++) { const dx = xs[i] - mx, dy = ys[i] - my; sxy += dx * dy; sxx += dx * dx; syy += dy * dy; } return sxy / Math.sqrt(sxx * syy); }

  // Validation fixtures
  const NW405 = { label: 'NW405 JB Marks · LGE 2021', source: 'Tier 2 · IEC Seat Calculation Detail, NW405, LGE 2021 (via municipal-electoral-quota-config)', B: 67, C: 0,
    votes: { ANC: 48911, DA: 25837, 'VF Plus': 13800, EFF: 9200, PA: 2389, BLF: 428, ABC: 340, ATM: 330, F4SD: 204 },
    expect: { Q: 1515, totals: { ANC: 33, DA: 17, 'VF Plus': 9, EFF: 6, PA: 2, BLF: 0, ABC: 0, ATM: 0, F4SD: 0 } } };
  const ITEM16 = { label: 'Synthesized Item 16 fixture', B: 20, C: 0, votes: { X: 60000, Y: 25000, Z: 15000 }, wards: { X: 5, Y: 0, Z: 5 }, expect: { Q: 5001, zPR: 0, zHeld: 5, size: 22 } };
  function checks() {
    const a = allocate(NW405); const okA = a.Q === NW405.expect.Q && a.rows.every(x => x.total === NW405.expect.totals[x.key]);
    const b = allocate(ITEM16); const z = b.rows.find(x => x.key === 'Z');
    const okB = b.Q === ITEM16.expect.Q && z.pr === 0 && z.held === 5 && b.size === ITEM16.expect.size;
    return { nw405: { ok: okA, res: a }, item16: { ok: okB, res: b } };
  }
  return { PARTIES, IND, KEYS, P, MUNI, WARDS, STRESS, baseline, simulate, sensitivity, allocate, pearson, checks, NW405 };
})();