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
    const tempArr: number[] = [];
    for (let row = 0; row < image.height; row++) {
      for (let col = 0; col < image.width; col++) {
        const pixelH = this.calculateKernelMagnitude(row, col, this.kernelH, image);
        const magnitude = Math.round(pixelH);
        tempArr.push(magnitude);
      }
    }

    this.setPixelValuesFromMagnitudeArray(image, tempArr);

    return image;
  }

  public applyVerticalSobel(image: ImageProcessor): ImageProcessor {
    const tempArr: number[] = [];
    for (let row = 0; row < image.height; row++) {
      for (let col = 0; col < image.width; col++) {
        const pixelV = this.calculateKernelMagnitude(row, col, this.kernelV, image);
        const magnitude = Math.round(pixelV);
        tempArr.push(magnitude);
      }
    }

    this.setPixelValuesFromMagnitudeArray(image, tempArr);

    return image;
  }

  public applyCombinedSobel(image: ImageProcessor): ImageProcessor {
    const tempArr: number[] = [];
    for (let row = 0; row < image.height; row++) {
      for (let col = 0; col < image.width; col++) {
        const pixelH = this.calculateKernelMagnitude(row, col, this.kernelH, image);
        const pixelV = this.calculateKernelMagnitude(row, col, this.kernelV, image);
        const magnitude = Math.round(Math.sqrt(Math.pow(pixelH, 2) + Math.pow(pixelV, 2)));
        tempArr.push(magnitude);
      }
    }

    this.setPixelValuesFromMagnitudeArray(image, tempArr);

    return image;
  }

  private setPixelValuesFromMagnitudeArray(image: ImageProcessor, magnitudesArray: number[]) {
    for (let row = 0; row < image.height; row++) {
      for (let col = 0; col < image.width; col++) {
        const magnitude = magnitudesArray[row*image.width+col];
        image.setPixelValueAt(row, col, ColorChannels.RED, magnitude);
        image.setPixelValueAt(row, col, ColorChannels.GREEN, magnitude);
        image.setPixelValueAt(row, col, ColorChannels.BLUE, magnitude);
      }
    }
  }

  private calculateKernelMagnitude(row: number, col: number, kernel: number[][], image: ImageProcessor) {
    return (
      (kernel[0][0] * image.getPixelValueAt(row - 1, col - 1, ColorChannels.RED)) +
      (kernel[0][1] * image.getPixelValueAt(row - 1, col, ColorChannels.RED)) +
      (kernel[0][2] * image.getPixelValueAt(row - 1, col + 1, ColorChannels.RED)) +
      (kernel[1][0] * image.getPixelValueAt(row, col-1, ColorChannels.RED)) +
      (kernel[1][1] * image.getPixelValueAt(row, col, ColorChannels.RED)) +
      (kernel[1][2] * image.getPixelValueAt(row, col+1, ColorChannels.RED)) +
      (kernel[2][0] * image.getPixelValueAt(row + 1, col - 1, ColorChannels.RED)) +
      (kernel[2][1] * image.getPixelValueAt(row + 1, col, ColorChannels.RED)) +
      (kernel[2][2] * image.getPixelValueAt(row + 1, col + 1, ColorChannels.RED))
    );
  }
}