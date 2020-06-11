import React, { useState, useEffect } from "react";
import { MdSend } from "react-icons/md";
import axios from "axios";

export default function Cep() {
  const [cep, setCep] = useState("0");
  const [cidade, setCidade] = useState({});
  const [temperatura, setTemperatura] = useState({});
  const [msgErro, setMsgErro] = useState("");

  useEffect(() => {
    setCep("01001-000");
  }, []);

  function handleMsgErro() {
    setMsgErro("Não foi possível encontrar o cep informado.");
    setTimeout(function () {
      setMsgErro("");
    }, 3000);
  }

  function handleInputCep(event) {
    setCep(event.target.value);
  }

  function handleCepClick() {
    setTemperatura({});
    setCidade({});
    setMsgErro("");

    axios
      .get(`http://viacep.com.br/ws/${cep}/json/`)
      .then((response) => {
        if (response.data.erro) {
          handleMsgErro();
          return;
        }

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
            setTemperatura({
              temp: response.data.results.temp,
              description: response.data.results.description,
              date: response.data.results.date,
              time: response.data.results.time,
              previsao: response.data.results.forecast,
            });
          })
          .catch((error) => {
            handleMsgErro();
            console.log("Erro ao consultar hgbrasil: " + error.message);
          });
      })
      .catch((error) => {
        handleMsgErro();
        console.log("Erro ao consultar Viacep: " + error.message);
      });
  }

  function ExibeTemperaturaAtual() {
    if (cidade.localidade && temperatura.temp) {
      return (
        <span>
          {`${cidade.localidade}, ${cidade.uf}. ${temperatura.temp}°C, ${temperatura.description}`}
        </span>
      );
    }
    return <></>;
  }

  function Previsao(props) {
    //console.log(props);

    return (
      <span className="box">
        <span className="data">{props.temp.data}</span>
        <span className="max">{props.temp.max}°C</span>
        {/* <span className="descricao">{props.temp.descricao}</span> */}
        <span className="min">{props.temp.min}°C</span>
      </span>
    );
  }

  return (
    <>
      <span id="msgerro" className={msgErro ? "show-erro" : "hide-erro"}>
        {msgErro}
      </span>

      <div id="cep">
        <input
          type="text"
          placeholder="Informe o cep"
          value={cep}
          size="9"
          maxLength="9"
          onChange={handleInputCep}
        ></input>

        <MdSend id="cep-icon" onClick={handleCepClick}></MdSend>
      </div>

      <div id="localidade">
        {/* <span>{exibeTemperaturaAtual()}</span> */}
        <ExibeTemperaturaAtual></ExibeTemperaturaAtual>
      </div>

      {temperatura.temp && (
        <div id="temperaturas">
          {/* <ul>
            {temperatura.previsao.map((item) => (
              <li key={item.date}>
                {item.date} - Max/min: {item.max}/{item.min}
                {item.description}{" "}
              </li>
            ))}
          </ul> */}
          {temperatura.previsao.slice(1, 4).map((item) => (
            <Previsao
              temp={{
                data: item.date,
                max: item.max,
                min: item.min,
                descricao: item.description,
              }}
              key={item.date}
            ></Previsao>
          ))}
        </div>
      )}
    </>
  );
}
