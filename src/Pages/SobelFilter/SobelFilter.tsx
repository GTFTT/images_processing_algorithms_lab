import React, {useEffect, useRef, useState} from "react";
import {Button, Image as AntdImage} from 'antd';
import PrinterImage from './3dprinter.jpg';
import {ImageProcessor} from "../../Algorithms/common/ImageProcessor";
const Sobel = require('sobel');

export function SobelFilter(): JSX.Element {

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    setImage(img);
    img.src = PrinterImage;
    img.onload = (e) => {
      // if(!canvasRef || !canvasRef.current) {
      //   console.warn('Canvas was not loaded');
      //   return;
      // }
      // const context = canvasRef.current.getContext('2d');
      // if(!context) throw new Error(`Missing context`);
      //
      // canvasRef.current.width = img.width;
      // canvasRef.current.height = img.height;
      //
      // context.drawImage(img, 0, 0);
      // var imageData = context.getImageData(0, 0, img.width, img.height);
      // const imgProcessor = new ImageProcessor(
      //   imageData.data,
      //   imageData.width,
      //   imageData.height,
      // );
      // const grayScale = imgProcessor.convertImageToGrayScale();
      // console.log('imageData.data: ', imageData.data);
      // console.log('grayScale.getImageData(): ', grayScale.getImageData())
      //
      // context.putImageData(grayScale.getImageData(), 0, 0);
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
    <Button
      onClick={() => {
        if(!canvasRef || !canvasRef.current) {
          console.warn('Canvas was not loaded');
          return;
        }
        if(!image) {
          console.warn('Image was not loaded');
          return;
        }
        const context = canvasRef.current.getContext('2d');
        if(!context) throw new Error(`Missing context`);

        canvasRef.current.width = image.width;
        canvasRef.current.height = image.height;

        context.drawImage(image, 0, 0);
        var imageData = context.getImageData(0, 0, image.width, image.height);
        const imgProcessor = new ImageProcessor(
          imageData.data,
          imageData.width,
          imageData.height,
        );
        const grayScale = imgProcessor.convertImageToGrayScale();
        context.putImageData(grayScale.getImageData(), 0, 0);
      }}
    >
      Get grayscale
    </Button>
    <div>
      Image width(px): {image?.width}
      <br />
      Image height(px): {image?.height}
    </div>
  </div>
}