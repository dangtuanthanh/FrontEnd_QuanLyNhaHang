import { useState } from 'react';

function Multiselect({ name, data, onChange }) {

  const [selected, setSelected] = useState([]);
  

  // Handle select option
  const handleChange = (item) => {
    if(selected.includes(item)) {
      setSelected(selected.filter(i => i !== item)); 
    } else {
      setSelected([...selected, item]);
    }
    onChange(selected);
  }

  // Render options
  const options = data.map((item) => (
    <option 
      key={item.IDVaiTro}
      value={item.IDVaiTro}
    >
      {item.TenVaiTro}
    </option>
  ));

  return (
    <select
      name={name}
      multiple 
      value={selected}
      onChange={(e) => handleChange(e.target.value)} 
    >
      {options}
    </select>
  );
}

export default Multiselect;
