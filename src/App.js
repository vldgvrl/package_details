import React from 'react';
import logo from './logo.svg';
import './App.css';
import UploadFile from './UploadFile';


function App() {
  return (
    <div id="content">
        <h1>This is a program that exposes key information about packages on Debian and Ubuntu 
                systems through the /var/lib/dpkg/status file</h1>
        <UploadFile />
    </div>

  );


}


    
export default App;
