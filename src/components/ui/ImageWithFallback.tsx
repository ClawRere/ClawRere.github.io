import React, { useState } from 'react';
import { getPostCover } from '@/lib/covers';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackKey?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Image',
  className = '',
  fallbackSrc,
  fallbackKey = 'default',
  ...props
}) => {
  const defaultFallback = fallbackSrc || getPostCover(null, fallbackKey);
  const [imgSrc, setImgSrc] = useState<string>(src && src.trim() ? src : defaultFallback);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(defaultFallback);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};

export default ImageWithFallback;
