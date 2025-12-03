// src/api.js
const API_URL = 'http://localhost:4001/api';

// Crear persona + documento
export async function createPersonWithDocument(payload) {
  const res = await fetch(`${API_URL}/persons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error('Error respuesta createPersonWithDocument', await res.text());
    throw new Error('Error creando persona');
  }
  return res.json();
}

// Reporte usuarios
export async function getReportUsers() {
  const res = await fetch(`${API_URL}/reports/users`);
  if (!res.ok) {
    console.error('Error respuesta getReportUsers', await res.text());
    throw new Error('Error obteniendo reporte usuarios');
  }
  return res.json();
}

// Reporte departamental
export async function getReportDepartamental() {
  const res = await fetch(`${API_URL}/reports/departamental`);
  if (!res.ok) {
    console.error('Error respuesta getReportDepartamental', await res.text());
    throw new Error('Error obteniendo reporte departamental');
  }
  return res.json();
}

// 🔹 NUEVO: obtener tipos de documento desde el backend
export async function getDocumentTypes() {
  const res = await fetch(`${API_URL}/document-types`);
  if (!res.ok) {
    console.error('Error respuesta getDocumentTypes', await res.text());
    throw new Error('Error obteniendo tipos de documento');
  }
  return res.json();
}
