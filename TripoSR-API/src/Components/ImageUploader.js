import React, { useState } from 'react';

function ImageUploader() {
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleUploadClick = () => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    fetch('/upload-image', {
      method: 'POST',
      body: formData,
    })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setUploading(false);
    })
    .catch((error) => {
      console.error(error);
      setUploading(false);
    });
  };

  return (
    <div className='Imageupload'>
      <h1>TripoSR - Image to 3D Generation</h1>
      <h1>Upload Image to Triposr Algorithm</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button  className= "uploadbutton" onClick={handleUploadClick} disabled={uploading}>
        {uploading ? 'Uploading...' : <b>Upload an 2D Image</b>}
      </button>
      {downloadUrl && (
        <a href={downloadUrl} download="3d_object.obj" >
          Download 3D Object
        </a>
      )}
    </div>
  );
}

export default ImageUploader;

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// import React, { useState } from 'react';

// const ImageUploader = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadedFileUrl, setUploadedFileUrl] = useState('');

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleUpload = () => {
//     const formData = new FormData();
//     formData.append('image', selectedFile);

//     fetch('/upload', {
//       method: 'POST',
//       body: formData,
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setUploadedFileUrl(data.url);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

//   return (
//     <div>
//       <h1>TripoSR - Image to 3D Generation</h1>
//       <h2>Add Image:</h2>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload Image</button>
//       {uploadedFileUrl && (
//         <p>
//           Uploaded file URL: <a href={uploadedFileUrl} target="_blank">{uploadedFileUrl}</a>
//         </p>
//       )}
//     </div>
//   );
// };

// export default ImageUploader;