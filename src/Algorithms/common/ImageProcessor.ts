
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

  public convertImageToGrayScale(): ImageProcessor {
    const grayscaleData: Uint8ClampedArray = new Uint8ClampedArray(this.pixelsArray.length);
    const newImageProcessor = new ImageProcessor(
      grayscaleData,
      this.width,
      this.height,
    )

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const r = this.getPixelValueAt(y, x, ColorChannels.RED);
        const g = this.getPixelValueAt(y, x, ColorChannels.GREEN);
        const b = this.getPixelValueAt(y, x, ColorChannels.BLUE);
        const a = this.getPixelValueAt(y, x, ColorChannels.ALPHA);

        const avg = Math.round((r + g + b) / 3);
        newImageProcessor.setPixelValueAt(y, x, ColorChannels.RED, avg);
        newImageProcessor.setPixelValueAt(y, x, ColorChannels.GREEN, avg);
        newImageProcessor.setPixelValueAt(y, x, ColorChannels.BLUE, avg);
        newImageProcessor.setPixelValueAt(y, x, ColorChannels.ALPHA, a);
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