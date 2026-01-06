// dashboard.js
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3000/api/students');
        const students = await response.json();

        // 1. Cálculos de métricas
        const totalPaid = students
            .filter(s => s.status === 'paid')
            .reduce((acc, s) => acc + Number(s.amount), 0);

        const totalPending = students
            .filter(s => s.status === 'pending')
            .reduce((acc, s) => acc + Number(s.amount), 0);

        const activeCount = students.length;

        // 2. Inyectar en el HTML (asegurate que los IDs coincidan con el dashboard.html)
        document.getElementById('total-paid').innerText = `$${totalPaid.toLocaleString()}`;
        document.getElementById('total-pending').innerText = `$${totalPending.toLocaleString()}`;
        document.getElementById('active-count').innerText = activeCount;

    } catch (error) {
        console.error("Error cargando métricas:", error);
    }
});