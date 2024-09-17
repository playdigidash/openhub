import React, {useState, useEffect} from "react";
// import axios from "axios";

function Textbox(){
    const[text, setText] = useState("");
    // const[file, setFiles] = useState();
    const[error, setError] = useState("");
    const[selectData, setSelectdata] = useState([])

    useEffect( () => {
        let processing = true
        fetchData(processing)
        return() => {
            processing = false
        }
    })

    const fetchData = async(processing) => {
        await fetch("http://localhost:4000")
        .then(response => response.json())
        .then(data  => 
            { if(processing){
                setSelectdata(data)
            }
            })

        .catch(err => console.log(err))

    }
    const handleClick = (e) => {
        e.preventDefault();
        e.target.textContent = "Please Wait Your 3D Object is Being Generated";
        console.log(text)

        if(!text)
            {
                setError(<p className="required">"Message is empty. Please type the message"</p>);
            }
            else{
                setError('')
                // setFiles('')
            }
    }
    function handleTextboxChange(event){
        setText(event.target.value)
    }

    // function handleFileChange(e){
    //     console.log(e.target.file);
    //     setFiles(URL.createObjectURL(e.target.file[0]));
    // }

    return(<div className="ParentText"> 
    <div className="Textbox">
        <h1>Dream Fusion - Text to 3D Generation</h1>
        <textarea id= "message" name="message" value={text} onChange={handleTextboxChange}
        placeholder="Enter the Description" rows={10} cols={130}/>
    </div>
    {/* <div className="ImageFile">
            <h1>TripoSR - Image to 3D Generation</h1>
             <h2>Add Image:</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} >Upload</button>

    </div> */}
    {error}
    <br />
    <div className="Container">
    <button className="Button" onClick={(e) => handleClick(e)}>Generate 3D Objects 🌟</button>
    </div>
    </div>)
}

export default Textbox