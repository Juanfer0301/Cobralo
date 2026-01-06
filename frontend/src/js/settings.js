document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos guardados previamente
    const savedName = localStorage.getItem('bizName');
    const savedAlias = localStorage.getItem('bizAlias');

    if (savedName) document.getElementById('biz-name').value = savedName;
    if (savedAlias) document.getElementById('biz-alias').value = savedAlias;

    const form = document.getElementById('form-settings');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('biz-name').value;
        const alias = document.getElementById('biz-alias').value;

        localStorage.setItem('bizName', name);
        localStorage.setItem('bizAlias', alias);

        alert("¡Configuración guardada con éxito!");
        window.location.href = 'dashboard.html';
    });
});