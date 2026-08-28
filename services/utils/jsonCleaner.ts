/**
 * Extract a balanced JSON structure (object or array) from the beginning of text.
 * Returns the substring from start to the matching closing bracket, or null if not found.
 */
function extractBalancedJSON(text: string): string | null {
  const startChar = text[0];
  if (startChar !== '{' && startChar !== '[') return null;

  const endChar = startChar === '{' ? '}' : ']';
  let depth = 0;
  let inStr = false;
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inStr) {
      // Inside a string
      if (ch === '\\') {
        // Escape character: include it and the next character, then continue
        result += ch;
        if (i + 1 < text.length) {
          result += text[i + 1];
          i++; // Skip the next character
        }
      } else if (ch === '"') {
        // Closing quote of the string
        result += ch;
        inStr = false;
      } else {
        // Regular character inside string
        result += ch;
      }
      continue;
    }

    // Outside a string
    if (ch === '"') {
      // Opening quote of a string
      result += ch;
      inStr = true;
      continue;
    }

    if (ch === startChar) {
      depth++;
      result += ch;
      continue;
    }

    if (ch === endChar) {
      depth--;
      result += ch;
      if (depth === 0) {
        return result;
      }
      continue;
    }

    result += ch;
  }

  // Unbalanced, return what we have (will be caught by parser)
  return depth > 0 ? result : null;
}

/**
 * Extract the last complete JSON object/array from anywhere in text.
 * Handles models that output thinking/reasoning before the final JSON.
 */
function extractLastJSON(text: string): string | null {
  // Track string state while searching backwards
  let inString = false;
  let escaped = false;
  const candidates: { start: number, text: string }[] = [];

  for (let i = text.length - 1; i >= 0; i--) {
    const ch = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (ch === '\\' && inString) {
      escaped = true;
      continue;
    }

    if (ch === '"' && !escaped) {
      inString = !inString;
      continue;
    }

    // Only consider { or [ outside of strings
    if (!inString && (ch === '{' || ch === '[')) {
      // Found a potential JSON start
      const remainingText = text.substring(i);
      const extracted = extractBalancedJSON(remainingText);
      if (extracted) {
        const trimmed = extracted.trim();
        // Skip empty objects/arrays and very short ones
        if (trimmed.length < 50) continue;
        candidates.push({ start: i, text: trimmed });
      }
    }
  }

  // Sort candidates by length (longest first) and by position (last first)
  candidates.sort((a, b) => {
    if (b.text.length !== a.text.length) {
      return b.text.length - a.text.length; // Longer first
    }
    return b.start - a.start; // Later first if same length
  });

  // Validate candidates: find one that looks like a complete problem JSON
  const requiredFields = ['problemId', 'topic', 'questionBody', 'requiredAnswer'];

  for (const candidate of candidates) {
    // Check if it contains required fields (by looking for the field names)
    const lower = candidate.text.toLowerCase();
    let matchCount = 0;
    for (const field of requiredFields) {
      if (lower.includes(`"${field.toLowerCase()}"`) || lower.includes(`"${field}"`)) {
        matchCount++;
      }
    }

    // Require at least 3 of the required fields to be confident
    if (matchCount >= 3) {
      return candidate.text;
    }
  }

  // Fallback: return the longest candidate
  if (candidates.length > 0) {
    return candidates[0].text;
  }

  return null;
}

/**
 * JSON Cleaner and Repair Utility
 *
 * Handles malformed JSON from LLM outputs, including:
 * - Illegal +/- prefixes on numbers: +0.91 → 0.91
 * - Unescaped control characters in strings
 * - Missing quotes around keys/values
 * - Trailing commas in arrays/objects
 * - Single-quoted or unquoted property names (via JSON5 fallback)
 */
import JSON5 from 'json5';

