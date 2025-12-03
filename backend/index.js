// backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { supabase } = require('./supabaseClient');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API Registraduría funcionando' });
});

/**
 * 🔹 Obtener tipos de documento
 * GET /api/document-types
 */
app.get('/api/document-types', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('document_types')
      .select('id, name, status')
      .order('name');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error /api/document-types:', err);
    res.status(500).json({ message: 'Error obteniendo tipos de documento' });
  }
});

/**
 * 🔹 Crear persona + documento
 * POST /api/persons
 */
app.post('/api/persons', async (req, res) => {
  try {
    const {
      identity_number,
      first_name,
      last_name,
      phone,
      address,
      email,
      blood_type,
      birth_date,
      birth_city_id,
      residence_city_id,
      father_name,
      father_identity,
      mother_name,
      mother_identity,
      sex,
      document_type_id,
      document_number,
    } = req.body;

    // 1. Insertar persona
    const { data: person, error: personError } = await supabase
      .from('persons')
      .insert([{
        identity_number,
        first_name,
        last_name,
        phone,
        address,
        email,
        blood_type,
        birth_date,
        birth_city_id,
        residence_city_id,
        father_name,
        father_identity,
        mother_name,
        mother_identity,
        sex,
      }])
      .select()
      .single();

    if (personError) throw personError;

    // 2. Insertar documento
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .insert([{
        person_id: person.id,
        document_type_id,
        document_number,
      }])
      .select()
      .single();

    if (docError) throw docError;

    res.status(201).json({ person, document: doc });
  } catch (err) {
    console.error('Error /api/persons:', err);
    res.status(500).json({ message: 'Error creando persona', error: err.message });
  }
});

/**
 * 🔹 Reporte Usuarios
 * GET /api/reports/users
 * Usa la vista report_users
 */
app.get('/api/reports/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('report_users')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error /api/reports/users:', err);
    res.status(500).json({ message: 'Error obteniendo reporte de usuarios' });
  }
});

/**
 * 🔹 Reporte Departamental
 * GET /api/reports/departamental
 * Usa la vista report_departamental
 */
app.get('/api/reports/departamental', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('report_departamental')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error /api/reports/departamental:', err);
    res.status(500).json({ message: 'Error obteniendo reporte departamental' });
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
