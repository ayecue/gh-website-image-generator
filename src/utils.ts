import { CompressionMode, OptimizedCodes } from './compress';
import { ImageSize } from './image-container';

export function parseMeasurement(
  arg: string,
  defaultValue: number = ImageSize.Auto
): number {
  if (arg === undefined || arg === '') return defaultValue;

  const num = Number(arg);

  if (isNaN(num)) {
    return defaultValue;
  }

  return num;
}

export function rbgValueToHexValue(item: number) {
  const hex = item.toString(16);
  return `0${hex}`.slice(-2);
}

export function rgbToHex(r: number, g: number, b: number) {
  return `#${rbgValueToHexValue(r)}${rbgValueToHexValue(g)}${rbgValueToHexValue(
    b
  )}`;
}

export function rgbToHexWithAlpha(r: number, g: number, b: number, a: number) {
  return `${rgbToHex(r, g, b)}${rbgValueToHexValue(a)}`;
}

function websiteLogicFactory(mode: CompressionMode) {
  switch (mode) {
    case CompressionMode.None: {
      return `
        function next(i) {
          const decompressed = data.slice(i, i + 8);
          return '#' + decompressed;
        }
        function draw() {
          let pointer = 0;
          let index = 0;
          const max = data.length;

          while (pointer < max) {
            let charVal = data[pointer];
            let code = '';
            if (charVal === "${OptimizedCodes.White}") {
              code = '#FFFFFF';
            } else if (charVal === "${OptimizedCodes.Black}") {
              code = '#000000';
            } else if (charVal == "${OptimizedCodes.Invisible}") {
              code = '#00000000';
            } else {
              code = next(pointer);
              pointer += 7;
            }
            pointer++;

            const x = index % IMAGE_WIDTH;
            const y = Math.floor(index / IMAGE_WIDTH);

            ctx.fillStyle = code;
            ctx.fillRect(x * PIXEL_SCALE, y * PIXEL_SCALE, PIXEL_SCALE, PIXEL_SCALE);

            index++;
          }
        }
      `;
    }
    case CompressionMode.Medium: {
      return `
        function decompress(segment) {
          let out = "";
          for (let i = 0; i < segment.length; i++) {
            const item = segment[i];
            let val = item.charCodeAt(0) - 100;
            let temp = "";
            for (let j = 0; j < 2; j++) {
              temp = CHARACTERS[val % 16] + temp;
              val = Math.floor(val / 16);
            }
            out = out + temp;
          }
          return out;
        }
        function next(i) {
          const decompressed = decompress(data.slice(i, i + 4));
          const r = decompressed[0] + decompressed[1];
          const g = decompressed[2] + decompressed[3];
          const b = decompressed[4] + decompressed[5];
          const a = decompressed[6] + decompressed[7];
          return '#' + r + g + b + a;
        }
        function draw() {
          let pointer = 0;
          let index = 0;
          const max = data.length;

          while (pointer < max) {
            let charVal = data[pointer];
            let code = '';
            if (charVal === "${OptimizedCodes.White}") {
              code = '#FFFFFF';
            } else if (charVal === "${OptimizedCodes.Black}") {
              code = '#000000';
            } else if (charVal == "${OptimizedCodes.Invisible}") {
              code = '#00000000';
            } else {
              code = next(pointer);
              pointer += 3;
            }
            pointer++;

            const x = index % IMAGE_WIDTH;
            const y = Math.floor(index / IMAGE_WIDTH);

            ctx.fillStyle = code;
            ctx.fillRect(x * PIXEL_SCALE, y * PIXEL_SCALE, PIXEL_SCALE, PIXEL_SCALE);

            index++;
          }
        }
      `;
    }
    case CompressionMode.Heavy: {
      return `
        function decompress(segment) {
          let out = "";
          for (let i = 0; i < segment.length; i++) {
            const item = segment[i];
            let val = item.charCodeAt(0) - 100;
            let temp = "";
            for (let j = 0; j < 3; j++) {
              temp = CHARACTERS[val % 16] + temp;
              val = Math.floor(val / 16);
            }
            out = out + temp;
          }
          return out;
        }
        function next(i) {
          const decompressed = decompress(data.slice(i, i + 3));
          const r = decompressed[0] + decompressed[1];
          const g = decompressed[2] + decompressed[3];
          const b = decompressed[4] + decompressed[5];
          const a = decompressed[7] + decompressed[8];
          return '#' + r + g + b + a;
        }
        function draw() {
          let pointer = 0;
          let index = 0;
          const max = data.length;

          while (pointer < max) {
            let charVal = data[pointer];
            let code = '';

            const x = index % IMAGE_WIDTH;
            const y = Math.floor(index / IMAGE_WIDTH);

            if (charVal === "${OptimizedCodes.White}") {
              code = '#FFFFFF';
            } else if (charVal === "${OptimizedCodes.Black}") {
              code = '#000000';
            } else if (charVal == "${OptimizedCodes.Invisible}") {
              code = '#00000000';
            } else {
              code = next(pointer);
              pointer += 2;
            }
            pointer++;

            ctx.fillStyle = code;
            ctx.fillRect(x * PIXEL_SCALE, y * PIXEL_SCALE, PIXEL_SCALE, PIXEL_SCALE);

            index++;
          }
        }
      `;
    }
    default: {
      throw new Error('Unknown compression mode!');
    }
  }
}

export function coreWebsiteFactory(
  height: number,
  width: number,
  scale: number = 1,
  compressionMode: CompressionMode = CompressionMode.Medium
) {
  return `<canvas id="canvas" width="${width * scale}" height="${
    height * scale
  }"></canvas>
  <script>
    (function renderImage(data) {
      const IMAGE_WIDTH = ${width};
      const PIXEL_SCALE = ${scale};
      const CHARACTERS = "0123456789abcdef";

      const canvas = document.getElementById('canvas');
      const ctx = canvas.context2D || canvas.getContext('2d');

      ${websiteLogicFactory(compressionMode)}

      draw();
    })(DATA);
  </script>`
    .split('\n')
    .filter((s) => s !== '')
    .map((s) => s.trim())
    .join('\n');
}
