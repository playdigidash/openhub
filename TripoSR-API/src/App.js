// import logo from './logo.svg';
import './App.css';
// import Company from './Components/Company';
// import Intro from './Components/Intro';
// import TextInput from './Components/TextInput';
import Header from './Components/Header';
import Footer from './Components/Footer';
import InputUploader from './Components/InputUploader';
import ImageUploader from './Components/ImageUploader';
// import Textbox from './Components/Textbox';
// import ImageUploader from './Components/ImageUploader';
// import Button from './Components/Button';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import BackDrop from './Components/Backdrop';


function App() {
  return (
    <div className="App">
      {/* <Company />
      <Intro />
      <TextInput /> */}
      {/* <BackDrop /> */}
      <Header />
      <br></br>
      {/* <InputUploader /> */}
      <ImageUploader />
      {/* <ul>
        <ul><Textbox /></ul>
        <ul><ImageUploader /></ul>
      </ul> */}
      {/* <ImageUploader/>
      <Textbox /> */}
      {/* <Button /> */}
      <Footer />
    </div>
  );
}

export default App;