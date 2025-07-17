import crypto from 'crypto';
import { readFileSync } from 'fs';
import Jimp from 'jimp';

import { CompressionMode } from './compress';
import { StaticImageContainer } from './image-container';
import { process } from './process';
import { coreWebsiteFactory } from './utils';

export interface TransformOptions {
  filepath: string;
  width: number;
  height: number;
  scale?: number;
  withoutAlpha?: boolean;
  compressionMode?: CompressionMode;
  asyncRendering?: boolean;
  canvasId?: string;
}

export async function transform({ filepath, ...options }: TransformOptions) {
  const image = await Jimp.read(readFileSync(filepath));
  const result = await process({
    image: new StaticImageContainer(image),
    ...options
  });
  const renderSessionID = crypto.randomBytes(4).toString('hex');

  return [
    `<script>var DATA_${renderSessionID}="${result.data}";</script>`,
    coreWebsiteFactory(result.image.height, result.image.width, {
      scale: options.scale,
      compressionMode: options.compressionMode,
      withoutAlpha: options.withoutAlpha,
      asyncRendering: options.asyncRendering,
      canvasId: options.canvasId,
      renderSessionID
    })
  ].join('\n');
}
