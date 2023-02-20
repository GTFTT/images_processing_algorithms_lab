import {ColorChannels, ImageProcessor} from "../common/ImageProcessor";

export class SobelFilterAlgorithms {
  private readonly kernelH: number[][];
  private readonly kernelV: number[][];

  constructor() {
    this.kernelH = [
      [-1,0,1],
      [-2,0,2],
      [-1,0,1]
    ];

    this.kernelV = [
      [-1,-2,-1],
      [0,0,0],
      [1,2,1]
    ];
  }
  
  public applyHorizontalSobel(image: ImageProcessor): ImageProcessor {
    for (let x = 0; x < image.height; x++) {
      for (let y = 0; y < image.width; y++) {
        const pixelH = this.calculateKernelMagnitude(x, y, this.kernelH, image);

        const magnitude = Math.round(pixelH);

        image.setPixelValueAt(x, y, ColorChannels.RED, magnitude);
        image.setPixelValueAt(x, y, ColorChannels.GREEN, magnitude);
        image.setPixelValueAt(x, y, ColorChannels.BLUE, magnitude);
      }
    }

    return image;
  }

  public applyVerticalSobel(image: ImageProcessor): ImageProcessor {
    for (let x = 0; x < image.height; x++) {
      for (let y = 0; y < image.width; y++) {
        const pixelV = this.calculateKernelMagnitude(x, y, this.kernelV, image);

        const magnitude = Math.round(pixelV);

        image.setPixelValueAt(x, y, ColorChannels.RED, magnitude);
        image.setPixelValueAt(x, y, ColorChannels.GREEN, magnitude);
        image.setPixelValueAt(x, y, ColorChannels.BLUE, magnitude);
      }
    }

    return image;
  }

  public applyCombinedSobel(image: ImageProcessor): ImageProcessor {
    for (let x = 0; x < image.height; x++) {
      for (let y = 0; y < image.width; y++) {
        const pixelH = this.calculateKernelMagnitude(x, y, this.kernelH, image);
        const pixelV = this.calculateKernelMagnitude(x, y, this.kernelV, image);

        const magnitude = Math.round(Math.sqrt(Math.pow(pixelH, 2) + Math.pow(pixelV, 2)));

        image.setPixelValueAt(x, y, ColorChannels.RED, magnitude);
        image.setPixelValueAt(x, y, ColorChannels.GREEN, magnitude);
        image.setPixelValueAt(x, y, ColorChannels.BLUE, magnitude);
      }
    }

    return image;
  }

  private calculateKernelMagnitude(row: number, col: number, kernel: number[][], image: ImageProcessor) {
    return (
      (kernel[0][0] * image.getPixelValueAt(row - 1, col - 1, ColorChannels.RED)) +
      (kernel[0][1] * image.getPixelValueAt(row, col - 1, ColorChannels.RED)) +
      (kernel[0][2] * image.getPixelValueAt(row + 1, col - 1, ColorChannels.RED)) +
      (kernel[1][0] * image.getPixelValueAt(row - 1, col, ColorChannels.RED)) +
      (kernel[1][1] * image.getPixelValueAt(row, col, ColorChannels.RED)) +
      (kernel[1][2] * image.getPixelValueAt(row + 1, col, ColorChannels.RED)) +
      (kernel[2][0] * image.getPixelValueAt(row - 1, col + 1, ColorChannels.RED)) +
      (kernel[2][1] * image.getPixelValueAt(row, col + 1, ColorChannels.RED)) +
      (kernel[2][2] * image.getPixelValueAt(row + 1, col + 1, ColorChannels.RED))
    );
  }

}