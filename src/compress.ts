export const OptimizedCodes = {
  White: String.fromCharCode(60),
  Black: String.fromCharCode(61),
  Invisible: String.fromCharCode(62)
} as const;

export const DEFAULT_ALPHA = '0FF';

export function compress(hex: string): string {
  hex = hex.slice(1);
  if (hex.length < 6)
    throw new Error('Hex value cannot be less than 6 characters');

  const segments = [hex.slice(0, 3), hex.slice(3, 6)];

  if (hex.length === 6) {
    segments.push(DEFAULT_ALPHA);
  } else {
    if (hex.length < 8)
      throw new Error('Hex value with alpha cannot be less than 8 characters');
    segments.push(`0${hex.slice(6, 8)}`);
  }

  let output = '';

  for (const segment of segments) {
    const code = 100 + parseInt(segment, 16);
    output += String.fromCharCode(code);
  }

  return output;
}
