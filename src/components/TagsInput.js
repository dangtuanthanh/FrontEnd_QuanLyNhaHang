function TagsInput({data, onChange}) {
    const [tags, setTags] = useState([]);
  
    const handleAddTag = (tag) => {
      setTags([...tags, tag]);
    }
  
    const handleRemoveTag = (tag) => {
      setTags(tags.filter(t => t !== tag)); 
    }
  
    return (
      <div>
        <ul>
          {tags.map(tag => (
            <li key={tag.id}>
              {tag.text} 
              <button onClick={() => handleRemoveTag(tag)}>X</button>
            </li>
          ))}  
        </ul>
  
        <select 
          value={selected}
          onChange={handleChange}>
          <option value="">Chọn thẻ</option>  
          {data.map(option => (
            <option key={option.id} value={option}>
              {option.text}
            </option>
          ))}
        </select>
  
        <button onClick={handleAddTag}>Thêm</button>
      </div>
    )
  }