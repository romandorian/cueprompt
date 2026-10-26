/* CuePrompt Smart Follow alignment. Pure functions, no DOM. Works in browsers (window.CueAlign) and Node (module.exports). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CueAlign = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  // Scripts written without spaces are aligned character by character.
  var CHAR_LEVEL = '\\u3040-\\u30ff\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff\\u0e00-\\u0e7f';
  var CHAR_RE = new RegExp('[' + CHAR_LEVEL + ']');
  var TOKEN_RE = new RegExp('[' + CHAR_LEVEL + ']|[\\p{L}\\p{N}\\p{M}\'\u2019]+', 'gu');
  var THAI_MARK = /[\u0e31\u0e34-\u0e3a\u0e47-\u0e4e]/;

  function normalize(token) {
    return token.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/['\u2019]/g, '');
  }

  /** Split text into tokens with character offsets: [{n: normalized, s: start, e: end, c: isCharLevel}] */
  function tokenize(text) {
    var out = [], m;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(text))) {
      var raw = m[0];
      if (THAI_MARK.test(raw)) continue; // Thai vowel and tone marks are not tokens on their own
      var n = normalize(raw);
      if (!n) continue;
      out.push({ n: n, s: m.index, e: m.index + raw.length, c: CHAR_RE.test(raw) });
    }
    return out;
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length];
  }

  /** 1 for an exact match, 0.5 for a close spelling (recognizer variants), 0 otherwise. */
  function similarity(a, b) {
    if (a === b) return 1;
    if (a.length < 4 || b.length < 4) return 0;
    var r = 1 - levenshtein(a, b) / Math.max(a.length, b.length);
    return r >= 0.75 ? 0.5 : 0;
  }

  var MATCH = 2, MISMATCH = -1, GAP = -0.8;

  /**
   * Find where the speaker is in the script.
   * script: array of normalized script tokens; spoken: array of normalized recognized tokens (oldest first);
   * pos: index of the next script token we expect to hear.
   * Returns {pos, score, matched} with pos = index after the last matched script token, or null when unsure.
   */
  function align(script, spoken, pos, options) {
    options = options || {};
    if (!script.length || !spoken.length) return null;
    var charLevel = options.charLevel != null ? options.charLevel : (script[Math.min(pos, script.length - 1)] || '').length === 1 && CHAR_RE.test(script[Math.min(pos, script.length - 1)]);
    var tailLen = options.tail || (charLevel ? 14 : 8);
    var back = options.back != null ? options.back : (charLevel ? 12 : 6);
    var ahead = options.ahead || (charLevel ? 160 : 80);
    var tail = spoken.slice(-tailLen);
    var m = tail.length;
    var lo = Math.max(0, pos - back), hi = Math.min(script.length, pos + ahead);
    var n = hi - lo;
    if (n <= 0) return null;
    // Local alignment (Smith-Waterman). H[i][j]: best score ending at tail[i-1], script[lo+j-1]. K counts matches.
    var H = [], K = [], i, j;
    for (i = 0; i <= m; i++) { H.push(new Float32Array(n + 1)); K.push(new Uint16Array(n + 1)); }
    for (i = 1; i <= m; i++) {
      for (j = 1; j <= n; j++) {
        var sim = similarity(tail[i - 1], script[lo + j - 1]);
        var diag = H[i - 1][j - 1] + (sim ? MATCH * sim : MISMATCH);
        var up = H[i - 1][j] + GAP, left = H[i][j - 1] + GAP, best = 0, k = 0;
        if (diag > best) { best = diag; k = K[i - 1][j - 1] + (sim ? 1 : 0); }
        if (up > best) { best = up; k = K[i - 1][j]; }
        if (left > best) { best = left; k = K[i][j - 1]; }
        H[i][j] = best; K[i][j] = k;
      }
    }
    // The alignment should end at (or right before) the newest spoken tokens: that is where the speaker is now.
    var bestScore = -Infinity, bestPos = -1, bestMatched = 0, raw = 0;
    for (i = Math.max(1, m - 2); i <= m; i++) {
      for (j = 1; j <= n; j++) {
        if (!H[i][j]) continue;
        var target = lo + j;
        var dist = target - pos;
        var penalty = (m - i) * 1.2 + (dist >= 0 ? dist * (charLevel ? 0.012 : 0.025) : -dist * 0.35);
        var score = H[i][j] - penalty;
        if (score > bestScore) { bestScore = score; bestPos = target; bestMatched = K[i][j]; raw = H[i][j]; }
      }
    }
    if (bestPos < 0) return null;
    var minMatches = charLevel ? 3 : 2;
    if (bestMatched < minMatches || raw < minMatches * MATCH - 1) return null;
    // Big jumps need strong evidence so a common word can't throw the prompter far ahead.
    var jump = bestPos - pos;
    if (jump > (charLevel ? 40 : 20) && bestMatched < (charLevel ? 6 : 4)) return null;
    if (jump < 0 && bestMatched < (charLevel ? 5 : 3)) return null;
    return { pos: bestPos, score: bestScore, matched: bestMatched };
  }

  return { tokenize: tokenize, normalize: normalize, align: align, similarity: similarity, isCharLevel: function (s) { return CHAR_RE.test(s); } };
});
