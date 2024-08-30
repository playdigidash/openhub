import React, {useState} from "react";

function Textbox(){
    const[text, setText] = useState("");
    const[file, setFiles] = useState();
    const handleClick = (e) =>e.target.textContent = "Please Wait Your 3D Object is Being Generated";

    function handleTextboxChange(event){
        setText(event.target.value)
    }

    function handleFileChange(e){
        console.log(e.target.file);
        setFiles(URL.createObjectURL(e.target.file[0]));
    }

    return(<div className="ParentText"> 
    <div className="Textbox">
        <h1>Dream Fusion - Text to 3D Generation</h1>
        <textarea value={text} onChange={handleTextboxChange}
        placeholder="Enter the Description" rows={10} cols={130}/>
    </div>
    <div className="ImageFile">
            <h1>TripoSR - Image to 3D Generation</h1>
             <h2>Add Image:</h2>
            <input type="file" onChange={handleFileChange} />
            <img src={file} />
    </div>
    <br />
    {/* <button className="Button" onClick={(e) => handleClick(e)} >Generate 3D Objects 🌟</button>  */}

    </div>)
}

export default Textbox