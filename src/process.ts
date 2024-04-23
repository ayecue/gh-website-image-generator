import { compress, OptimizedCodes } from './compress';
import { ImageContainer } from './image-container';
import { rgbToHex, rgbToHexWithAlpha } from './utils';

export const ImageAutoSize = -1;

async function generateImageData(
  image: ImageContainer,
  withoutAlpha: boolean
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
        code = compress(hex);
      }
    } else {
      hex = rgbToHexWithAlpha(red, green, blue, alpha);
      if (alpha === 0) {
        code = OptimizedCodes.Invisible;
      } else {
        code = compress(hex);
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
}

export async function process({
  image,
  width = 64,
  height = ImageAutoSize,
  withoutAlpha = false
}: ProcessOptions) {
  const resizedImage = await image.resize(width, height);
  const output = await generateImageData(resizedImage, withoutAlpha);

  return {
    image: resizedImage,
    data: output
  };
}
