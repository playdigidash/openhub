import {useNavigate} from  'react-router-dom';
function DropdownMenu() {
    const navigate = useNavigate();
  
    const handleChange = (event) => {
      navigate(event.target.value);
    };
  
    return (
      <select onChange={handleChange}>
        <option value="/">Meshy App</option>
        <option value="/modelviewer">Model Viewer</option>
        <option value="/">Meshy Image to 3D</option>
      </select>
    );
  }

  export  default DropdownMenu;
