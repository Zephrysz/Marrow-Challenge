import React from 'react';

interface DropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, selectedValue, onChange }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium mb-2">{label}</label>
        <select
        value={selectedValue}
        onChange={onChange}
        className="mt-1 p-2 border rounded-md w-full bg-neutral-800"
        >
        {options.map((option) => (
            <option key={option.value} value={option.value}>
            {option.label}
            </option>
        ))}
        </select>
    </div>
);

export default Dropdown;
