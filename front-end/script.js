


import './styles.scss';

const ulTodoEl = document.querySelector('.todo__list');
const btnAddTodo = document.querySelector('.todo__btn');
const alertTodo = document.querySelector('.todo__alert');
const inputTodoEl = document.querySelector('.todo__input');
const apiBase =
    window.location.hostname === 'localhost'
        ? 'http://localhost:5555'
        : 'https://home-work-35.onrender.com';


document.addEventListener('DOMContentLoaded', () => {
    fetch(`${apiBase}/todos`)
        .then(response => response.json())
        .then(result => {
            console.log('Відповідь від сервера:', result);

            result.todos.forEach(task => {
                createTodoItem(task.text, task.isDone, task.id);
            });
        })
        .catch(error => console.error('Помилка при відправці даних:', error));
});


function setItemStorageObjects() {
    const tasksArr = [];
    const tasksLi = ulTodoEl.querySelectorAll('li');
    tasksLi.forEach(li => {
        const check = li.querySelector('input[type="checkbox"]');
        const span = li.querySelector('span');
        tasksArr.push({
            id: li.dataset.id,
            text: span.textContent,
            isDone: check.checked
        });
    });

    fetch(`${apiBase}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tasksArr)
    })
        .then(response => response.json())
        .then(result => console.log('Відповідь від сервера:', result))
        .catch(error => console.error('Помилка при відправці даних:', error));

}


function createTodoItem(taskText, checked = false, id = Date.now().toString()) {
    const liTodoEl = document.createElement('li');
    liTodoEl.dataset.id = id;

    const checkBoxEl = document.createElement('input');
    checkBoxEl.type = 'checkbox';
    checkBoxEl.checked = checked;
    liTodoEl.appendChild(checkBoxEl);

    const spanTodoEl = document.createElement('span');
    spanTodoEl.textContent = taskText;
    liTodoEl.appendChild(spanTodoEl);

    const btnDel = document.createElement('button');
    btnDel.textContent = 'X';
    btnDel.classList.add('todo__btn-danger');

    liTodoEl.appendChild(btnDel);
    ulTodoEl.appendChild(liTodoEl);
}

ulTodoEl.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {

        const li = event.target.parentElement;
        const id = li.dataset.id;

        fetch(`${apiBase}/todos/${id}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(result => {
                console.log('Видалено:', result);
                li.remove();
                setItemStorageObjects();
            })
            .catch(error => console.error('Помилка при видаленні:', error));
    }


});

ulTodoEl.addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        const checkBoxEl = event.target;
        const li = checkBoxEl.closest('li');
        const id = li.dataset.id;
        const isDone = checkBoxEl.checked;

        fetch(`${apiBase}/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDone })
        })
            .then(res => res.json())
            .then(result => {
                console.log('Оновлено:', result);
                setItemStorageObjects();
            })
            .catch(error => console.error('Помилка при оновленні:', error));

    };
});

btnAddTodo.addEventListener('click', (event) => {
    event.preventDefault();

    const inputTodoElValue = inputTodoEl.value.trim();

    if (inputTodoElValue === '') {
        alertTodo.style.display = 'block';
        inputTodoEl.focus();
        inputTodoEl.addEventListener('input', hideAlert);
        return;
    }

    function hideAlert() {
        alertTodo.style.display = 'none';
        inputTodoEl.removeEventListener('input', hideAlert);
    }


    createTodoItem(inputTodoElValue);
    inputTodoEl.value = '';

    setItemStorageObjects();
});


ulTodoEl.addEventListener('click', (event) => {
    if (event.target.tagName === 'SPAN') {
        setModalState('flex');
        modalContent.textContent = event.target.textContent;
    }
});

// ------------------------------------------------------------------
const modalOwerlay = document.body.querySelector('.modal__owerlay');
const modalContent = document.body.querySelector('.modal__content');

function setModalState(text) {
    modalOwerlay.style.display = text;
}

const modalBtnCancel = document.body.querySelector('.modal__btn--cancel');
const modalBtnEsc = document.body.querySelector('.modal__close');

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        setModalState('none');
    } else if (event.key === 'Enter') {
        event.preventDefault();
        setModalState('none');
    }
});

modalOwerlay.addEventListener('click', (event) => {
    const target = event.target;
    if (target === modalOwerlay || target === modalBtnEsc || target === modalBtnCancel) {
        setModalState('none');
    }
});


