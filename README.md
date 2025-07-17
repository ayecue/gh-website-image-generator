# gh-website-image-generator

# Install

```bash
npm install -g gh-website-image-generator
```

# Usage

##  Image transformer

```
Usage: gh-website-image-generator [options] <filepath> [width] [height]

Generates Grey Hack website with image.

Arguments:
  filepath                                  image to transform
  width                                     output width of image
  height                                    output height of image

Options:
  -V, --version                             output the version number
  -o, --output-directory <outputDirectory>  output directory
  -id, --canvas-id <elementId>              define the element id of the canvas in which the image should be rendered
  -s, --scale <number>                      scale of output
  -wa, --without-alpha                      ignore alpha channel
  -ar, --async-rendering                    use setTimeout to trigger draw which makes it render async
  -cm, --compression-mode                   set compression mode (0 - none, 1 - medium, 2 - heavy)
  -h, --help                                display help for command
```

## Async rendering

By default, images are rendered synchronously, which can block the game's UI until the image has fully loaded, especially with large images.

Enabling `--async-rendering` offloads image rendering to a separate thread, keeping the UI responsive. However, due to a poorly implemented `setTimeout` mechanism in PowerUI, images may occasionally fail to render on the first load when this flag is enabled. This appears to be an issue with PowerUI.

## Add Image to Existing HTML

If you have an existing website and just want to add images to it, you can use the `--canvas-id <elementId>` option.

1. Add a `<canvas>` element where you want the image to appear, for example: `<canvas id="someId"></canvas>`
2. Run the transformer with the canvas option: `--canvas-id someId`.
3. Append the generated code to the end of your HTML file.
4. DONE!