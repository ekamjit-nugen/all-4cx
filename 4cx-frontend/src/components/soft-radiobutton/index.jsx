import React from "react";

const SoftRadioButton = ({ options, selectedValue, onChange, name, fontWeight }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {options.map((option) => (
        <label
          key={option.value}
          style={{ marginRight: "10px", display: "flex", gap: 20, fontSize: 14,fontWeight }}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            style={{ zoom: "1.5" }}
            checked={selectedValue === option.value}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default SoftRadioButton;
