import { Image } from 'imagescript';
import Jimp from 'jimp';

export enum ImageSize {
  Auto = -1
}

export abstract class ImageContainer {
  abstract resize(w: number, h: number): ImageContainer;
  abstract scan(
    f: (this: ImageContainer, x: number, y: number, rgba: Buffer) => void
  ): void;

  abstract get bitmap(): Buffer;
  abstract get width(): number;
  abstract get height(): number;
}

export class ImageScriptContainer extends ImageContainer {
  private ref: Image;

  constructor(obj: Image) {
    super();
    this.ref = obj;
  }

  resize(w: number, h: number) {
    return new ImageScriptContainer(this.ref.resize(w, h));
  }

  scan(
    f: (this: ImageScriptContainer, x: number, y: number, rgba: Buffer) => void
  ) {
    for (let y = 1; y < this.ref.height; y++) {
      for (let x = 1; x < this.ref.width; x++) {
        const rgba = this.ref.getRGBAAt(x, y);
        f.call(this, x, y, Buffer.from(rgba));
      }
    }
  }

  get bitmap() {
    return Buffer.from(this.ref.bitmap);
  }

  get width() {
    return this.ref.width;
  }

  get height() {
    return this.ref.height;
  }
}

export class ImageJimpContainer extends ImageContainer {
  public ref: Jimp;

  static async readFromImageScript(image: ImageScriptContainer) {
    const jimpImage = new Jimp({
      data: image.bitmap,
      width: image.width,
      height: image.height
    });
    return new ImageJimpContainer(jimpImage);
  }

  constructor(obj: Jimp) {
    super();
    this.ref = obj;
  }

  resize(w: number, h: number) {
    return new ImageJimpContainer(this.ref.resize(w, h));
  }

  scan(
    f: (this: ImageJimpContainer, x: number, y: number, rgba: Buffer) => void
  ) {
    this.ref.scan(
      0,
      0,
      this.ref.bitmap.width,
      this.ref.bitmap.height,
      (x, y, idx) =>
        f.call(
          this,
          x,
          y,
          Buffer.from(this.ref.bitmap.data.slice(idx, idx + 4))
        )
    );
  }

  get bitmap() {
    return this.ref.bitmap.data;
  }

  get width() {
    return this.ref.bitmap.width;
  }

  get height() {
    return this.ref.bitmap.height;
  }
}

export class StaticImageContainer extends ImageJimpContainer {}
export class AnimatedImageContainer extends ImageScriptContainer {}
