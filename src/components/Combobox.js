import React, { useState,useEffect } from 'react';
function Combobox(props) {
  const [selected, setSelected] = useState([]);
  useEffect(() => {
    props.onChange(selected);
}, [selected]);
  const handleComboboxChange = (event) => {
    if (props.multiple === true) {
      if (selected.includes(event.target.value)) {
        setSelected(selected.filter(i => i !== event.target.value));
      } else {
        setSelected([...selected, event.target.value]);
      }
      
    } else {
      props.onChange(event.target.value);
    }
    
  };
  return (
    <div>
      <label style={props.labelStyle}>{props.nameCombo}{props.batBuocNhap}ㅤ</label>
      <select
        className="form-select-sm"
        value={props.value}
        onChange={handleComboboxChange}
        disabled={props.disabled}
        multiple={props.multiple ? true : undefined}
      >
        {props.combos.map((combo) => (
          <option key={combo[props.columnValue]} value={combo[props.columnValue]}>
            {`${combo[props.columnValue]} - ${combo[props.columnAdd]}`}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Combobox;
