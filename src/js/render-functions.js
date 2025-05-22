// /*Призначення:


// Імпортую бібліотеку для лайтбоксу
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Знаходжу контейнер для галереї
const galleryContainer = document.querySelector('.gallery'); // Вибираю елемент галереї за класом "gallery"

// знаходжу кнопку для пролістування галереі
const loadMoreButton = document.querySelector('.select');

// знаходжу індікатор завантаження
const loader = document.querySelector('.loader');

// перевірка елемента галереї
// console.log('Контейнер галереї знайдено:', galleryContainer);

let lightbox = null; // Змінна для екземпляра SimpleLightbox
// console.log('Ініціалізовано змінну для SimpleLightbox:', lightbox); // перевіряю початкового значення змінної

// Функція для створення галереї з масиву зображень
export function createGallery(images) {
  // Перевіряю отриманий масив зображень
  console.log('Виклик createGallery. Масив зображень:', images);

  try {
    // Генерую HTML-розмітку для кожного елемента з масиву зображень
    const markup = images
      .map(
        ({
          webformatURL, // URL для відображення маленького зображення
          largeImageURL, // URL для великого зображення
          tags, // Опис зображення
          likes, // Кількість лайків
          views, // Кількість переглядів
          comments, // Кількість коментарів
          downloads, // Кількість завантажень
        }) => {
          //Виводжу  дані, які обробляються.
          console.log('Обробка зображення:', {
            webformatURL,
            largeImageURL,
            tags,
          });
          return `
        <li class="gallery-item">
          <a href="${largeImageURL}" class="gallery-link">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
        <div class="info">
        <p><b>Likes:</b> ${likes}</p>
        <p><b>Views:</b> ${views}</p>
        <p><b>Comments:</b> ${comments}</p>
        <p><b>Downloads:</b> ${downloads}</p>
      </div>
    </li>`;
        }
      )

      //Метод .join('') перетворює масив рядків, отриманих після виконання .map(), в єдиний рядок.
      .join('');

    // Додаю згенеровану розмітку в контейнер галереї
    galleryContainer.insertAdjacentHTML('beforeend', markup);

    // Перевіряю чи вже існує екземпляр SimpleLightbox
    if (lightbox) {
      lightbox.refresh(); // Якщо так,оновлюю існуючий екземпляр лайтбоксу для нових елементів
    } else {
      //створюю новий екземпляр SimpleLightbox
      lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt', // Використовую атрибут "alt" для підписів зображення
        captionDelay: 250, // Затримка перед показом підпису
      });

      //перевіряю створення
      // console.log('Створено новий екземпляр SimpleLightbox:', lightbox);

      // Показуємо кнопку після додавання зображень
    }
    // Показати кнопку "Load more" якщо є зображення
    if (galleryContainer.children.length > 0) {
      loadMoreButton.classList.remove('is-hidden');
    }
   
  } catch (error) {
    console.error('Помилка у createGallery:', error);
    throw error;
  }
}
// Функція для очищення галереї
export async function clearGallery() {
  try {
    galleryContainer.innerHTML = ''; // видаляю весь HTML-контент с контейнера галереї

    // Сховати кнопку під час нового пошуку
   await hideLoadMoreButton();

    console.log('Галерея очищена.');
  } catch (error) {

    // Обробка помилок під час очищення
    console.error('Помилка у функції clearGallery:', error);
    throw new Error('Не вдалося очистити галерею.');
  }
}

// Функція для відображення

export async function showLoader() {
  // console.log('Виклик функції showLoader.'); //  виклику функції

  try {
    //
    loader.style.display = 'block';

    console.log('Клас "loading" додано до тега <body>.'); // підтвердження додавання класу після невірного вводу
  } catch (error) {
    // Обробка помилок під час відображення лоадера
    console.error('Помилка у функції showLoader:', error);
    throw new Error('Не вдалося показати лоадер.');
  }
}

// Функція для приховування
export async function hideLoader() {
  // console.log('Виклик функції hideLoader.'); //  виклик
  try {
    //  document.body.classList.remove('loading');  // Видаляю клас "loading" з <body>, щоб приховати стилі лоадера
    loader.style.display = 'none';
    // console.log('Клас "loading" видалено з тега <body>.'); //  підтвердження видалення класу
  } catch (error) {
    // Обробка помилок під час приховування лоадера
    console.error('Помилка у функції hideLoader:', error);
    throw new Error('Не вдалося приховати лоадер.');
  }
}
// Показати кнопку
export async function showLoadMoreButton() {
  try {
    loadMoreButton.classList.remove('is-hidden');
  } catch (error) {
    console.error('Помилка при показі кнопки Load more:', error);
    throw error;
  }
}
// Приховати кнопку
export async function hideLoadMoreButton() {
  try {
    loadMoreButton.classList.add('is-hidden');
  } catch (error) {
    console.error('Помилка при приховуванні кнопки Load more:', error);
    throw error;
  }
}








