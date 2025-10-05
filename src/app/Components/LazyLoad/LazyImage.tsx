import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface ILazyImage {
  src: string;
  defaultImage?: string;
  className?: string;
  style?: any;
  width?: any;
  height?: any;
  alt?: any;
  onClick?: any;
  title?: string;
}

const addDefaultImg = (ev: any, defaultImage: string) => {
  ev.target.src = defaultImage;
};

const LazyImage = ({
  src = "",
  alt,
  defaultImage = "/assets/img/default-image.svg",
  className = "image",
  ...props
}: ILazyImage) => {
  const [isInView, setIsInView] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={isInView ? src : defaultImage}
      alt={alt || "Fusion"}
      {...props}
      onError={(e: any) => addDefaultImg(e, defaultImage)}
      className={className}
    />
  );
};

export const Image = styled.img`
  &.avatar {
    border-radius: 50% !important;
    object-fit: cover !important;
  }
`;

export default LazyImage;
