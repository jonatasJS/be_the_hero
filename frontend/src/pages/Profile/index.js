import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPower, FiTrash2 } from "react-icons/fi";

import api from "../../services/api";
import Modal from "../../components/Modal";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { LoadingCard } from "../../components/LoadingCard";

import logoImg from "../../assets/logo.svg";
import heroImg from "../../assets/hero.png";

export default function Profile() {
  const [incidents, setIncidents] = useState([]);
  const [incidentSelected, setIncidentSelected] = useState(null);
  const [deleteIncidentId, setDeleteInidentId] = useState("");
  const [loadingDeleteCase, setLoadingDeleteCase] = useState(false);
  const [loadingCases, setLoadingCases] = useState(false);

  const navigate = useNavigate();

  const ongId = localStorage.getItem("ongId");
  const ongName = localStorage.getItem("ongName");

  useEffect(() => {
    setLoadingCases(true);
    api
      .get("profile", {
        headers: {
          Authorization: ongId,
        },
      })
      .then((response) => {
        setIncidents(response.data);
        setLoadingCases(false);
      });
  }, [ongId]);

  async function handleDeleteIncident(id) {
    updateIncidentsValues(id);
    setLoadingDeleteCase(true);
    document.getElementById("staticBackdropButton").click();
  }

  function handleLogout() {
    localStorage.clear();

    navigate("/");
  }

  async function handleModalChoise(choise) {
    if (choise) {
      try {
        await api.delete(`incidents/${deleteIncidentId}`, {
          headers: {
            Authorization: ongId,
          },
        });

        setIncidents(
          incidents.filter((incident) => incident.id !== deleteIncidentId)
        );
        setLoadingDeleteCase(false);
      } catch (err) {
        setLoadingDeleteCase(false);
        alert("Erro ao deleter caso. Tente novamente.");
      }
    } else {
      setDeleteInidentId("");
      setLoadingDeleteCase(false);
    }
  }

  function updateIncidentsValues(id) {
    setDeleteInidentId(id);
    const incident = incidents.find((incident) => incident.id === id);
    setIncidentSelected(incident);
  }

  return (
    <div className="h-screen w-full m-auto max-w-5xl flex items-center justify-center">
      <Modal onHandleChoise={handleModalChoise} incident={incidentSelected} />

      <div className="absolute top-0 w-full max-w-6xl px-0 py-8 mx-8 my-auto">
        <header className="flex items-center justify-between">
          <div className="flex items-center">
            <img className="h-16" src={logoImg} alt="Be The Hero" />
            <span className="text-xl ml-6">Bem Vinda, {ongName}</span>
          </div>

          <div className="flex items-center">
            <Link
              className="bg-red-500 h-14 text-lg hover:bg-red-700 text-white items-center font-semibold flex py-2 px-4 rounded"
              to="/incidents/new"
            >
              Cadastrar novo caso
            </Link>
            <button
              className="flex justify-center items-center h-14 w-14 rounded border bg-transparent ml-4 transition hover:bg-slate-100"
              onClick={handleLogout}
              type="button"
            >
              <FiPower size={18} color="#E02041" />
            </button>
          </div>
        </header>
        {incidents.length > 0 && (
          <h1 className="mt-20 mb-6">Casos cadastrados:</h1>
        )}
        <ul className="grid grid-cols-3 gap-3 list-none">
          {loadingCases ? (
            <LoadingCard />
          ) : (
            incidents.length > 0 &&
            incidents.map((incident) => (
              <li
                className="p-6 rounded relative shadow flex justify-between"
                key={incident.id}
              >
                <div>
                  <strong className="block mb-1 text-zinc-600">CASO:</strong>
                  <p className="text-zinc-500 leading-5 text-base mb-2">
                    {incident.title}
                  </p>

                  <strong className="block mb-1 text-zinc-600">
                    DESCRIÇÂO:
                  </strong>
                  <p className="text-zinc-500 leading-5 text-base mb-2">
                    {incident.description}
                  </p>

                  <strong className="block mb-1 text-zinc-600">VALOR:</strong>
                  <p className="text-zinc-500 leading-5 text-base mb-2">
                    {Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(incident.value)}
                  </p>
                </div>
                <div>
                  <button
                    className="border-0 hover:opacity-80"
                    onClick={() => handleDeleteIncident(incident.id)}
                    type="button"
                  >
                    {incident.id === deleteIncidentId && loadingDeleteCase ? (
                      <LoadingSpinner />
                    ) : (
                      <FiTrash2 size={20} color="#a8a8b3" />
                    )}
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
        {incidents.length === 0 && !loadingCases && (
          <div className="h-96 w-full flex justify-center items-center">
            <img src={heroImg} alt="Imagem de Super Herói" className="mr-10" />
          </div>
        )}
      </div>
    </div>
  );
}
