const db = require('../config/db');

exports.getAllStudents = (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.createStudent = (req, res) => {
    const { name, phone, amount, due_day } = req.body;
    const query = 'INSERT INTO students (name, phone, amount, due_day, status) VALUES (?, ?, ?, ?, "pending")';
    db.query(query, [name, phone, amount, due_day], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, message: "Alumno creado con éxito" });
    });
};

exports.toggleStatus = (req, res) => {
    const { id } = req.params;
    db.query('UPDATE students SET status = IF(status="paid", "pending", "paid") WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Estado actualizado" });
    });
};