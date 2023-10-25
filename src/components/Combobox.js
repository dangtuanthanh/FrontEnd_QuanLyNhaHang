import React, { useState } from 'react';

function Combobox({ combos, columnValue, columnAdd, nameCombo, idCombo, defaultValue, onChange }) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleComboboxChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    onChange(selectedValue);
  };

  return (
    <div>
      <label htmlFor={idCombo}>{nameCombo}</label>
      <select className="form-select-sm" id={idCombo} value={selectedValue} onChange={handleComboboxChange}>
        {combos.map((combo) => (
          <option key={combo[columnValue]} value={combo[columnValue]}>
            {`${combo[columnValue]} - ${combo[columnAdd]}`}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Combobox;