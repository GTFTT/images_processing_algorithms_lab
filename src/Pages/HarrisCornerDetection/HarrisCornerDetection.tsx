import React, {useEffect, useRef, useState} from "react";
import {Button, Divider, Image as AntdImage, List} from 'antd';
import PrinterImage from './chess.jpg';
import {ImageProcessor} from "../../Algorithms/common/ImageProcessor";
import {SobelFilterAlgorithms} from "../../Algorithms/sobel/SobelFilterAlgorithms";
import {HarrisCornerDetector} from "../../Algorithms/harris/HarrisCornerDetector";

export function HarrisCornerDetection(): JSX.Element {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasHRef = useRef<HTMLCanvasElement>(null);
  const canvasVRef = useRef<HTMLCanvasElement>(null);
  const canvasHarrisRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    setImage(img);
    img.src = PrinterImage;
    img.onload = (e) => {
      if(!canvasHRef || !canvasHRef.current) {
        console.warn('Canvas H was not loaded');
        return;
      }
      if(!canvasVRef || !canvasVRef.current) {
        console.warn('Canvas V was not loaded');
        return;
      }
      if(!canvasHarrisRef || !canvasHarrisRef.current) {
        console.warn('Canvas C was not loaded');
        return;
      }
      const contextH = canvasHRef.current.getContext('2d');
      const contextV = canvasVRef.current.getContext('2d');
      const contextHarris = canvasHarrisRef.current.getContext('2d');

      if(!contextH) throw new Error(`Missing context H`);
      if(!contextV) throw new Error(`Missing context V`);
      if(!contextHarris) throw new Error(`Missing context Harris`);

      canvasHRef.current.width = img.width;
      canvasHRef.current.height = img.height;
      canvasVRef.current.width = img.width;
      canvasVRef.current.height = img.height;
      canvasHarrisRef.current.width = img.width;
      canvasHarrisRef.current.height = img.height;

      contextH.drawImage(img, 0, 0);
      contextV.drawImage(img, 0, 0);
      contextHarris.drawImage(img, 0, 0);
      const imageData = contextH.getImageData(0, 0, img.width, img.height);
      const imgProcessor = new ImageProcessor(
        imageData.data,
        imageData.width,
        imageData.height,
      );
      const grayScaleH = imgProcessor.convertImageToGrayScale();
      const grayScaleV = imgProcessor.convertImageToGrayScale();

      const filter = new SobelFilterAlgorithms();
      const horizontalSobel = filter.applyHorizontalSobel(grayScaleH);
      const verticalSobel = filter.applyVerticalSobel(grayScaleV);

      const harrisCornerDetector = new HarrisCornerDetector();
      const harrisMatrix = harrisCornerDetector.computeHarrisMatrixElements(horizontalSobel, verticalSobel);
      const harrisMarked = harrisCornerDetector.markCorners(harrisMatrix, imgProcessor.duplicate());

      contextH.putImageData(horizontalSobel.getImageData(), 0, 0);
      contextV.putImageData(verticalSobel.getImageData(), 0, 0);
      contextHarris.putImageData(harrisMarked.getImageData(), 0, 0);
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
    <Divider> Original </Divider>
    {imagePreview}
    <Divider> Statistics </Divider>
    <div>
      Image width(px): {image?.width}
      <br />
      Image height(px): {image?.height}
    </div>
    <Divider> Harris algorithm </Divider>
    <canvas ref={canvasHarrisRef} />
    <Divider> Horizontal Sobel </Divider>
    <canvas ref={canvasHRef} />
    <Divider> Vertical Sobel </Divider>
    <canvas ref={canvasVRef} />
  </div>
}