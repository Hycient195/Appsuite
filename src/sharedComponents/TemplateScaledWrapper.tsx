
import React, { ReactNode } from "react";

interface ScaledWrapperProps {
  children: ReactNode;
  scale: number; // Scale factor (e.g., 0.3 for 30%)
  className?: string; // Optional additional classes
  onClick?: any
}

const TemplatePreviewScaledWrapper: React.FC<ScaledWrapperProps> = ({
  children,
  scale,
  className = "",
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-block relative h-[520px] w-[370px] ${className}`}
      style={{
        // transform: `scale(${scale})`,
        transformOrigin: "top left",
        // width: `calc(100% * ${scale})`,
        // height: `calc(100% * ${scale})`,
      }}
    >
      <div
        style={{
          // transform: `scale(${scale})`,
          transformOrigin: "top left",
          // width: `calc(100% * ${scale})`,
          // height: `calc(100% * ${scale})`,
        }}
        className="absolute w-[900px] z-[1] top-0 left-0 scale-[0.41]">{children}</div>
    </div>
  );
};

export default TemplatePreviewScaledWrapper