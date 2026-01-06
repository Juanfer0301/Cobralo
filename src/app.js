const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Importar las rutas de alumnos
const studentRoutes = require('./routes/students');
app.use('/api/students', studentRoutes);

module.exports = app;