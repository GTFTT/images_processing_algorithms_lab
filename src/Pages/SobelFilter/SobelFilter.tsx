import React, {useEffect, useRef, useState} from "react";
import { Image as AntdImage } from 'antd';
import PrinterImage from './3dprinter.jpg';
const Sobel = require('sobel');

export function SobelFilter(): JSX.Element {

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    setImage(img);
    img.src = PrinterImage;
    img.onload = (e) => {
      if(!canvasRef || !canvasRef.current) {
        console.warn('Canvas was not loaded');
        return;
      }
      const context = canvasRef.current.getContext('2d');
      if(!context) throw new Error(`Missing context`);

      canvasRef.current.width = img.width;
      canvasRef.current.height = img.height;

      context.drawImage(img, 0, 0);
      var imageData = context.getImageData(0, 0, img.width, img.height);

      // Sobel constructor returns an Uint8ClampedArray with sobel data
      var sobelData = Sobel(imageData);

      // [sobelData].toImageData() returns a new ImageData object
      var sobelImageData = sobelData.toImageData();
      context.putImageData(sobelImageData, 0, 0);
    }
  }, []);

  const imagePreview = image
    ? <AntdImage
        width={image?.width}
        height={image?.height}
        src={PrinterImage}
      />
    : undefined;

  return <div>
    {imagePreview}
    <canvas
      ref={canvasRef}
    />
    <div>
      Image width(px): {image?.width}
      <br />
      Image height(px): {image?.height}
    </div>
  </div>
}