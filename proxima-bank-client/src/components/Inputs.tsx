import * as React from "react";

export const InputWithLabel: React.FC<{
  label: string;
  onChangeCallback: (text: string) => void;
  value: string;
  placeholder: string;
}> = ({ label, onChangeCallback, value, placeholder = "Enter" }) => (
  <div className="space-y-2">
    <label className="text-lg font-thin tracking-wide">{label}</label>
    <input
      type="text"
      className="standard-input"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChangeCallback(e.target.value)}
    />
  </div>
);
