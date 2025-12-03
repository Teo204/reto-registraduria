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
 * Crear persona junto con un documento.
 * (Para el reto puedes tener un endpoint simple para registrar una persona + 1 doc).
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

    // 2. Insertar documento asociado
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
    console.error(err);
    res.status(500).json({ message: 'Error creando persona', error: err.message });
  }
});
app.get('/api/document-types', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('document_types')
      .select('id, name')
      .order('name');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error obteniendo tipos de documento' });
  }
});

/**
 * Reporte 1: país, ciudad residencia, nombre persona, tipo doc, número doc
 */
app.get('/api/reports/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        document_number,
        document_types(name),
        persons(first_name, last_name, residence_city_id),
        persons:persons!inner(
          first_name, last_name, residence_city_id
        ),
        persons:persons (
          first_name, last_name, residence_city_id
        )
      `);
    // Esa forma es un poco enredada; más simple: usaremos RPC o un view.
    // Para evitar confusión, mejor creamos una VIEW en SQL y la consultamos.
  } catch (err) {
    res.status(500).json({ message: 'No implementado aún' });
  }
});

// Más limpio: hacemos los reportes con vistas (ver paso 3.2)

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});

// backend/index.js (añadir esto)

app.get('/api/reports/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('report_users')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error obteniendo reporte de usuarios' });
  }
});

app.get('/api/reports/departamental', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('report_departamental')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error obteniendo reporte departamental' });
  }
});
