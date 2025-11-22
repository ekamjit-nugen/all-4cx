import React, { useState } from "react";

const Image = ({ src, alt, width, height, quality, className, ...props }) => {
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    setIsError(true);
  };

  const imgSrc = quality ? `${src}?q=${quality}` : src;

  return (
    <div style={{ width: width, height: height }} className={className}>
      {isError ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f0f0",
          }}
        >
          <p>Image not available</p>
        </div>
      ) : (
        <img
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
};

export default Image;
