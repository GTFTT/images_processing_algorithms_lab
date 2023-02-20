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
  
  public applyHorizontalSobel(imageProcessor: ImageProcessor): ImageProcessor {
    const hSobelData = imageProcessor.convertImageToGrayScale();
    for (let x = 0; x < hSobelData.height; x++) {
      for (let y = 0; y < hSobelData.width; y++) {
        const pixelX = (
          (this.kernelH[0][0] * hSobelData.getPixelValueAt(x - 1, y - 1, ColorChannels.RED)) +
          (this.kernelH[0][1] * hSobelData.getPixelValueAt(x, y - 1, ColorChannels.RED)) +
          (this.kernelH[0][2] * hSobelData.getPixelValueAt(x + 1, y - 1, ColorChannels.RED)) +
          (this.kernelH[1][0] * hSobelData.getPixelValueAt(x - 1, y, ColorChannels.RED)) +
          (this.kernelH[1][1] * hSobelData.getPixelValueAt(x, y, ColorChannels.RED)) +
          (this.kernelH[1][2] * hSobelData.getPixelValueAt(x + 1, y, ColorChannels.RED)) +
          (this.kernelH[2][0] * hSobelData.getPixelValueAt(x - 1, y + 1, ColorChannels.RED)) +
          (this.kernelH[2][1] * hSobelData.getPixelValueAt(x, y + 1, ColorChannels.RED)) +
          (this.kernelH[2][2] * hSobelData.getPixelValueAt(x + 1, y + 1, ColorChannels.RED))
        );

        const magnitude = Math.round(pixelX);

        hSobelData.setPixelValueAt(x, y, ColorChannels.RED, magnitude);
        hSobelData.setPixelValueAt(x, y, ColorChannels.GREEN, magnitude);
        hSobelData.setPixelValueAt(x, y, ColorChannels.BLUE, magnitude);
      }
    }

    return hSobelData;
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