import React from "react";

type TongueUProps = {
  className?: string;
};

const TongueU: React.FC<TongueUProps> = ({ className }) => (
  <svg
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10,10 L10,60 Q50,90 90,60 L90,10"
      stroke="currentColor"
      strokeWidth="10"
      fill="none"
    />
  </svg>
);

export default TongueU;
