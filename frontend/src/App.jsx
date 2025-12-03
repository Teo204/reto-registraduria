// src/App.jsx
import React, { useEffect, useState } from 'react';
import {
  createPersonWithDocument,
  getReportUsers,
  getReportDepartamental,
  getDocumentTypes,
} from './api';
import './App.css';

function App() {
  const [form, setForm] = useState({
    identity_number: '',
    first_name: '',
    last_name: '',
    sex: 'MASCULINO',
    document_type_id: '',
    document_number: '',
  });

  const [docTypes, setDocTypes] = useState([]);
  const [reportUsers, setReportUsers] = useState([]);
  const [reportDept, setReportDept] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPersonWithDocument(form);
      alert('Persona registrada correctamente');
      setForm((prev) => ({
        ...prev,
        identity_number: '',
        first_name: '',
        last_name: '',
        document_number: '',
      }));
      loadReports();
    } catch (err) {
      console.error(err);
      alert('Error registrando persona (revisa consola/backend)');
    }
  };

  const loadReports = async () => {
    setLoadingReports(true);
    try {
      const [u, d] = await Promise.all([
        getReportUsers(),
        getReportDepartamental(),
      ]);
      setReportUsers(u);
      setReportDept(d);
    } catch (err) {
      console.error(err);
      alert('Error cargando reportes');
    } finally {
      setLoadingReports(false);
    }
  };

  const loadDocumentTypes = async () => {
    try {
      const types = await getDocumentTypes();
      setDocTypes(types);
    } catch (err) {
      console.error(err);
      alert('Error cargando tipos de documento');
    }
  };

  useEffect(() => {
    loadReports();
    loadDocumentTypes();
  }, []);

  return (
    <div className="app">
      <h1>Reto Registraduría – Sistema de Personas</h1>

      <section className="card">
        <h2>Registro de persona</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            name="identity_number"
            placeholder="Número de identidad (único)"
            value={form.identity_number}
            onChange={handleChange}
            required
          />

          <input
            name="first_name"
            placeholder="Nombres"
            value={form.first_name}
            onChange={handleChange}
            required
          />

          <input
            name="last_name"
            placeholder="Apellidos"
            value={form.last_name}
            onChange={handleChange}
            required
          />

          <select
            name="sex"
            value={form.sex}
            onChange={handleChange}
          >
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
          </select>

          <select
            name="document_type_id"
            value={form.document_type_id}
            onChange={handleChange}
            required
          >
            <option value="">Tipo de documento</option>
            {docTypes.map((dt) => (
              <option key={dt.id} value={dt.id}>
                {dt.name}
              </option>
            ))}
          </select>

          <input
            name="document_number"
            placeholder="Número del documento"
            value={form.document_number}
            onChange={handleChange}
            required
          />

          <button type="submit">Registrar persona</button>
        </form>
      </section>

      <section className="card">
        <h2>Reporte Usuarios</h2>
        {loadingReports ? (
          <p>Cargando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>País</th>
                <th>Ciudad residencia</th>
                <th>Persona</th>
                <th>Tipo documento</th>
                <th>Número documento</th>
              </tr>
            </thead>
            <tbody>
              {reportUsers.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.country_name}</td>
                  <td>{row.residence_city}</td>
                  <td>{row.person_name}</td>
                  <td>{row.document_type}</td>
                  <td>{row.document_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="card">
        <h2>Reporte Departamental</h2>
        {loadingReports ? (
          <p>Cargando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Departamento</th>
                <th>Persona</th>
                <th>Sexo</th>
              </tr>
            </thead>
            <tbody>
              {reportDept.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.department_name}</td>
                  <td>{row.person_name}</td>
                  <td>{row.sex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default App;
