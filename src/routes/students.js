const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * GET: Obtener todos los alumnos
 */
router.get('/', (req, res) => {
    const query = 'SELECT * FROM students ORDER BY name ASC';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

/**
 * POST: Crear un nuevo alumno
 * IMPORTANTE: Debe coincidir con todos los campos de tu tabla SQL
 */
router.post('/', (req, res) => {
    const { 
        name, 
        phone, 
        service_name, 
        price_per_hour, 
        class_duration_min, 
        classes_per_month, 
        amount, 
        payment_method, 
        surcharge_percentage, 
        deadline_day, 
        due_day 
    } = req.body;

    const query = `
        INSERT INTO students 
        (name, phone, service_name, price_per_hour, class_duration_min, classes_per_month, amount, payment_method, surcharge_percentage, deadline_day, due_day, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    const values = [
        name, 
        phone, 
        service_name || 'General', 
        price_per_hour || 0, 
        class_duration_min || 60, 
        classes_per_month || 4, 
        amount || 0, 
        payment_method || 'Mercado Pago', 
        surcharge_percentage || 10, 
        deadline_day || 10, 
        due_day || 1
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Error al insertar:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, message: "Alumno guardado correctamente" });
    });
});

/**
 * PUT: Aumento por Inflación Selectivo
 * Permite aumentar todos o solo un servicio específico
 */
router.put('/update-prices', (req, res) => {
    const { percentage, service } = req.body;
    
    if (!percentage) return res.status(400).json({ error: "Porcentaje requerido" });

    const factor = 1 + (percentage / 100);
    
    // Si service es 'ALL', actualiza a todos. Si no, filtra por service_name.
    let query = 'UPDATE students SET amount = amount * ?, price_per_hour = price_per_hour * ?';
    let params = [factor, factor];

    if (service && service !== 'ALL') {
        query += ' WHERE service_name = ?';
        params.push(service);
    }

    db.query(query, params, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `Aumento del ${percentage}% aplicado correctamente.` });
    });
});

/**
 * PATCH: Alternar estado de pago
 */
router.patch('/:id/toggle', (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE students SET status = IF(status="paid", "pending", "paid") WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Estado actualizado" });
    });
});

/**
 * DELETE: Eliminar alumno
 */
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM students WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Alumno eliminado" });
    });
});

module.exports = router;