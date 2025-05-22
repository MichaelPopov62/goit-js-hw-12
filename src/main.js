

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const input = form.querySelector('input[name="search-text"]');
const loader = document.querySelector('.loader'); // індикатор завантаження
const loadMoreButton = document.querySelector('.select'); // кнопка Load More

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

// Показати лоадер
function showLoader() {
  if (loader) loader.style.display = 'block';
}

// Сховати лоадер
function hideLoader() {
  if (loader) loader.style.display = 'none';
}

// Функція штучної затримки
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Обробник сабміту форми
form.addEventListener('submit', async event => {
  event.preventDefault();

  const query = input.value.trim();

  if (!query) {
    iziToast.error({
      title: 'Помилка',
      message: 'Будь ласка, введіть пошуковий запит.',
      position: 'topRight',
    });
    return;
  }

  try {
    // Сховати кнопку "Load More" перед виконанням запиту
    hideLoadMoreButton();
    // Показати лоадер
    showLoader();

    currentQuery = query;
    currentPage = 1;

    clearGallery();

    // Штучна затримка для демонстрації лоадера
    await delay(2000);

    const data = await getImagesByQuery(currentQuery, currentPage);

    totalHits = data.totalHits;

    if (!data.hits || data.hits.length === 0) {
      iziToast.info({
        title: 'Нічого не знайдено',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      hideLoader();
      return;
    }

    createGallery(data.hits);

    iziToast.success({
      title: 'Успіх',
      message: `Знайдено ${data.hits.length} зображень.`,
      position: 'topRight',
      timeout: 3000,
    });

    if (currentPage * 15 >= totalHits) {
      iziToast.info({
        title: 'Кінець результатів',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      hideLoadMoreButton();
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.error('Помилка запиту:', error);
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити зображення. Спробуйте пізніше.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    input.value = '';
  }
});

// Обробник кнопки Load More
loadMoreButton.addEventListener('click', async () => {
  try {
    currentPage += 1;

    // Сховати кнопку "Load More" перед виконанням запиту
    hideLoadMoreButton();
    // Показати лоадер
    showLoader();

    // Штучна затримка для демонстрації лоадера
    await delay(2000);

    const data = await getImagesByQuery(currentQuery, currentPage);

    if (!data.hits || data.hits.length === 0) {
      iziToast.info({
        title: 'Кінець результатів',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      hideLoadMoreButton();
      hideLoader();
      return;
    }

    createGallery(data.hits);

    // Плавне прокручування вниз на 2 висоти карточки
    const firstCard = document.querySelector('.gallery .photo-card');
    if (firstCard) {
      const cardHeight = firstCard.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    if (currentPage * 15 >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Кінець результатів',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.error('Помилка при завантаженні додаткових зображень:', error);
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити додаткові зображення.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

