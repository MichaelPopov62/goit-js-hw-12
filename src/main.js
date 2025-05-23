
/*
  При сабміті форми (submit):
  1. Очищується галерея (щоб не змішувати старі та нові результати) і скидається сторінка (currentPage = 1), адже починаю пошук заново з першої сторінки.
  2. Запитую першу сторінку результатів за новим пошуковим запитом.
  3. Показую повідомлення із кількістю знайдених зображень, щоб користувач бачив результат.
  4. Кнопка Load More робиться видимою, якщо є ще сторінки для завантаження.

  При кліку на Load More:
  1. Запитую наступну сторінку (підвищую currentPage після кожного запиту).
  2. Додаю нові зображення до галереї, не видаляючи попередні.
  3. Оновлюю SimpleLightbox (refresh) — щоб нові зображення також відкривались у лайтбоксі.
  4. Якщо досягнуто останньої сторінки — ховаю кнопку і показую повідомлення.
  5. Прокрутка сторінки виконується так, щоб користувач бачив новий контент (плавний скрол вниз).
*/


//імпортую функціі і бібліотеку
import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';// бібліотека для яскравих повідомлень користувачу
import 'izitoast/dist/css/iziToast.min.css';

//шукаю елементи
const form = document.querySelector('.form');//форма пошуку
const input = form.querySelector('input[name="search-text"]');//поле виведення пошукового текста
const loader = document.querySelector('.loader');// індікатор завантаження
const loadMoreButton = document.querySelector('.select');// кнопка (load more)
const gallery = document.querySelector('.gallery');// контейнер галереї

//Змінні для курування станом пошуку
let currentQuery = '';// поточний пошуковий запит
let currentPage = 1;// номер поточної сторінки пошукового запиту
let totalHits = 0;// загальна кількість знайдених зображень
let isLoading = false;// прапарець щоб уникнути дублювання запитів

// функція для показу індікатора завантаження
function showLoader() {
  if (loader) loader.style.display = 'block'; //style.display керує видимістю елемента в DOM через CSS.'block' — робить елемент видимим і він займає окремий блок (повний рядок по ширині).//
}

//функція для сховування індікатора завантаження
function hideLoader() {
  if (loader) loader.style.display = 'none';
}

//функція для симуляціі завантаження, чекати завантаження
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* Основна функція для завантаження зображень
 isFirstLoad = true - перший запит (початковий пошук),
false - запит при натисканні Load More*/
async function loadImages(isFirstLoad = false) {
  if (isLoading) return;

  isLoading = true;
  showLoader(); // показую індікатор що данні завантажені
  hideLoadMoreButton(); // ховаю кнопку поки не знаю, чи є ще сторінки

  try {
    await delay(1000); // штучна затримка виконання коду ( для тесту )функціі loadImages

    // роблю запит до Pixabay за поточним запитом і сторінкою
    const data = await getImagesByQuery(currentQuery, currentPage);

    // Якщо немає результатів — очищаємо галерею і повідомляємо користувача
    if (!data.hits || data.hits.length === 0) {
      clearGallery();
      console.clear();
      iziToast.info({
        title: 'Нічого не знайдено',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      hideLoadMoreButton();
      hideLoader();
      isLoading = false;
      return; // припиняю виконання, бо нема що показувати
    }

    // Якщо це перший запит, очищую старі результати та оновлюю загальну кількість
    if (isFirstLoad) {
      clearGallery();
      totalHits = data.totalHits; // оновлюю загальну кількість знайдених зображень

      // Обчислюємо максимальну кількість сторінок (по 15 зображень на сторінку)
      const maxPages = Math.ceil(totalHits / 15);
      console.clear();
      console.log(`Новий запит: "${currentQuery}"`);
      console.log(
        `Загальна кількість результатів: ${totalHits}, Максимальна кількість сторінок: ${maxPages}`
      );

      // Повідомлення користувачу, що пошук успішний
      iziToast.success({
        title: 'Успіх',
        message: `Знайдено ${totalHits} зображень.`,
        position: 'topRight',
        timeout: 2000,
      });
    }
    // Створюю в DOM елементи для отриманих зображень і додаємо їх до галереї
    createGallery(data.hits);

    if (isFirstLoad) {
      // При першому завантаженні скролю сторінку вверх, щоб бачити початок галереї
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      // При подальших завантаженнях скролю вниз, щоб бачити нові картки
      const firstCard = gallery.querySelector('.photo-card');
      if (firstCard) {
        // Визначаю висоту однієї картки, щоб знати, на скільки прокрутити сторінку

        const cardHeight = firstCard.getBoundingClientRect().height || 200; // Висота картки (default 200)
        const galleryHeight = gallery.scrollHeight;

        // Прокрутка відбувається тільки якщо галерея більша за висоту вікна браузера
        if (galleryHeight > window.innerHeight) {
          window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
          });
        }
      }
    }

    // Перевіряю, чи є ще сторінки для завантаження
    const maxPages = Math.ceil(totalHits / 15);
    console.log(`Поточна сторінка: ${currentPage} / ${maxPages}`);

    if (currentPage >= maxPages) {
      // Якщо це остання сторінка — ховаю кнопку і виводжу повідомлення
      iziToast.info({
        title: 'Кінець колекції',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      hideLoadMoreButton();
    } else {
      // Якщо сторінки залишились — збільшую currentPage та показую кнопку
      currentPage += 1;
      showLoadMoreButton();
    }
  } catch (error) {

    // Якщо сталася помилка при запиті — показую повідомлення і лог в консоль
    console.error('Помилка запиту:', error);
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити зображення. Спробуйте пізніше.',
      position: 'topRight',
    });
  } finally {

    // В будь-якому випадку — ховаю індикатор і скидаю прапорець завантаження
    hideLoader();
    isLoading = false;
  }
}

// Обробник події сабміту форми
form.addEventListener('submit', async event => {
  event.preventDefault(); // відміняю стандартне відправлення форми (щоб не перезавантажувати сторінку)

  // забираю пробіли з початку і кінця
  const query = input.value.trim();

  // Якщо користувач не ввів запит — показую помилку і виходжу
  if (!query) {
    iziToast.error({
      title: 'Помилка',
      message: 'Будь ласка, введіть пошуковий запит.',
      position: 'topRight',
    });
    return;
  }

  // Ініціалізую змінні для нового пошуку
  currentQuery = query;
  currentPage = 1;
  totalHits = 0;

  // Завантажую першу сторінку з новим запитом
  await loadImages(true); // Очікую виконання запиту та оновлення галереї

  // Очищаю поле вводу, щоб було зручно робити нові пошуки
  input.value = '';
});

// Обробник кліку на кнопку Load More
loadMoreButton.addEventListener('click', async () => {
  console.log('Кнопка Load More натиснута');

  // Завантажую наступну сторінку (isFirstLoad = false)
  await loadImages(false); // Очікую доки завантажаться наступні зображення
});



