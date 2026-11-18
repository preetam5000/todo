const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const searchInput = document.getElementById('searchInput');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');
const pendingTasks = document.getElementById('pendingTasks');
const editModal = document.getElementById('editModal');
const editInput = document.getElementById('editInput');

const savedTodos = localStorage.getItem('todos');
let todos = savedTodos ? JSON.parse(savedTodos) : [];
let currentFilter = 'all';
let editingId = null;

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateStatistics() {
    const completed = todos.filter(todo => todo.completed).length;

    totalTasks.textContent = todos.length;
    completedTasks.textContent = completed;
    pendingTasks.textContent = todos.length - completed;
}

function renderTodos() {
    
    const searchText = searchInput.value.trim().toLowerCase();
    // console.log(searchText)
    const visibleTodos = todos.filter(todo => {
        console.log(todo.title)
        const matchesSearch = todo.title.toLowerCase().includes(searchText);
        const matchesFilter = currentFilter === 'all'
            || (currentFilter === 'active' && !todo.completed)
            || (currentFilter === 'completed' && todo.completed);

        return matchesSearch && matchesFilter;
    });

    todoList.textContent = '';
    emptyState.style.display = visibleTodos.length ? 'none' : 'block';

    const emptyTitle = emptyState.querySelector('h2');
    const emptyMessage = emptyState.querySelector('p');
    if (todos.length === 0) {
        emptyTitle.textContent = 'No Tasks Yet';
        emptyMessage.textContent = 'Add your first task to get started.';
    } else {
        emptyTitle.textContent = 'No Matching Tasks';
        emptyMessage.textContent = 'Try changing your search or filter.';
    }

    visibleTodos.forEach(todo => {
        const item = document.createElement('li');
        item.className = 'todo-item';
        if (todo.completed) item.classList.add('completed');

        const left = document.createElement('div');
        left.className = 'left';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.setAttribute('aria-label', `Mark ${todo.title} as completed`);
        checkbox.addEventListener('change', () => {
            todo.completed = checkbox.checked;
            saveTodos();
            renderTodos();
        });

        const info = document.createElement('div');
        info.className = 'task-info';

        const title = document.createElement('h3');
        title.textContent = todo.title;

        const createdAt = document.createElement('small');
        createdAt.textContent = todo.createdAt || '';

        info.append(title, createdAt);
        left.append(checkbox, info);

        const actions = document.createElement('div');
        actions.className = 'actions';

        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => openEditModal(todo));

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            todos = todos.filter(task => task.id !== todo.id);
            saveTodos();
            renderTodos();
        });

        actions.append(editBtn, deleteBtn);
        item.append(left, actions);
        todoList.append(item);
    });

    updateStatistics();
}

function addTodo() {
    const title = todoInput.value.trim();
    if (!title) {
        todoInput.focus();
        return;
    }

    todos.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title,
        completed: false,
        createdAt: new Date().toLocaleString()
    });

    todoInput.value = '';
    saveTodos();
    renderTodos();
    todoInput.focus();
}

function openEditModal(todo) {
    editingId = todo.id;
    editInput.value = todo.title;
    editModal.style.display = 'flex';
    editInput.focus();
}

function closeEditModal() {
    editingId = null;
    editModal.style.display = 'none';
    editInput.setCustomValidity('');
}

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') addTodo();
});

searchInput.addEventListener('input', renderTodos);

document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        currentFilter = button.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach(filterButton => {
            filterButton.classList.toggle('active', filterButton === button);
        });
        renderTodos();
    });
});

document.getElementById('deleteCompleted').addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
});

document.getElementById('deleteAll').addEventListener('click', () => {
    todos = [];
    saveTodos();
    renderTodos();
});

document.getElementById('saveEdit').addEventListener('click', () => {
    const title = editInput.value.trim();
    if (!title) {
        editInput.setCustomValidity('Please enter a task.');
        editInput.reportValidity();
        return;
    }

    const todo = todos.find(task => task.id === editingId);
    if (todo) {
        todo.title = title;
        saveTodos();
    }
    closeEditModal();
    renderTodos();
});

document.getElementById('cancelEdit').addEventListener('click', closeEditModal);
editInput.addEventListener('input', () => editInput.setCustomValidity(''));
editInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') document.getElementById('saveEdit').click();
    if (event.key === 'Escape') closeEditModal();
});
editModal.addEventListener('click', event => {
    if (event.target === editModal) closeEditModal();
});

renderTodos();
