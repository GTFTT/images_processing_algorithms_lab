import React, {useEffect, useRef, useState} from "react";
import { Divider, Image as AntdImage } from 'antd';
import PeopleImage from './people_walking.jpg';
import {ImageProcessor} from "../../Algorithms/common/ImageProcessor";
const cocoSsd = require('@tensorflow-models/coco-ssd');

export function PeopleSearching(): JSX.Element {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    setImage(img);
    img.src = PeopleImage;
    img.onload = (e) => {
      const currentCanvas = canvasRef.current;
      if(!currentCanvas) {
        console.warn('Canvas was not loaded');
        return;
      }
      const context = currentCanvas.getContext('2d');

      if(!context) throw new Error(`Missing context H`);

      currentCanvas.width = img.width;
      currentCanvas.height = img.height;

      context.drawImage(img, 0, 0);

      const imageData = context.getImageData(0, 0, img.width, img.height);
      const imgProcessor = new ImageProcessor(
        imageData.data,
        imageData.width,
        imageData.height,
      );

      context.putImageData(imgProcessor.getImageData(), 0, 0);

      const doStuff = async () => {
        const model = await cocoSsd.load();
        const predictions = await model.detect(img);
        predictions.forEach((prediction: any) => {
          const { class: className, score, bbox } = prediction;
          const [x, y, width, height] = bbox;
          console.log(`Class: ${className}, Score: ${score}, BBox: (${x}, ${y}, ${width}, ${height})`);
          context.strokeRect(x, y, width, height); // Draw box on canvas
        });
      }

      doStuff().then(() => {
        console.log('Magic trick was done successfully')
      }).catch((e: any) => {
        console.log('Something went wrong');
        console.error(e);
      });
    }
  }, []);

  const imagePreview = image
    ? <AntdImage
        width={image?.width}
        height={image?.height}
        src={PeopleImage}
      />
    : undefined;

  return <div>
    <Divider> Original </Divider>
    {imagePreview}
    <Divider> Statistics </Divider>
    <div>
      Image width(px): {image?.width}
      <br />
      Image height(px): {image?.height}
    </div>
    <Divider> Recognized objects </Divider>
    <canvas ref={canvasRef} />
  </div>
}