/*При сабміті форми (submit):

Очищаємо галерею і скидаємо сторінку (currentPage = 1).

Запитуємо першу сторінку з новим запитом.

Показуємо повідомлення про знайдену кількість зображень.

Кнопка Load More стає видимою, якщо є ще сторінки.

При кліку на Load More:

Запитуємо наступну сторінку (currentPage збільшується після кожного запиту).

Додаємо нові зображення до галереї.

Оновлюємо SimpleLightbox (refresh).

Якщо досягнуто останньої сторінки — ховаємо кнопку та показуємо повідомлення.

Прокрутка сторінки при додаванні нових карток виконується так, щоб користувач бачив новий контент.*/




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
const loader = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.select');
const gallery = document.querySelector('.gallery');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;
let isLoading = false;

function showLoader() {
  if (loader) loader.style.display = 'block';
}

function hideLoader() {
  if (loader) loader.style.display = 'none';
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadImages(isFirstLoad = false) {
  if (isLoading) return;

  isLoading = true;
  showLoader();
  hideLoadMoreButton();

  try {
    await delay(1000);

    const data = await getImagesByQuery(currentQuery, currentPage);

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
      return;
    }

    if (isFirstLoad) {
      clearGallery();
      totalHits = data.totalHits;

      const maxPages = Math.ceil(totalHits / 15);
      console.clear();
      console.log(`Новий запит: "${currentQuery}"`);
      console.log(
        `Загальна кількість результатів: ${totalHits}, Максимальна кількість сторінок: ${maxPages}`
      );

      iziToast.success({
        title: 'Успіх',
        message: `Знайдено ${totalHits} зображень.`,
        position: 'topRight',
        timeout: 2000,
      });
    }

    createGallery(data.hits);

    if (isFirstLoad) {
      // При першому запиті скролимо вгору
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      // При наступних запитах – скролимо вниз, якщо контент більший за висоту вікна
      const firstCard = gallery.querySelector('.photo-card');
      if (firstCard) {

        const cardHeight = firstCard.getBoundingClientRect().height || 200; // Висота картки (default 200)
        const galleryHeight = gallery.scrollHeight;

        if (galleryHeight > window.innerHeight) {
          window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
          });
        }
      }
    }

    const maxPages = Math.ceil(totalHits / 15);
    console.log(`Поточна сторінка: ${currentPage} / ${maxPages}`);

    if (currentPage >= maxPages) {
      iziToast.info({
        title: 'Кінець колекції',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      hideLoadMoreButton();
    } else {
      currentPage += 1;
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
    isLoading = false;
  }
}

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

  currentQuery = query;
  currentPage = 1;
  totalHits = 0;

  await loadImages(true);
  input.value = '';
});

loadMoreButton.addEventListener('click', async () => {
  console.log('Кнопка Load More натиснута');
  await loadImages(false);
});



