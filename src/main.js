/*Призначення: Основна логіка програми, яка пов'язує всі частини разом.

Функція та дії:
 1.функція getImagesByQuery(query) для отримання даних із API Pixabay (імпортована з pixabay-api.js)
  -Викликає функції з render-functions.js :
  -clearGallery(): Очищає галерею перед новим пошуком.
  -createGallery(images): Відображає нові зображення на сторінці.
  -showLoader() та hideLoader(): Керує відображенням лоадера під час виконання запитів.
  -Обробляє події введення користувачем тексту у форму пошуку.*/

/* Імпортую функції з інших файлів для роботи із запитами та створення і показу галереі.Цей імпорт дозволяє використовувати функцію для запитів до API Pixabay*/
import { getImagesByQuery } from './js/pixabay-api.js';
import { createGallery, clearGallery } from './js/render-functions.js';

// Імпортую бібліотеку для повідомлення
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Знаходжу елементи форми та поля вводу
const form = document.querySelector('.form'); // елемент форми за класом "form"
const input = form.querySelector('input[name="search-text"]'); //поле вводу тексту за ім'ям "search-text"
const loader = document.querySelector('.loader');

/* Чекаю завантаження DOM
Ця подія гарантує, що весь HTML завантажено перед виконанням скриптів*/
document.addEventListener('DOMContentLoaded', () => {
  // При завантаженні сторінки приховую лоадер, щоб він не був видимий.


  // // перевіряю
  // console.log('Лоадер приховано');
});

/* Функція для показу.Вона установлює властивість елементу loader, тоді він становиться видимим на сторінці */
function showLoader() {
  try {
    if (loader)
      loader.style.display = 'block'; // Показую лоадер
  // // Функція для показу лоадера це покращений варіант більш гнучкий можно мати де кілька видів лоадерів і змінювати іх змінюючи клас
  // function showLoader() {
  //   loader.classList.add('visible'); // Додаємо клас для відображення лоадера
  //   console.log('Лоадер показано'); // Для перевірки
  // }
} catch (error) {
  console.error('Помилка у showLoader:', error);
  throw error;
}

  //перевіряю
  console.log('Лоадер показано');
}

/* Функція для приховування лоадера.Вона навпаки приховує елемент с класом loader після завершення запиту.Установлюючі значення none.*/
function hideLoader() {
  try {
    if (loader)
      loader.style.display = 'none'; // Ховаю лоадер
  }
  // // Функція для приховування лоадера. це варіант 2.
  // function hideLoader() {
  //   loader.classList.remove('visible'); // Забираємо клас, щоб приховати лоадер
  //   console.log('Лоадер приховано'); // Для перевірки
  // }
 catch (error) {
  console.error('Помилка у hideLoader:', error);
  throw error;
}

  //перевіряю
  console.log('Лоадер приховано');
}

/* Додаю обробник події на відправку форми
Цей обробник викликається кожного разу, коли користувач натискає кнопку відправлення форми. Його основна мета — виконати пошук зображень, базуючись на введеному тексті.*/
form.addEventListener('submit', async event => {
  //Запобігаю перезавантаженню сторінки за замовчуванням при сабміті форми
  event.preventDefault();

  // перевірка події submit
  // console.log('Форма відправлена.');

  // Отримую та очищую введений текст
  const query = input.value.trim(); // Вилучаю зайві пробіли з обох боків введеного тексту

  //перевірка отриманого значення
  // console.log('Пошуковий запит:', query);

  // Перевіряю, чи поле введення не порожнє
  if (!query) {
    // Показую помилку користувачеві через повідомлення
    iziToast.error({
      title: 'Помилка',
      message: 'Будь ласка, введіть пошуковий запит.',
      position: 'topRight',
    });

    return; // Завершую виконання функції
  }
  //Якщо в якомусь з await буде помилка (проміс відхилино)вона перейде на catch на обробку
  try {
    showLoader(); // Відображаю анімацію завантаження

    // Очищую галерею та показуємо лоадер
    clearGallery(); // Видаляю попередні результати пошуку

    // Використання setTimeout для симуляції затримки
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Лоадер показано після відправки запиту.');

    // Виконую запит до API та обробляю результати
    const data = await getImagesByQuery(query);

    console.log('Після виклику getImagesByQuery. Отримано дані:', data); // підтвержую отримання відповіді від API

    // Перевіряю, чи є результати у відповіді
    if (!data.hits || data.hits.length === 0) {
      /*Я перевіряю, чи існує масив "hits" у відповіді API та чи містить він хоча б один елемент.Якщо масив "hits" відсутній або порожній, це означає, що результатів пошуку немає.У цьому випадку я показуємо відповідну інфориацію користувачеві через повідомлнення.Назву масива я отримую з публічного сервіса API Pixabay коли роблю запит*/
      iziToast.info({
        title: 'Нічого не знайдено',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });

      // console.log('Масив hits порожній або не існує.'); // підтвердження відсутності результатів

      return; // Завершую виконання функції
    }

    // Створюю галерею з отриманих даних
    createGallery(data.hits); // Використовую отриманий масив зображень для створення галереї

    //Виводжу інформацію  про створення галереї
    // console.log('Галерея створена. Кількість зображень:', data.hits.length);

    // Відображаю успішне повідомлення
    iziToast.success({
      title: 'Успіх',
      message: `Знайдено ${data.hits.length} зображень.`,
      position: 'topRight',
      timeout: 3000,
    });
  } catch (error) {
    //обробляю помилку
    console.error('Помилка запиту:', error); // Лог у консоль для діагностики
    // Відображаю повідомлення про помилку
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити зображення. Спробуйте пізніше.',
      position: 'topRight',
    });
  } finally {
    // Ховаю лоадер та очищую поле вводу
    hideLoader(); // Приховую анімацію завантаження
    input.value = ''; // Очищаю текстове поле

    // Лог завершення операції
    console.log('Лоадер схований, поле введення очищене.');
  }
});
