import React, { useState, useEffect } from "react";
import { MdSend } from "react-icons/md";
import axios from "axios";

export default function Cep() {
  const [cep, setCep] = useState("0");
  const [cidade, setCidade] = useState({});
  const [temperatura, setTemperatura] = useState({});

  useEffect(() => {
    setCep("01001-000");
  }, []);

  function handleInputCep(event) {
    setCep(event.target.value);
  }

  function handleCepClick() {
    setTemperatura({});

    axios.get(`http://viacep.com.br/ws/${cep}/json/`).then((response) => {
      setCidade({
        localidade: response.data.localidade,
        uf: response.data.uf,
      });

      /* Devido ao CORS tive que usar um proxy, conforme https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe */
      const proxyurl = "https://cors-anywhere.herokuapp.com/";

      axios
        .get(
          `${proxyurl}https://api.hgbrasil.com/weather?key=4ca37f5d&city_name=${response.data.localidade},${response.data.uf}`
        )
        .then((response) => {
          //console.log(response.data.results);
          setTemperatura({
            temp: response.data.results.temp,
            description: response.data.results.description,
            date: response.data.results.date,
            time: response.data.results.time,
            previsao: response.data.results.forecast,
          });
        });
    });
  }

  return (
    <>
      <div id="cep">
        <input
          type="text"
          placeholder="00000-000"
          value={cep}
          onChange={handleInputCep}
        ></input>

        <MdSend id="cep-icon" onClick={handleCepClick}></MdSend>
      </div>
      <div>
        {cidade.localidade && (
          <p>{`Previsão do tempo para: ${cidade.localidade}, ${cidade.uf}`} </p>
        )}
      </div>

      {temperatura.temp && (
        <div>
          {`Temperatura: ${temperatura.temp}, ${temperatura.description}`}
          <ul>
            {temperatura.previsao.map((item) => (
              <li key={item.date}>
                {item.date} - Max/min: {item.max}/{item.min} =>{" "}
                {item.description}{" "}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
