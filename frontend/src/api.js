const API_URL = 'http://localhost:4001/api';

export async function createPersonWithDocument(payload) {
  const res = await fetch(`${API_URL}/persons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error creando persona');
  return res.json();
}

export async function getReportUsers() {
  const res = await fetch(`${API_URL}/reports/users`);
  if (!res.ok) throw new Error('Error obteniendo reporte usuarios');
  return res.json();
}

export async function getReportDepartamental() {
  const res = await fetch(`${API_URL}/reports/departamental`);
  if (!res.ok) throw new Error('Error obteniendo reporte departamental');
  return res.json();
}
