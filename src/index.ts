import { readFileSync } from 'fs';
import { decode, Image } from 'imagescript';
import Jimp from 'jimp';

import { CompressionMode } from './compress';
import {
  AnimatedImageContainer,
  StaticImageContainer
} from './image-container';
import { process } from './process';
import { coreWebsiteFactory } from './utils';

export interface TransformOptions {
  filepath: string;
  width: number;
  height: number;
  scale?: number;
  withoutAlpha?: boolean;
  compressionMode?: CompressionMode;
}

export async function transform({ filepath, ...options }: TransformOptions) {
  const image = await Jimp.read(readFileSync(filepath));
  const result = await process({
    image: new StaticImageContainer(image),
    ...options
  });

  return [
    '<!DOCTYPE html>',
    '<meta charset="UTF-8">',
    `<script>var DATA="${result.data}";</script>`,
    coreWebsiteFactory(
      result.image.height,
      result.image.width,
      options.scale,
      options.compressionMode
    )
  ].join('\n');
}
