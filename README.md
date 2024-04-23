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
  -s, --scale <number>                      scale of output
  -wa, --without-alpha                      ignore alpha channel
  -cm, --compression-mode                   set compression mode (0 - none, 1 - medium, 2 - heavy)
  -h, --help                                display help for command
```