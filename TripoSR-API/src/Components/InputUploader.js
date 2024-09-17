import React, { useState } from 'react';
import axios from  'axios';


const InputUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [uploadedText, setUploadedText] = useState('');
  const [disabled, setDisabled] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setDisabled(true);
  };

  const handleTextChange = (event) => {
    setTextInput(event.target.value);
    setDisabled(true);
  };

  const handleUpload = () => {
    if (selectedFile!=null && textInput===' ') {

      const formData = new FormData();
      formData.append('file', selectedFile);

        axios.post('/upload', { file: formData })
         .then(response => {
       console.log(response);
  })
  .catch(error => {
    console.error(error);
  });
    } else if (textInput  && selectedFile==null) {

      fetch('/upload', {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({ text: textInput }),
      })
        .then((response) => response.json())
        .then((data) => {
          setUploadedText(data.text);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div>
    <ul>
        <h1>TripoSR - Image to 3D Generation</h1>
        <h2>Add Image:</h2>
        <input type="file" onChange={handleFileChange} disabled ={disabled}  />
    </ul>
    <ul className='Textbox'>  
      <h1>Dream Fusion - Text to 3D Generation</h1>
      <input type="text" value={textInput}  onChange={(e) => setTextInput(e.target.value)} disabled ={disabled} />

    </ul>
      {/* <input type="file" onChange={handleFileChange} /> */}
      <button onClick={handleUpload}>Upload</button>
      {uploadedFileUrl && (
        <p>
          Uploaded file URL: <a href={uploadedFileUrl} target="_blank">{uploadedFileUrl}</a>
        </p>
      )}
      {uploadedText && (
        <p>
          Uploaded text: {uploadedText}
        </p>
      )}
    </div>
  );
};

export default InputUploader;
// import React, { useState } from 'react';
// import axios from 'axios';

// const FileUploader = () =>{
//   const [image, setImage] = useState({ preview: '', raw: '' });
//   const [status, setStatus] = useState('');

//   const handlePhotoChange = (e) => {
//     if (e.target.files.length) {
//       setImage({
//         preview: URL.createObjectURL(e.target.files[0]),
//         raw: e.target.files[0],
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let formData = new FormData();
//     formData.append('file', image.raw);

//     const response = await axios.post('http://localhost:5000/image', formData);
//     if (response) setStatus(response.statusText);
//   };

//   return (
//     <div className='App'>
//       <h1>Upload to server</h1>
//       {image.preview && <img src={image.preview} width='100' height='100' />}
//       <hr />
//       <form onSubmit={handleSubmit}>
//         <input type='file' name='file' id='upload-button' style={{ display: 'none' }} onChange={handlePhotoChange} />
//         <label htmlFor='upload-button'>Upload Image</label>
//         <button type='submit'>Submit</button>
//       </form>
//       {status && <h4>{status}</h4>}
//     </div>
//   );
// };

// export default FileUploader;