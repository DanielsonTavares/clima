import React from "react";
import "./App.css";
import Cep from "./componentes/cep";

function App() {
  return (
    <div className="App">
      <h1>Informe o cep para ver o clima de sua região</h1>
      <Cep></Cep>
    </div>
  );
}

export default App;
