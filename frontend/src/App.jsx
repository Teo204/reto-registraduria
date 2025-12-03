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
  const [loadingPerson, setLoadingPerson] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoadingPerson(true);

    try {
      await createPersonWithDocument(form);
      // limpiar solo lo básico, conservando sexo y tipo doc seleccionados
      setForm((prev) => ({
        ...prev,
        identity_number: '',
        first_name: '',
        last_name: '',
        document_number: '',
      }));
      await loadReports();
    } catch (err) {
      console.error(err);
      setErrorMessage(
        'No se pudo registrar la persona. Revisa que el número de identidad no esté repetido y verifica la consola del backend.'
      );
    } finally {
      setLoadingPerson(false);
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
      setErrorMessage('No se pudieron cargar los reportes.');
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
      setErrorMessage('No se pudieron cargar los tipos de documento.');
    }
  };

  useEffect(() => {
    loadReports();
    loadDocumentTypes();
  }, []);

  const totalPersonas = reportDept.length;

  return (
    <div className="app-shell">
      <div className="app-container">
        {/* ENCABEZADO */}
        <header className="app-header">
          <div>
            <h1 className="app-title">Reto Registraduría – Sistema de Personas</h1>
            <p className="app-subtitle">
              Prototipo académico para la Registraduría Nacional: registro de
              personas, asociación de documentos y generación de reportes
              (usuarios y departamental) usando React, Node y Supabase.
            </p>
          </div>
          <div className="app-badge">
            <span className="badge-pill">Reto 2 · Desarrollo de Software</span>
            <div className="small-meta">
              Backend: Node / Express<br />
              BD: Supabase (PostgreSQL)
            </div>
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL: FORM + RESUMEN */}
        <main className="app-main">
          <section className="card card-form">
            <div className="card-header">
              <div>
                <h2 className="card-title">Registro de persona</h2>
                <p className="card-subtitle">
                  Diligencia los datos básicos de la persona y el documento de
                  identidad principal. El número de identidad debe ser único en
                  todo el sistema.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-row">
                <label>Número de identidad *</label>
                <input
                  name="identity_number"
                  placeholder="Ej. 1019982964"
                  value={form.identity_number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <label>Nombres *</label>
                <input
                  name="first_name"
                  placeholder="Nombres"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <label>Apellidos *</label>
                <input
                  name="last_name"
                  placeholder="Apellidos"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row-inline">
                <div className="form-row">
                  <label>Sexo *</label>
                  <select
                    name="sex"
                    value={form.sex}
                    onChange={handleChange}
                  >
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                  </select>
                </div>

                <div className="form-row">
                  <label>Tipo de documento *</label>
                  <select
                    name="document_type_id"
                    value={form.document_type_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona...</option>
                    {docTypes.map((dt) => (
                      <option key={dt.id} value={dt.id}>
                        {dt.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <label>Número del documento *</label>
                <input
                  name="document_number"
                  placeholder="Ej. 123456"
                  value={form.document_number}
                  onChange={handleChange}
                  required
                />
              </div>

              {errorMessage && (
                <div className="alert-error">{errorMessage}</div>
              )}

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loadingPerson}
                >
                  {loadingPerson ? 'Registrando...' : 'Registrar persona'}
                </button>
              </div>
            </form>
          </section>

          <aside className="card card-info">
            <h2 className="card-title">Resumen del sistema</h2>
            <p className="card-subtitle">
              Información agregada generada a partir de los registros actuales.
            </p>

            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Personas registradas</span>
                <span className="stat-value">{totalPersonas}</span>
              </div>

              <div className="stat-card">
                <span className="stat-label">Tipos de documento</span>
                <span className="stat-value">{docTypes.length}</span>
              </div>
            </div>

            <div className="info-block">
              <h3>Requisitos del reto</h3>
              <ul>
                <li>✔ Soporte de múltiples tipos de documento.</li>
                <li>✔ Número de identidad único por persona.</li>
                <li>✔ Asociación persona-documento.</li>
                <li>✔ Reporte de usuarios (país, ciudad, tipo y número).</li>
                <li>✔ Reporte departamental (departamento, persona, sexo).</li>
              </ul>
            </div>

            <div className="info-block secondary">
              <h3>Notas técnicas</h3>
              <p>
                La capa de datos se implementa en Supabase (PostgreSQL) usando
                vistas SQL para los reportes. El backend expone una API REST y
                el frontend consume los reportes de forma reactiva.
              </p>
            </div>
          </aside>
        </main>

        {/* REPORTES */}
        <section className="reports-grid">
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Reporte de usuarios</h2>
                <p className="card-subtitle">
                  Muestra el país, ciudad de residencia, persona, tipo de
                  documento y número de documento.
                </p>
              </div>
              <button
                className="btn-secondary"
                onClick={loadReports}
                disabled={loadingReports}
              >
                {loadingReports ? 'Actualizando…' : 'Actualizar'}
              </button>
            </div>

            {loadingReports ? (
              <p className="text-muted">Cargando datos...</p>
            ) : reportUsers.length === 0 ? (
              <p className="text-muted">
                Aún no hay registros para mostrar en este reporte.
              </p>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>País</th>
                      <th>Ciudad residencia</th>
                      <th>Persona</th>
                      <th>Tipo documento</th>
                      <th>Número</th>
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
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Reporte departamental</h2>
                <p className="card-subtitle">
                  Muestra el departamento de residencia, el nombre de la persona
                  y el sexo registrado.
                </p>
              </div>
            </div>

            {loadingReports ? (
              <p className="text-muted">Cargando datos...</p>
            ) : reportDept.length === 0 ? (
              <p className="text-muted">
                Aún no hay registros para mostrar en este reporte.
              </p>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
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
              </div>
            )}
          </div>
        </section>

        <footer className="app-footer">
          Reto desarrollado con React · Node / Express · Supabase (PostgreSQL)
        </footer>
      </div>
    </div>
  );
}

export default App;
