document.addEventListener('DOMContentLoaded', () => {
    fetchStudents();
    loadServiceSelector();
});

window.openModal = () => {
    const modal = document.getElementById('modal-alumno');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
};

window.closeModal = () => {
    const modal = document.getElementById('modal-alumno');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.getElementById('form-nuevo-alumno').reset(); 
    }
};

function loadServiceSelector() {
    const services = JSON.parse(localStorage.getItem('myServices') || '["General"]');
    const selector = document.getElementById('add-service');
    if (selector) {
        selector.innerHTML = services.map(s => `<option value="${s}">${s}</option>`).join('');
    }
}

async function fetchStudents() {
    try {
        const response = await fetch('http://localhost:3000/api/students');
        const students = await response.json();
        console.log('📊 Datos reales en DB:', students); // REVISÁ ESTO EN LA CONSOLA
        renderStudents(students);
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

function renderStudents(students) {
    const container = document.getElementById('students-list');
    if (!container) return;
    container.innerHTML = '';

    const bizName = localStorage.getItem('bizName') || 'Tu Profe';
    const aliasMP = localStorage.getItem('bizAliasMP') || 'Alias';
    const aliasNX = localStorage.getItem('bizAliasNaranja') || 'Alias';

    students.forEach(student => {
        const isPaid = student.status === 'paid';
        const baseAmount = Number(student.amount) || 0;
        
        // CORRECCIÓN: Leemos el porcentaje real, si no hay nada es 0, NO 10.
        const studentPercent = Number(student.surcharge_percentage) || 0;
        const surchargeVal = baseAmount * (studentPercent / 100);
        const alias = student.payment_method === 'Mercado Pago' ? aliasMP : aliasNX;

        const message = `Hola ${student.name}! Te saluda ${bizName}. 
Te envío el link de pago de ${student.service_name} por un total de $${baseAmount.toLocaleString('es-AR')}. 

Recuerda que el vencimiento es el día ${student.deadline_day} de cada mes. Si abonas después de esa fecha, se aplica un recargo del ${studentPercent}% ($${surchargeVal.toFixed(2)} adicionales).

Mi alias de ${student.payment_method} es: ${alias}
¡Muchas gracias!`;

        const waLink = `https://wa.me/${student.phone}?text=${encodeURIComponent(message)}`;

        container.innerHTML += `
            <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
                <td class="p-4 font-bold text-slate-800">${student.name}</td>
                <td class="p-4 text-slate-500 text-sm">${student.service_name}</td>
                <td class="p-4 font-black text-indigo-600">$${baseAmount.toLocaleString('es-AR')}</td>
                <td class="p-4">
                    <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase ${isPaid ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}">
                        ${isPaid ? 'Cobrado' : 'Pendiente'}
                    </span>
                </td>
                <td class="p-4 flex gap-2">
                    <button onclick="toggleStatus(${student.id})" class="hover:text-emerald-500 text-slate-400 transition"><i class="fa-solid fa-circle-check"></i></button>
                    <a href="${waLink}" target="_blank" class="hover:text-sky-500 text-slate-400 transition"><i class="fa-brands fa-whatsapp"></i></a>
                    <button onclick="deleteStudent(${student.id})" class="hover:text-red-500 text-slate-400 transition"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

window.saveStudent = async () => {
    const surchargeInput = document.getElementById('add-surcharge').value;
    
    const studentData = {
        name: document.getElementById('add-name').value.trim(),
        phone: document.getElementById('add-phone').value.trim(),
        service_name: document.getElementById('add-service').value,
        price_per_hour: Number(document.getElementById('add-pph').value) || 0,
        class_duration_min: 60,
        classes_per_month: Number(document.getElementById('add-hours').value) || 0,
        amount: Number(document.getElementById('add-pph').value) * Number(document.getElementById('add-hours').value),
        payment_method: document.getElementById('add-wallet').value,
        surcharge_percentage: Number(surchargeInput), // <--- ACÁ CAPTURA EL 5% SIN TRUCOS
        deadline_day: Number(document.getElementById('add-deadline').value) || 10,
        due_day: 1
    };

    try {
        const response = await fetch('http://localhost:3000/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });

        if (response.ok) {
            closeModal();
            fetchStudents();
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

window.toggleStatus = async (id) => {
    await fetch(`http://localhost:3000/api/students/${id}/toggle`, { method: 'PATCH' });
    fetchStudents();
};

window.deleteStudent = async (id) => {
    if (confirm("¿Eliminar?")) {
        await fetch(`http://localhost:3000/api/students/${id}`, { method: 'DELETE' });
        fetchStudents();
    }
};