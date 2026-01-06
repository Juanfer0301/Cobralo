const API_URL = "http://localhost:3000/api";

export const api = {
    // GET /api/students
    async getStudents() {
        const res = await fetch(`${API_URL}/students`);
        return res.json();
    },
    // POST /api/students
    async createStudent(data) {
        const res = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    // PATCH /api/students/:id/toggle
    async togglePayment(id) {
        const res = await fetch(`${API_URL}/students/${id}/toggle`, {
            method: 'PATCH'
        });
        return res.json();
    }
};