export function cleanAndParseJSON(jsonText: string): any {
  let text = jsonText.trim();

  // Remove BOM and other invisible characters at the start
  text = text.replace(/^[﻿​‌‍⁠　]/g, '');

  // First priority: extract the LAST complete JSON object/array from the text
  // This handles models that output thinking/reasoning before the final JSON
  const extracted = extractLastJSON(text);
  if (extracted) {
    text = extracted.trim();
  }

  // Normalize full-width punctuation that Chinese LLMs sometimes emit as JSON structural chars.
  // Full-width colon U+FF1A → ':' fixes "Expected ':' after property name".
  text = text
    .replace(/：/g, ':')
    .replace(/，/g, ',')
    .replace(/｛/g, '{')
    .replace(/｝/g, '}')
    .replace(/［/g, '[')
    .replace(/］/g, ']');

  // Handle special malformed cases like {{...} or {}{...} or {},
  // Try to extract the valid JSON object from these patterns
  if (text.startsWith('{{')) {
    // Double opening brace - try to find the matching closing brace
    const match = text.match(/\{[\s\S]*\}/);
    if (match) text = match[0];
  } else if (text.startsWith('{}') || /^\s*\{\s*\}\s*[,\s]/.test(text)) {
    // Empty object followed by content, skip the first empty object
    const afterEmpty = text.replace(/^\s*\{\s*\}\s*[,\s]*/, '');
    if (afterEmpty.startsWith('{') || afterEmpty.startsWith('[')) {
      text = afterEmpty;
    }
  }

  // Handle cases where JSON starts with { but has invalid second char
  // This catches things like "{,...} {...}" where first object is malformed
  if (text.startsWith('{') && text.length > 1) {
    const secondChar = text[1];
    // If second char is comma or whitespace that leads to another object, skip first object
    if (secondChar === ',' || (secondChar === ' ' && text.match(/^\{\s*,\s*\{/))) {
      const nextObj = text.substring(text.indexOf('{', 1));
      if (nextObj && nextObj.length > 0) {
        text = nextObj;
      }
    }
  }

  // Strip XML/HTML-style tags that some LLMs wrap output in (e.g., <response>, <output>, <json>)
  // Also handles <thinkreasoning>...</thinkreasoning> style reasoning blocks
  const tagPatterns = [
    /<response[^>]*>([\s\S]*?)<\/response>/gi,
    /<output[^>]*>([\s\S]*?)<\/output>/gi,
    /<json[^>]*>([\s\S]*?)<\/json>/gi,
    /<result[^>]*>([\s\S]*?)<\/result>/gi,
    /<answer[^>]*>([\s\S]*?)<\/answer>/gi,
    /<content[^>]*>([\s\S]*?)<\/content>/gi,
    /<data[^>]*>([\s\S]*?)<\/data>/gi,
    /<return[^>]*>([\s\S]*?)<\/return>/gi,
  ];

  for (const pattern of tagPatterns) {
    const match = text.match(pattern);
    if (match) {
      // Extract content from the first matching tag
      text = text.replace(pattern, '$1').trim();
      break;
    }
  }

  // If the entire response starts with a tag like <data>{...}</data>, extract the content between > and <
  const tagContentMatch = text.match(/^<[^>]+>([\s\S]*?)<\/[^>]+>$/);
  if (tagContentMatch) {
    text = tagContentMatch[1].trim();
  }

  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json|JSON)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  // If text doesn't start with { or [, try to find JSON structure in the text
  // This handles cases like "Here is the output: {...}" or "```json {...} ```"
  if (!text.startsWith('{') && !text.startsWith('[')) {
    // Try to find the first occurrence of { or [
    const objectStart = text.indexOf('{');
    const arrayStart = text.indexOf('[');

    let jsonStart = -1;
    if (objectStart !== -1 && arrayStart !== -1) {
      jsonStart = Math.min(objectStart, arrayStart);
    } else if (objectStart !== -1) {
      jsonStart = objectStart;
    } else if (arrayStart !== -1) {
      jsonStart = arrayStart;
    }

    if (jsonStart > 0) {
      text = text.substring(jsonStart);
    }
  }

  // Normalize full-width punctuation that Chinese LLMs sometimes emit as JSON structural chars.
  // Full-width colon U+FF1A → ':' fixes "Expected ':' after property name".
  text = text
    .replace(/：/g, ':')
    .replace(/，/g, ',')
    .replace(/｛/g, '{')
    .replace(/｝/g, '}')
    .replace(/［/g, '[')
    .replace(/］/g, ']');

  // Handle special malformed cases like {{...} or {}{...} or {},
  // Try to extract the valid JSON object from these patterns
  if (text.startsWith('{{')) {
    // Double opening brace - try to find the matching closing brace
    const match = text.match(/\{[\s\S]*\}/);
    if (match) text = match[0];
  } else if (text.startsWith('{}') || /^\s*\{\s*\}\s*[,\s]/.test(text)) {
    // Empty object followed by content, skip the first empty object
    const afterEmpty = text.replace(/^\s*\{\s*\}\s*[,\s]*/, '');
    if (afterEmpty.startsWith('{') || afterEmpty.startsWith('[')) {
      text = afterEmpty;
    }
  }

  // Handle cases where JSON starts with { but has invalid second char
  // This catches things like "{,...} {...}" where first object is malformed
  if (text.startsWith('{') && text.length > 1) {
    const secondChar = text[1];
    // If second char is comma or whitespace that leads to another object, skip first object
    if (secondChar === ',' || (secondChar === ' ' && text.match(/^\{\s*,\s*\{/))) {
      const nextObj = text.substring(text.indexOf('{', 1));
      if (nextObj && nextObj.length > 0) {
        text = nextObj;
      }
    }
  }

  try {
    // First attempt: direct parse (handles valid JSON)
    return JSON.parse(text);
  } catch (initialError) {
    // Second attempt: string repair only — fixes control chars and invalid escapes inside strings
    try {
      return JSON.parse(repairJsonStrings(text));
    } catch (_) {}

    // Third attempt: JSON5 parse — handles single-quoted keys, unquoted keys, JS comments, trailing commas
    try {
      return JSON5.parse(text);
    } catch (_) {}

    // Third-A: quote unquoted object keys (e.g. "AA基因型数(12 个): …" → '"AA基因型数(12 个)": …')
    // LLMs often omit quotes around keys that contain Chinese chars, parentheses, or spaces.
    // JSON5 can't handle these because they're not valid JS identifiers.
    try {
      return JSON.parse(repairUnquotedKeys(text));
    } catch (_) {}

    // Third-B: unquoted-key repair + string repair combined
    try {
      return JSON.parse(repairJsonStrings(repairUnquotedKeys(text)));
    } catch (_) {}

    // Fourth attempt: trim trailing content (safe only if strings are well-formed)
    const trimmed = trimTrailingNonJSON(text);
    try {
      return JSON.parse(trimmed);
    } catch (_) {}

    // Fifth attempt: basic cleaning (number prefixes, control chars, trailing commas)
    let cleaned = text;
    cleaned = cleaned.replace(/:\s*\+(\d+\.?\d*)/g, ': $1');
    cleaned = cleaned.replace(/,\s*\+(\d+\.?\d*)/g, ', $1');
    cleaned = cleaned.replace(/\[\s*\+(\d+\.?\d*)/g, '[$1');
    // Remove all control chars including tab (\x09); keep \x0A (LF) and \x0D (CR) for JSON whitespace
    cleaned = cleaned.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, ' ');
    cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');

    try {
      return JSON.parse(cleaned);
    } catch (_) {}

    // Sixth attempt: repair unescaped quotes/newlines, THEN trim trailing
    let repaired = repairJsonStrings(cleaned);
    repaired = trimTrailingNonJSON(repaired);
    try {
      return JSON.parse(repaired);
    } catch (_) {}

    // Seventh attempt: repair original text (before basic cleaning) and trim
    let repairedOriginal = repairJsonStrings(text);
    repairedOriginal = trimTrailingNonJSON(repairedOriginal);
    try {
      return JSON.parse(repairedOriginal);
    } catch (_) {}

    // Eighth attempt: extract from the first JSON-looking '{' (must be followed by optional whitespace
    // and a '"'), skipping LaTeX braces like {-7} or {-9} that may precede the actual JSON object.
    const jsonStart = text.search(/\{(?=\s*")/);
    if (jsonStart >= 0) {
      let extracted = repairJsonStrings(text.slice(jsonStart));
      extracted = trimTrailingNonJSON(extracted);
      try {
        return JSON.parse(extracted);
      } catch (_) {}
    }

    // Ninth attempt: nuclear — strip ALL control characters (including \n, \r, \t)
    // Handles LLM outputs with literal newlines/tabs inside string values.
    // Replaces with space so JSON structure (field separators) stays valid.
    const stripped = text.replace(/[\x00-\x1F\x7F]/g, ' ');
    try {
      return JSON.parse(stripped);
    } catch (_) {}

    // Tenth attempt: nuclear + extract from first JSON-looking '{'
    const jsonStartStripped = stripped.search(/\{(?=\s*")/);
    if (jsonStartStripped >= 0) {
      try {
        return JSON.parse(trimTrailingNonJSON(stripped.slice(jsonStartStripped)));
      } catch (_) {}
    }

    // Eleventh attempt: close truncated JSON by appending missing brackets/braces.
    // Handles the case where the LLM response was cut off at max_tokens.
    const closed = closeUnbalancedJSON(repaired || text);
    try {
      return JSON.parse(closed);
    } catch (_) {}

    // Twelfth attempt: close truncated JSON on the nuclear-stripped version
    const closedStripped = closeUnbalancedJSON(stripped);
    try {
      return JSON.parse(closedStripped);
    } catch (_) {}

    // All attempts failed — throw with the most useful error
    throw new Error(
      `Failed to parse JSON after all repair attempts. ` +
      `Original error: ${(initialError as Error).message}`
    );
  }
}

/**
 * Repair unquoted object keys produced by Chinese LLMs.
 * Keys containing Chinese chars, parentheses, or spaces are not valid JSON or JSON5 identifiers.
 * Example: { AA基因型数(12 个): "…" } → { "AA基因型数(12 个)": "…" }
 *
 * Walks the JSON character by character with context tracking so that string
 * contents are never modified.
 */
function repairUnquotedKeys(json: string): string {
  const result: string[] = [];
  let i = 0;
  let inString = false;
  let escaped = false;
  const contextStack: ('object' | 'array')[] = [];
  let expectKey = false;

  while (i < json.length) {
    const ch = json[i];

    if (escaped) {
      escaped = false;
      result.push(ch);
      i++;
      continue;
    }

    if (inString) {
      if (ch === '\\') { escaped = true; result.push(ch); i++; continue; }
      if (ch === '"') inString = false;
      result.push(ch);
      i++;
      continue;
    }

    // Outside a string
    if (ch === '"') {
      inString = true;
      expectKey = false;
      result.push(ch);
      i++;
      continue;
    }
    if (ch === '{') { contextStack.push('object'); expectKey = true; result.push(ch); i++; continue; }
    if (ch === '[') { contextStack.push('array');  expectKey = false; result.push(ch); i++; continue; }
    if (ch === '}' || ch === ']') {
      if (contextStack.length > 0) contextStack.pop();
      expectKey = false;
      result.push(ch); i++; continue;
    }
    if (ch === ',') {
      result.push(ch); i++;
      if (contextStack.length > 0 && contextStack[contextStack.length - 1] === 'object') expectKey = true;
      continue;
    }
    if (ch === ':') { expectKey = false; result.push(ch); i++; continue; }
    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') { result.push(ch); i++; continue; }

    if (expectKey) {
      // Scan forward to find the ':' (or ',' / '}') that terminates the key.
      // Track parenthesis depth so keys like "AA(12 个)" are captured whole.
      let j = i;
      let depth = 0;
      while (j < json.length) {
        const kch = json[j];
        if (kch === '(' || kch === '<') depth++;
        else if (kch === ')' || kch === '>') { if (depth > 0) depth--; }
        else if ((kch === ':' || kch === ',' || kch === '}') && depth === 0) break;
        j++;
      }
      const rawKey = json.substring(i, j).trimEnd();
      result.push('"');
      for (const kc of rawKey) {
        if (kc === '"') result.push('\\"');
        else if (kc === '\\') result.push('\\\\');
        else result.push(kc);
      }
      result.push('"');
      i = j;
      expectKey = false;
      continue;
    }

    result.push(ch);
    i++;
  }

  return result.join('');
}

/**
 * Repair unescaped characters inside JSON string values.
 *
 * Walks through the JSON character by character, tracking whether we're
 * inside a string value. When inside a string, escapes:
 * - Literal newlines/tabs → \n / \t
 * - Unescaped double quotes that don't terminate the string properly
 *   (heuristic: if the char after " isn't , } ] : or whitespace-then-punctuation,
 *    it's likely an embedded quote)
 * - Invalid escape sequences (like \frac, \pi in LaTeX) → \\frac, \\pi
 */
function repairJsonStrings(json: string): string {
  const result: string[] = [];
  let i = 0;
  let inString = false;
  let escaped = false;

  while (i < json.length) {
    const ch = json[i];

    if (escaped) {
      // Check if this is a valid escape sequence
      const validEscapes = new Set(['"', '\\', '/', 'b', 'f', 'n', 'r', 't']);

      if (ch === 'u') {
        // Unicode escape: \uXXXX - validate it
        const hex = json.substring(i + 1, i + 5);
        if (/^[0-9a-fA-F]{4}$/.test(hex)) {
          result.push(ch);
          result.push(hex);
          i += 4;
        } else {
          // Invalid unicode escape - skip the backslash, keep the 'u' and continue
          // This handles cases like \uAB (only 2 hex digits) - we keep the 'uAB' as literal text
        }
      } else if (validEscapes.has(ch)) {
        // Valid escape, keep it as-is
        result.push(ch);
      } else {
        // Invalid escape (like \i, \frac, \pi) - just remove the backslash
        // Keep the character literally (e.g., \i -> i, \frac -> frac)
      }
      escaped = false;
      i++;
      continue;
    }

    if (ch === '\\' && inString) {
      escaped = true;
      result.push(ch);
      i++;
      continue;
    }

    if (ch === '"') {
      if (!inString) {
        inString = true;
        result.push(ch);
        i++;
        continue;
      }

      // We're inside a string and hit a quote — is this the real end?
      // Look ahead: after a closing quote we expect , } ] : or whitespace followed by one of those
      const after = json.substring(i + 1, i + 20).trimStart();
      if (
        after.length === 0 ||
        after[0] === ',' ||
        after[0] === '}' ||
        after[0] === ']' ||
        after[0] === ':'
      ) {
        // This is the real closing quote
        inString = false;
        result.push(ch);
      } else {
        // This is an unescaped quote inside the string — escape it
        result.push('\\"');
      }
      i++;
      continue;
    }

    if (inString) {
      const code = ch.charCodeAt(0);
      if (code < 0x20) {
        // All control characters must be escaped or removed inside JSON strings
        if (ch === '\n') { result.push('\\n'); i++; continue; }
        if (ch === '\r') { result.push('\\r'); i++; continue; }
        if (ch === '\t') { result.push('\\t'); i++; continue; }
        // Other control chars (\x00-\x08, \x0B, \x0C, \x0E-\x1F) — drop them
        i++;
        continue;
      }
    }

    result.push(ch);
    i++;
  }

  return result.join('');
}

/**
 * Close a truncated JSON string by appending the missing closing brackets/braces.
 * Also closes any unclosed string literals. Handles the max_tokens truncation case.
 */
function closeUnbalancedJSON(text: string): string {
  const stack: string[] = [];
  let inString = false;
  let escaped = false;

  for (const ch of text) {
    if (escaped) { escaped = false; continue; }
    if (ch === '\\' && inString) { escaped = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') stack.push('}');
    else if (ch === '[') stack.push(']');
    else if ((ch === '}' || ch === ']') && stack.length > 0) stack.pop();
  }

  // Close any unclosed string, then close all open brackets in reverse order
  const suffix = (inString ? '"' : '') + stack.reverse().join('');
  return text + suffix;
}

/**
 * Trim trailing content after a top-level JSON object or array closes.
 * Handles the common LLM issue of appending explanations after the JSON.
 */
function trimTrailingNonJSON(text: string): string {
  const startChar = text[0];
  if (startChar !== '{' && startChar !== '[') return text;

  const closeChar = startChar === '{' ? '}' : ']';
  let depth = 0;
  let inStr = false;
  let esc = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (esc) { esc = false; continue; }
    if (ch === '\\' && inStr) { esc = true; continue; }

    if (ch === '"' && !esc) {
      inStr = !inStr;
      continue;
    }

    if (inStr) continue;

    if (ch === startChar) depth++;
    else if (ch === closeChar) {
      depth--;
      if (depth === 0) {
        // Found the matching close — return up to here
        return text.substring(0, i + 1);
      }
    }
  }

  return text; // unbalanced, return as-is and let parser deal with it
}

/**
 * Validate and fix JSON structure for problem objects
 * Ensures all required fields are present and properly formatted
 */
export function validateAndFixProblemJSON(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Input must be a valid object');
  }

  // Ensure required fields exist
  const requiredFields = [
    'problemId',
    'topic',
    'originalProblemText',
    'coreData',
    'requiredAnswer',
    'referenceSteps'
  ];

  for (const field of requiredFields) {
    if (!(field in obj)) {
      console.warn(`⚠️ Missing field in problem: ${field}`);
    }
  }

  // Fix coreData structure if malformed
  if (obj.coreData && typeof obj.coreData === 'object') {
    const coreData: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj.coreData)) {
      if (value && typeof value === 'object' && 'value' in value) {
        // Valid format: {value: ..., unit: ...}
        coreData[key] = value;
      } else if (typeof value === 'number' || typeof value === 'string') {
        // Convert scalar to {value, unit} format
        coreData[key] = {
          value: value,
          unit: ''
        };
      }
    }
    obj.coreData = coreData;
  }

  // Ensure referenceSteps is an array
  if (!Array.isArray(obj.referenceSteps)) {
    if (typeof obj.referenceSteps === 'string') {
      obj.referenceSteps = obj.referenceSteps.split('\n').map((s: string) => s.trim());
    } else {
      obj.referenceSteps = [];
    }
  }

  return obj;
}

/**
 * Extract JSON from mixed text response
 * Useful when LLM mixes explanation with JSON output
 */
export function extractJSONFromText(text: string): any {
  // Try multiple patterns to find JSON
  const patterns = [
    /\{[\s\S]*\}/,           // Any { ... }
    /\[\s*\{[\s\S]*\}\s*\]/, // Arrays of objects
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        return cleanAndParseJSON(match[0]);
      } catch (e) {
        // Continue to next pattern
        continue;
      }
    }
  }

  throw new Error('Could not extract valid JSON from text');
}

/**
 * Safe parse with fallback
 */
export function safeParseJSON(
  jsonText: string,
  fallback: any = null
): any {
  try {
    return cleanAndParseJSON(jsonText);
  } catch (error) {
    console.error(`Failed to parse JSON: ${error.message}`);
    return fallback;
  }
}
