import { compress, CompressionMode, OptimizedCodes } from './compress';
import { ImageContainer } from './image-container';
import { rgbToHex, rgbToHexWithAlpha } from './utils';

export const ImageAutoSize = -1;

async function generateImageData(
  image: ImageContainer,
  withoutAlpha: boolean,
  compressionMode: CompressionMode
): Promise<string> {
  const output: string[] = [];

  image.scan(function (x, y, rgba) {
    const red = rgba[0];
    const green = rgba[1];
    const blue = rgba[2];
    const alpha = rgba[3];
    const hasNoAlpha = withoutAlpha || alpha === 255;
    let hex;
    let code;

    if (hasNoAlpha) {
      hex = rgbToHex(red, green, blue);
      if (hex === '#000000') {
        code = OptimizedCodes.Black;
      } else if (hex === '#FFFFFF') {
        code = OptimizedCodes.White;
      } else {
        code = compress(hex, compressionMode);
      }
    } else {
      hex = rgbToHexWithAlpha(red, green, blue, alpha);
      if (alpha === 0) {
        code = OptimizedCodes.Invisible;
      } else {
        code = compress(hex, compressionMode);
      }
    }

    output.push(code);
  });

  return output.join('');
}

export interface ProcessOptions {
  image: ImageContainer;
  width: number;
  height: number;
  withoutAlpha?: boolean;
  compressionMode?: CompressionMode;
}

export async function process({
  image,
  width = 64,
  height = ImageAutoSize,
  withoutAlpha = false,
  compressionMode = CompressionMode.Medium
}: ProcessOptions) {
  const resizedImage = await image.resize(width, height);
  const output = await generateImageData(
    resizedImage,
    withoutAlpha,
    compressionMode
  );

  return {
    image: resizedImage,
    data: output
  };
}
