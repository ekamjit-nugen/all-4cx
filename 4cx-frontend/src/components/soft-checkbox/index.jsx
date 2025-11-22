import React, { useState } from "react";

const SoftCheckBox = ({
  options,
  onChange,
  style,
  placeholder,
  optionStyle,
  selectedValue = [],
}) => {
  const [selectedOptions, setSelectedOptions] = useState(selectedValue);

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setSelectedOptions((prevSelectedOptions) => {
      const isChecked = event.target.checked;
      if (isChecked) {
        const newSelectedOptions = [...prevSelectedOptions, value];
        onChange(newSelectedOptions);
        return newSelectedOptions;
      } else {
        const newSelectedOptions = prevSelectedOptions.filter((option) => option !== value);
        onChange(newSelectedOptions);
        return newSelectedOptions;
      }
    });
  };

  return (
    <div style={style}>
      {options.map((option) => (
        <div
          key={option.value}
          style={{
            background: "#edf2f6",
            padding: "10px 20px",
            borderRadius: 20,
            display: "flex",
            fontSize: "14px",
            gap: 10,
            ...optionStyle,
          }}
        >
          <input
            type="checkbox"
            value={option.value}
            onChange={handleCheckboxChange}
            placeholder={placeholder}
            style={{
              accentColor: "#000",
              zoom: "1.5",
            }}
            checked={selectedValue?.includes?.(option.value)}
          />
          <label style={{ color: "black", fontSize: 14 }}>{option.label}</label>
        </div>
      ))}
    </div>
  );
};

export default SoftCheckBox;
