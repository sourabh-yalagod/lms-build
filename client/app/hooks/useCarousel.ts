'use client';
import { useEffect, useState } from 'react';

interface CarouselProps {
  totalImages: number;
  interval: number;
}
export const useCarousel = ({ totalImages, interval = 5000 }: CarouselProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    const imageInterval = setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % totalImages);
    }, interval);
    return () => clearInterval(imageInterval);
  }, [interval, totalImages, currentImage]);
  return currentImage;
};
