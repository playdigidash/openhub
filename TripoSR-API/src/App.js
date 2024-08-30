// import logo from './logo.svg';
import './App.css';
// import Company from './Components/Company';
// import Intro from './Components/Intro';
// import TextInput from './Components/TextInput';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Textbox from './Components/Textbox';
import Button from './Components/Button';
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
      <Textbox />
      <Button />
      <Footer />
    </div>
  );
}

export default App;