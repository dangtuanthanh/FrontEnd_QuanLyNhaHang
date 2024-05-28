import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faSearch, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
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
    <div
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <label
        style={{
          marginRight: '10px',
          marginBottom:0,
          flexShrink: 0,
          ...props.labelStyle
        }}
      >
        {props.nameCombo}{props.batBuocNhap}
      </label>

      <select
        className="form-select-sm"
        style={{
          marginRight: '10px'
        }}
        value={props.value}
        onChange={handleComboboxChange}
        disabled={props.disabled}
        multiple={props.multiple ? true : undefined}
      >
        {props.combos.map((combo) => (
          <option
            key={combo[props.columnValue]}
            value={combo[props.columnValue]}
          >
            {`${combo[props.columnAdd]}`}
          </option>
        ))}
      </select>
      {
        props.isAdd && <div  onClick={() => props.add()}>
        < FontAwesomeIcon icon={faPlusCircle} />
        </div>
      }
      {
        props.isSearch && <div style={{marginLeft:'0.4rem'}}  onClick={() => props.search(true)}>
        < FontAwesomeIcon icon={faSearch} />
        </div>
      }
      {
        props.isInfo && <div  style={{marginLeft:'0.4rem'}} onClick={props.info}>
        < FontAwesomeIcon icon={faInfoCircle} />
        </div>
      }
      
    </div>
  );
}

export default Combobox;
