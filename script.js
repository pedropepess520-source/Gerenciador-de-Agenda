// Acessando os elementos HTML
const form = document.getElementById('event-form');
const eventTitleInput = document.getElementById('event-title');
const eventDateInput = document.getElementById('event-date');
const eventDescriptionInput = document.getElementById('event-description');
const eventList = document.getElementById('event-list');
const eventIdInput = document.getElementById('event-id');
const formTitle = document.getElementById('form-title');
const cancelEditButton = document.getElementById('cancel-edit');

let events = [];

// Função para salvar os eventos no localStorage
function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

// Função para carregar os eventos do localStorage
function loadEvents() {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
        events = JSON.parse(storedEvents);
        renderEvents();
    }
}

// Função para renderizar (mostrar) os eventos na tela
function renderEvents() {
    eventList.innerHTML = ''; // Limpa a lista antes de renderizar
    events.forEach(event => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center mb-2';
        li.innerHTML = `
            <div>
                <h5>${event.title}</h5>
                <p class="text-muted mb-1">${event.date}</p>
                <p>${event.description}</p>
            </div>
            <div>
                <button class="btn btn-warning btn-sm me-2 edit-btn" data-id="${event.id}">Editar</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${event.id}">Excluir</button>
            </div>
        `;
        eventList.appendChild(li);
    });
}

// Função para adicionar um novo evento
function addEvent(title, date, description) {
    const newEvent = {
        id: Date.now(), // ID único para cada evento
        title,
        date,
        description
    };
    events.push(newEvent);
    saveEvents();
    renderEvents();
}

// Função para editar um evento
function editEvent(id, title, date, description) {
    const eventToEdit = events.find(event => event.id == id);
    if (eventToEdit) {
        eventToEdit.title = title;
        eventToEdit.date = date;
        eventToEdit.description = description;
        saveEvents();
        renderEvents();
    }
}

// Função para excluir um evento
function deleteEvent(id) {
    events = events.filter(event => event.id != id);
    saveEvents();
    renderEvents();
}

// Listener para o formulário de adicionar/editar
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = eventIdInput.value;
    const title = eventTitleInput.value;
    const date = eventDateInput.value;
    const description = eventDescriptionInput.value;

    if (id) {
        // Se há um ID, é uma edição
        editEvent(id, title, date, description);
    } else {
        // Se não, é uma adição
        addEvent(title, date, description);
    }

    // Resetar o formulário
    form.reset();
    eventIdInput.value = '';
    formTitle.innerText = 'Adicionar Evento';
    cancelEditButton.classList.add('d-none');
});

// Listener para os botões de editar e excluir
eventList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        if (confirm('Tem certeza que deseja excluir este evento?')) {
            deleteEvent(id);
        }
    }

    if (e.target.classList.contains('edit-btn')) {
        const id = e.target.dataset.id;
        const eventToEdit = events.find(event => event.id == id);

        // Preenche o formulário com os dados do evento
        eventIdInput.value = eventToEdit.id;
        eventTitleInput.value = eventToEdit.title;
        eventDateInput.value = eventToEdit.date;
        eventDescriptionInput.value = eventToEdit.description;

        // Muda o título do formulário e mostra o botão de cancelar
        formTitle.innerText = 'Editar Evento';
        cancelEditButton.classList.remove('d-none');
    }
});

// Listener para o botão de cancelar edição
cancelEditButton.addEventListener('click', () => {
    form.reset();
    eventIdInput.value = '';
    formTitle.innerText = 'Adicionar Evento';
    cancelEditButton.classList.add('d-none');
});

// Carrega os eventos ao iniciar a página
document.addEventListener('DOMContentLoaded', loadEvents);