import React, {useEffect, useRef, useState} from "react";
import {Button, Divider, Image as AntdImage, List} from 'antd';
import PrinterImage from './3dprinter.jpg';
import {ImageProcessor} from "../../Algorithms/common/ImageProcessor";
import {SobelFilterAlgorithms} from "../../Algorithms/sobel/SobelFilterAlgorithms";

export function SobelFilter(): JSX.Element {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasHRef = useRef<HTMLCanvasElement>(null);
  const canvasVRef = useRef<HTMLCanvasElement>(null);
  const canvasCombinedRef = useRef<HTMLCanvasElement>(null);

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
      if(!canvasCombinedRef || !canvasCombinedRef.current) {
        console.warn('Canvas C was not loaded');
        return;
      }
      const contextH = canvasHRef.current.getContext('2d');
      const contextV = canvasVRef.current.getContext('2d');
      const contextC = canvasCombinedRef.current.getContext('2d');

      if(!contextH) throw new Error(`Missing context H`);
      if(!contextV) throw new Error(`Missing context V`);
      if(!contextC) throw new Error(`Missing context C`);

      canvasHRef.current.width = img.width;
      canvasHRef.current.height = img.height;
      canvasVRef.current.width = img.width;
      canvasVRef.current.height = img.height;
      canvasCombinedRef.current.width = img.width;
      canvasCombinedRef.current.height = img.height;

      contextH.drawImage(img, 0, 0);
      contextV.drawImage(img, 0, 0);
      contextC.drawImage(img, 0, 0);
      const imageData = contextH.getImageData(0, 0, img.width, img.height);
      const imgProcessor = new ImageProcessor(
        imageData.data,
        imageData.width,
        imageData.height,
      );
      const grayScaleH = imgProcessor.convertImageToGrayScale();
      const grayScaleV = imgProcessor.convertImageToGrayScale();
      const grayScaleC = imgProcessor.convertImageToGrayScale();

      const filter = new SobelFilterAlgorithms();
      const horizontalSobel = filter.applyHorizontalSobel(grayScaleH);
      const verticalSobel = filter.applyVerticalSobel(grayScaleV);
      const combinedSobel = filter.applyCombinedSobel(grayScaleC);

      contextH.putImageData(horizontalSobel.getImageData(), 0, 0);
      contextV.putImageData(verticalSobel.getImageData(), 0, 0);
      contextC.putImageData(combinedSobel.getImageData(), 0, 0);
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
    <Divider> Horizontal Sobel </Divider>
    <canvas ref={canvasHRef} />
    <Divider> Vertical Sobel </Divider>
    <canvas ref={canvasVRef} />
    <Divider> Combined Sobel </Divider>
    <canvas ref={canvasCombinedRef} />
  </div>
}