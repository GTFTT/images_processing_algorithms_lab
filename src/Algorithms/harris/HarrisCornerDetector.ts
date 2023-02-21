import {ColorChannels, ImageProcessor} from "../common/ImageProcessor";


export class HarrisCornerDetector {
  public windowSize: number;

  // Determines the sensitivity of the corner detection algorithm. A typical value is in the range of 0.04 to 0.15.
  public k: number;

  // Used to remove too weak eigenvalues
  public threshold: number;

  constructor() {
    this.windowSize = 3;
    this.k = 0.1;
    this.threshold = 0.5;
  }

  /**
   *
   * @param Ix - Sobel's horizontal derivative
   * @param Iy - Sobel's vertical derivative
   */
  public computeHarrisMatrixElements(Ix: ImageProcessor, Iy: ImageProcessor): Float32Array {
    let width = Ix.width;
    let height = Ix.height;
    let harrisMatrixElements = new Float32Array(width * height * 3);

    // Compute the elements of the Harris matrix at each pixel
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Compute the elements of the Harris matrix
        let sumIx2 = this.getSumOfSquaresInWindow(Ix, x, y, this.windowSize); // a
        let sumIy2 = this.getSumOfSquaresInWindow(Iy, x, y, this.windowSize); // c
        let sumIxy = 2*this.getSumInWindow(Ix, Iy, x, y, this.windowSize); // b

        // Store the Harris matrix elements for this pixel
        harrisMatrixElements[(y * width + x) * 3] = sumIx2;
        harrisMatrixElements[(y * width + x) * 3 + 1] = sumIy2;
        harrisMatrixElements[(y * width + x) * 3 + 2] = sumIxy;
      }
    }
    return harrisMatrixElements;
  }

  public markCorners(harrisMatrix: Float32Array, image: ImageProcessor): ImageProcessor {
    let width = image.width;
    let height = image.height;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const a = harrisMatrix[(y * width + x) * 3];
        const c = harrisMatrix[(y * width + x) * 3 + 1];
        const b = harrisMatrix[(y * width + x) * 3 + 2];

        const Emax = 0.5*(a+c + Math.sqrt( (b**2) + ((a-c)**2) )); // λ1
        const Emin = 0.5*(a+c - Math.sqrt( (b**2) + ((a-c)**2) )); // λ2
        const R = Emax*Emin - this.k*((Emax+Emin)**2);

        if(R>this.threshold) {
          // We are in a corner
          this.markPixelsAsCorner(image, y, x, ColorChannels.RED);
        }
      }
    }

    return image;
  }

  /**
   * @param image
   * @param x - x coordinate of the pixel
   * @param y - y coordinate of the pixel
   * @param windowSize - usually 3, it means 3x3 window with the center in provided coords
   */
  public getSumOfSquaresInWindow(image: ImageProcessor, x: number, y: number, windowSize: number) {
    let halfWindowSize = Math.floor(windowSize / 2);
    let sumOfSquares = 0;

    // Iterate over all the pixels in the window
    for (let j = -halfWindowSize; j <= halfWindowSize; j++) {
      for (let i = -halfWindowSize; i <= halfWindowSize; i++) {
        let pixelValue = image.getPixelValueAt(x + i, y + j);
        sumOfSquares += pixelValue * pixelValue;
      }
    }
    return sumOfSquares;
  }

  public getSumInWindow(imageX: ImageProcessor, imageY: ImageProcessor, x: number, y: number, windowSize: number) {
    let halfWindowSize = Math.floor(windowSize / 2);
    let sum = 0;

    // Iterate over all the pixels in the window
    for (let j = -halfWindowSize; j <= halfWindowSize; j++) {
      for (let i = -halfWindowSize; i <= halfWindowSize; i++) {
        let pixelXValue = imageX.getPixelValueAt(x + i, y + j);
        let pixelYValue = imageX.getPixelValueAt(x + i, y + j);
        sum = sum + (pixelXValue*pixelYValue);
      }
    }
    return sum;
  }

  public markPixelsAsCorner(image: ImageProcessor, row: number, col: number, color: ColorChannels): void {
    let radius = 1;

    // Iterate over all the pixels in the window
    for (let j = -radius; j <= radius; j++) {
      for (let i = -radius; i <= radius; i++) {
        image.setPixelValueAt(row+j, col+i, ColorChannels.RED, 0);
        image.setPixelValueAt(row+j, col+i, ColorChannels.GREEN, 0);
        image.setPixelValueAt(row+j, col+i, ColorChannels.BLUE, 0);
        image.setPixelValueAt(row+j, col+i, color, 255);
      }
    }
  }

}

