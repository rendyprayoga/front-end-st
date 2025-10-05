import LazyImage from "../LazyLoad/LazyImage";
import { DFlex } from "../../react-table/flex.styled";
import React from "react";
import styled from "styled-components";

// Helper untuk mendapatkan URL dari CDN (jika belum dibuat)
interface IconItemProps {
  iconUpload?: any;
  iconLib?: any;
  file?: any;
  iconName?: any;
  color?: string;
  iconStyle?: "light" | "regular" | "bold" | "fill" | "duotone" | any;
  fontSize?: any;
  size?: string;
  target?: string;
  iconType?: any;
}

const RenderIcon = ({
  iconUpload,
  iconLib,
  file,
  iconName,
  color,
  fontSize,
  iconStyle = "regular",
  size,
  target,
  iconType,
}: IconItemProps) => {
  // if (!iconUpload) return null

  if (iconUpload === "svg") {
    return (
      <WrapperIcon size={size}>
        <div dangerouslySetInnerHTML={{ __html: file || "" }} />
      </WrapperIcon>
    );
  }

  if (iconType === "font-awesome") {
    return (
      <DFlexIcon>
        <span
          dangerouslySetInnerHTML={{
            __html: `<i class="${iconName}"></i>`,
          }}
        ></span>
      </DFlexIcon>
    );
  }

  if (iconLib === "svg-code") {
    return (
      <WrapperIcon size={size}>
        <div dangerouslySetInnerHTML={{ __html: iconName || "" }} />
      </WrapperIcon>
    );
  }

  if (iconUpload === "sample") {
    return (
      <WrapperIcon>
        <LazyImage
          defaultImage="/static/empty-1.png"
          src={file || ""}
          alt="Uploaded File"
        />
      </WrapperIcon>
    );
  }

  if (iconLib === "fontawesome") {
    return (
      <WrapperIcon>
        <i className={`${iconName} fa-5x`}></i>
      </WrapperIcon>
    );
  }

  if (iconLib === "font-awesome") {
    return (
      <WrapperIcon>
        <i className={`${iconName} fa-5x`}></i>
      </WrapperIcon>
    );
  }

  if (iconLib === "phosphor") {
    return (
      <WrapperIcon color={color} size={size}>
        <i
          className={`${
            iconStyle === "light"
              ? "ph-light"
              : iconStyle === "regular"
              ? "ph"
              : iconStyle === "bold"
              ? "ph-bold"
              : iconStyle === "fill"
              ? "ph-fill"
              : iconStyle === "duotone"
              ? "ph-duotone"
              : "ph" // Default
          } ph-${iconName}`}
          style={{ color: color || "inherit", fontSize: `${fontSize}` }}
        ></i>
      </WrapperIcon>
    );
  }

  if (iconLib === "custom") {
    return (
      <i
        className={`${
          iconStyle === "light"
            ? "ph-light"
            : iconStyle === "regular"
            ? "ph"
            : iconStyle === "bold"
            ? "ph-bold"
            : iconStyle === "fill"
            ? "ph-fill"
            : iconStyle === "duotone"
            ? "ph-duotone"
            : "ph" // Default
        } ph-${iconName}`}
        style={{ color: color || "inherit", fontSize: `${fontSize}` }}
      ></i>
    );
  }

  return <></>;

  // return (
  //   <WrapperIcon>
  //     <LazyImage defaultImage="/static/empty-1.png" src={cdnUrl(file || '')} alt="Fallback File" />
  //   </WrapperIcon>
  // )
};

export default RenderIcon;

const WrapperIcon = styled.div<{ size?: string }>`
  justify-content: center;
  align-items: center;

  span,
  div,
  svg,
  i,
  img {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: ${({ size }) => size || "1.5rem"};
    min-width: ${({ size }) => size || "1.5rem"};
    min-height: ${({ size }) => size || "1.5rem"};
    max-width: ${({ size }) => size || "1.5rem"};
    max-height: ${({ size }) => size || "1.5rem"};
  }
`;

const DFlexIcon = styled(DFlex)<{ size?: string }>`
  justify-content: center;
  align-items: center;

  span,
  div,
  svg,
  img {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: ${({ size }) => size || "1.5rem"};
    min-width: ${({ size }) => size || "1.5rem"};
    min-height: ${({ size }) => size || "1.5rem"};
    max-width: ${({ size }) => size || "1.5rem"};
    max-height: ${({ size }) => size || "1.5rem"};
  }
`;
