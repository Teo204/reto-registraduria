import React, { useEffect, useState } from 'react';
import {
  createPersonWithDocument,
  getReportUsers,
  getReportDepartamental,
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

  const [reportUsers, setReportUsers] = useState([]);
  const [reportDept, setReportDept] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPersonWithDocument(form);
      alert('Persona registrada');
      loadReports();
    } catch (err) {
      console.error(err);
      alert('Error registrando persona');
    }
  };
  const [docTypes, setDocTypes] = useState([]);

  useEffect(() => {
    loadReports();
    getDocumentTypes().then(setDocTypes).catch(console.error);
  }, []);


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

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="app">
      <h1>Reto Registraduría – Caicedonia</h1>

      <section className="card">
        <h2>Registro de persona (demo)</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            name="identity_number"
            placeholder="Número de identidad"
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

          {/* ESTE ES EL CAMBIO IMPORTANTE */}
          <select
            name="document_type_id"
            value={form.document_type_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona tipo de documento</option>
            <option value="TU_UUID_1_AQUI">Cédula de Ciudadanía</option>
            <option value="TU_UUID_2_AQUI">Pasaporte</option>
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
