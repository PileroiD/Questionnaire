import { Question } from './question';
import { createModal, isValid } from './utils';
import { getAuthForm, authWithEmailAndPassword } from './auth';
import './style.css';

const form = document.querySelector('#form'),
    modalBtn = document.querySelector('#modal-btn'),
    input = form.querySelector('input'),
    submitBtn = form.querySelector('button');

window.addEventListener('load', Question.renderList);

modalBtn.addEventListener('click', openModal);

form.addEventListener('submit', submitFormHandler);
input.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value);
});

function submitFormHandler(event) {
    event.preventDefault();

    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }

        submitBtn.disabled = true;
        //Async request to server for saving question
        Question.create(question).then(() => {
            input.value = '';
            input.className = '';
            submitBtn.disabled = false;
        });
    }
}

function openModal() {
    createModal('Авторизация', getAuthForm());
    document.getElementById('auth-form').addEventListener('submit', authFormHandler, { once: true });
}

function authFormHandler(event) {
    event.preventDefault();

    const btn = event.target.querySelector('button');
    const email = event.target.querySelector('#email').value;
    const password = event.target.querySelector('#password').value;

    btn.disabled = true;
    authWithEmailAndPassword(email, password)
        .then(Question.fetch)
        .then(renderModalAfterAuth)
        .then(() => btn.disabled = false);
}

function renderModalAfterAuth(content) {
    // console.log('Content - ', content);
    if (typeof content === 'string') {
        createModal('Ошибка!', content);
    } else {
        createModal('Список вопросов', Question.listToHTML(content));
    }

}