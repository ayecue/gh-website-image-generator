export const OptimizedCodes = {
  White: String.fromCharCode(33),
  Black: String.fromCharCode(35),
  Invisible: String.fromCharCode(37)
} as const;

export enum CompressionMode {
  None = 0,
  Medium = 1,
  Heavy = 2
}

const MAX_VALID_CHAR_CODE = 65535 as const;

function toGlyph(segments: string[]) {
  let output = '';

  for (const segment of segments) {
    const code = 100 + parseInt(segment, 16);
    if (code > MAX_VALID_CHAR_CODE) throw new Error(`Char code ${code} outside of range.`);
    output += String.fromCharCode(code);
  }

  return output;
}

function hCompression(hex: string, withoutAlpha: boolean) {
  hex = extract(hex, withoutAlpha);
  if (withoutAlpha) return toGlyph([hex.slice(0, 3), hex.slice(3, 6)]);
  return toGlyph([hex.slice(0, 3), hex.slice(3, 6), `0${hex.slice(6, 8)}`]);
}

function mCompression(hex: string, withoutAlpha: boolean) {
  hex = extract(hex, withoutAlpha);
  if (withoutAlpha) return toGlyph([hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)]);
  return toGlyph([hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6), hex.slice(6, 8)]);
}

function extract(hex: string, withoutAlpha: boolean) {
  hex = hex.slice(1);
  if (hex.length < 6)
    throw new Error('Hex value cannot be less than 6 characters');
  if (hex.length === 6) hex += 'FF';
  else if (hex.length < 8) throw new Error('Hex value with alpha cannot be less than 8 characters');
  if (withoutAlpha) return hex.slice(0, 6);
  return hex;
}

export function compress(hex: string, mode: CompressionMode, withoutAlpha: boolean): string {
  switch (mode) {
    case CompressionMode.None: {
      return extract(hex, withoutAlpha);
    }
    case CompressionMode.Medium: {
      return mCompression(hex, withoutAlpha);
    }
    case CompressionMode.Heavy: {
      return hCompression(hex, withoutAlpha);
    }
    default: {
      throw new Error('Unknown compression mode!');
    }
  }
}
