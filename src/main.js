/*Цей файл — є основним скриптом для пошукового застосунку зображень, який використовує API сервіс Pixabay.Він робить: 
1.Реалізує пошук зображень по ключовому слову (з введення користувача).
2.Відображає результати у вигляді галереї.
3.Додає кнопку “Load More” для підвантаження нових зображень (пагінація).
3.Показує повідомлення у випадку помилок, успіху або завершення результатів.*/ 

// імпортую функціі. Тут функція робить HTTP-запит і повертає JSON-об'єкт з зображеннями
import { getImagesByQuery } from './js/pixabay-api.js';

// функціі для роботи з DOM
import {
  createGallery,          // додає розмітку HTML для зображень
  clearGallery,          // очищає галерею
  
} from './js/render-functions.js';

import iziToast from 'izitoast';    // бібліотека для яскравих повідомлень користувачу
import 'izitoast/dist/css/iziToast.min.css';  // стилі для iziToast

// шукаю елементи, отримую DOM
const form = document.querySelector('.form');                  // форма пошуку
const input = form.querySelector('input[name="search-text"]');// поле введення пошукового тексту
const loader = document.querySelector('.loader');            // індикатор завантаження
const loadMoreButton = document.querySelector('.select');   // кнопка "Load More"


// Змінні для курування станом пошуку
let currentQuery = '';     // поточний пошуковий запит
let currentPage = 1;      // номер поточної сторінки пошукового запиту
let totalHits = 0;       // загальна кількість знайдених зображень
let isLoading = false;  // прапорець, щоб уникнути повторного запиту, коли один уже триває

// функція для показу індикатора завантаження
function showLoader() {
  if (loader) loader.style.display = 'block';
}

// функція для сховування індикатора завантаження
function hideLoader() {
  if (loader) loader.style.display = 'none';
}

// функція для симуляції завантаження (штучна затримка)
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* Основна функція для завантаження зображень
   isFirstLoad = true - перший запит (початковий пошук),
   false - запит при натисканні Load More */
async function loadImages(isFirstLoad = false) {
  if (isLoading) {
    console.log('Запит уже виконується, новий запит не запускається.');
    return;
  }
  isLoading = true;

  // Показую індикатор завантаження і ховаю кнопку "Load More"
  showLoader();
  loadMoreButton.classList.add('is-hidden');

  try {
    await delay(2000); // штучна затримка (для тесту)

    // Робимо запит до Pixabay за поточним запитом і сторінкою
    const data = await getImagesByQuery(currentQuery, currentPage);

    // Перевіряю, чи відповідає структура відповіді очікуваній
    if (!data || !Array.isArray(data.hits)) {
      throw new Error('Невалідна структура відповіді API');
    }

    // Якщо зображення не знайдено, очищаю галерею і виводжу повідомлення
    if (data.hits.length === 0) {
      clearGallery();
      iziToast.info({
        title: 'Нічого не знайдено',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    // Якщо це перший запит, очищую галерею і виводжу загальну кількість знайдених зображень
    if (isFirstLoad) {
      clearGallery();
      totalHits = data.totalHits;
      iziToast.success({
        title: 'Успіх',
        message: `Знайдено ${totalHits} зображень.`,
        position: 'topRight',
      });
    }

    // Додаю зображення до галереї
    createGallery(data.hits);

    // Розраховую максимальну кількість сторінок
    const maxPages = Math.ceil(totalHits / 15);

    // Якщо є ще сторінки, показую кнопку "Load More"
    if (currentPage < maxPages) {
      currentPage += 1; // Збільшую номер сторінки
      loadMoreButton.classList.remove('is-hidden');
    } else {
      // Якщо досягнуто кінця результатів, виводжу повідомлення
      iziToast.info({
        title: 'Кінець колекції',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
    // У разі помилки виводжу повідомлення і логую помилку
  } catch (error) {
    console.error('Помилка запиту:', error);
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити зображення. Спробуйте пізніше.',
      position: 'topRight',
    });
    // Ховаю індикатор завантаження і встановлюю прапорець isLoading у false
  } finally {
    hideLoader();
    isLoading = false;
  }
}

// Обробник події сабміту форми
form.addEventListener('submit', async event => {
  event.preventDefault(); // Запобігаю перезавантаженню сторінки за замовчуванням
  const query = input.value.trim(); // Отримую текст запиту, видаляючи зайві пробіли

  // Якщо запит порожній, виводжу повідомлення
  if (!query) {
    iziToast.error({
      title: 'Помилка',
      message: 'Будь ласка, введіть пошуковий запит.',
      position: 'topRight',
    });
    return;
  }

  // Оновлюю пошукові параметри і очищую галерею
  currentQuery = query;
  currentPage = 1;
  totalHits = 0;

  clearGallery(); // Очищую попередній вміст галереї

  await loadImages(true); // Завантажую зображення за новим запитом

  input.value = ''; // Очищую поле вводу після запиту
});

// Обробник кліку на кнопку Load More
loadMoreButton.addEventListener('click', async () => {
  console.log('Кнопка Load More натиснута');
  await loadImages(false);
});


