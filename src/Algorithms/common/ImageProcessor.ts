
export enum ColorChannels {
  RED = 1,
  GREEN,
  BLUE,
  ALPHA
}


export class ImageProcessor {
  public readonly pixelsArray: Uint8ClampedArray
  public readonly width: number;
  public readonly height: number;

  constructor(pixelsArray: Uint8ClampedArray, width: number, height: number) {
    this.pixelsArray = pixelsArray;
    this.width = width;
    this.height = height;
  }

  public getPixelValueAt(row: number, col: number, channel: ColorChannels): number {
    const pixelIndex = ((this.width * row) + col) * 4;
    let channelValue: number;
    switch (channel) {
      case ColorChannels.RED:
        channelValue = this.pixelsArray[pixelIndex + 0];
        break;
      case ColorChannels.GREEN:
        channelValue = this.pixelsArray[pixelIndex + 1];
        break;
      case ColorChannels.BLUE:
        channelValue = this.pixelsArray[pixelIndex + 2];
        break;
      case ColorChannels.ALPHA:
        channelValue = this.pixelsArray[pixelIndex + 3];
        break;
      default:
        throw new Error(`Not supported`);
    }

    return channelValue;
  }

  public setPixelValueAt(row: number, col: number, channel: ColorChannels, newValue: number): void {
    const pixelIndex = ((this.width * row) + col) * 4;
    switch (channel) {
      case ColorChannels.RED:
        this.pixelsArray[pixelIndex + 0] = newValue;
        break;
      case ColorChannels.GREEN:
        this.pixelsArray[pixelIndex + 1] = newValue;
        break;
      case ColorChannels.BLUE:
        this.pixelsArray[pixelIndex + 2] = newValue;
        break;
      case ColorChannels.ALPHA:
        this.pixelsArray[pixelIndex + 3] = newValue;
        break;
      default:
        throw new Error(`Not supported`);
    }
  }

  public duplicate(): ImageProcessor {
    const newImageProcessor = new ImageProcessor(
      new Uint8ClampedArray(this.pixelsArray.length),
      this.width,
      this.height,
    )
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const r = this.getPixelValueAt(row, col, ColorChannels.RED);
        const g = this.getPixelValueAt(row, col, ColorChannels.GREEN);
        const b = this.getPixelValueAt(row, col, ColorChannels.BLUE);
        const a = this.getPixelValueAt(row, col, ColorChannels.ALPHA);

        newImageProcessor.setPixelValueAt(row, col, ColorChannels.RED, r);
        newImageProcessor.setPixelValueAt(row, col, ColorChannels.GREEN, g);
        newImageProcessor.setPixelValueAt(row, col, ColorChannels.BLUE, b);
        newImageProcessor.setPixelValueAt(row, col, ColorChannels.ALPHA, a);
      }
    }

    return newImageProcessor;
  }

  public convertImageToGrayScale(): ImageProcessor {
    const newImageProcessor = this.duplicate();

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const r = this.getPixelValueAt(row, col, ColorChannels.RED);
        const g = this.getPixelValueAt(row, col, ColorChannels.GREEN);
        const b = this.getPixelValueAt(row, col, ColorChannels.BLUE);
        const a = this.getPixelValueAt(row, col, ColorChannels.ALPHA);

        const avg = Math.round((r + g + b) / 3);
        newImageProcessor.setPixelValueAt(row, col, ColorChannels.RED, avg);
        newImageProcessor.setPixelValueAt(row, col, ColorChannels.GREEN, avg);
        newImageProcessor.setPixelValueAt(row, col, ColorChannels.BLUE, avg);
        newImageProcessor.setPixelValueAt(row, col, ColorChannels.ALPHA, a);
      }
    }

    return newImageProcessor;
  }

  public getImageData(): ImageData {
    return new ImageData(this.pixelsArray, this.width);
  }
  public getDataView(): DataView {
    return new DataView(this.pixelsArray.buffer);
  }
}