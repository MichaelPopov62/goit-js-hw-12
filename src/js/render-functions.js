

 /* Файл відповідає за роботу інтерфейсу галереї.

 1.createGallery(images) — формує і додає HTML в .gallery.
 2.clearGallery() — очищає HTML в .gallery.
 3.showLoader() / hideLoader() — керують індикатором завантаження.
 4.showLoadMoreButton() / hideLoadMoreButton() — показують або ховають кнопку завантаження.
5. у файлі ініціалізується SimpleLightbox — бібліотека для модального перегляду зображень.
 */



/* Імпорт бібліотеки SimpleLightbox для перегляду зображень у модальному вікні (збільшення за кліком).*/

 import SimpleLightbox from 'simplelightbox';
 import 'simplelightbox/dist/simple-lightbox.min.css';

// Пошук елементів у DOM, які потрібні для роботи галереї

 // Знаходжу контейнер для галереї. Щоб надалі працювати з елементами,зберігаю їх у змінних.
const galleryContainer = document.querySelector('.gallery'); // Вибираю елемент галереї за класом "gallery"

 // знаходжу кнопку для пролістування галереі
 const loadMoreButton = document.querySelector('.select');

 // знаходжу індікатор завантаження
 const loader = document.querySelector('.loader');

// перевірка елемента галереї
console.log('Контейнер галереї знайдено:', galleryContainer);

 let lightbox = null; // Змінна для екземпляра SimpleLightbox.Вона буде містить екземпляр бібліотеки SimpleLightbox, щоб оновлювати або ініціалізувати lightbox після рендера.
// console.log('Ініціалізовано змінну для SimpleLightbox:', lightbox); // перевіряю початкового значення змінної

 /* Функція createGallery
   Приймає масив об'єктів (зображень) і додає їх до галереї.Також налаштовує або оновлює модальне вікно для перегляду зображень.*/

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
   <li class="photo-card gallery-item">
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
    }
   
  } catch (error) {
    console.error('Помилка у createGallery:', error);//виводжу помилку в консоль
    throw error; //// Передаю помилку далі, щоб її можна було обробити
  }
}

/*  Функція clearGallery.Видаляє всі зображення з галереї перед новим пошуком. Це дозволяє уникнути дублювання старих результатів.*/
 
 export  function clearGallery() {
  try {
    galleryContainer.innerHTML = ''; // видаляю весь HTML-контент с контейнера галереї


    console.log('Галерея очищена.'); //  підтвержую очищення
  } catch (error) {

   // Обробка помилок під час очищення
    console.error('Помилка у функції clearGallery:', error); // виводжу при помилке
     throw new Error('Не вдалося очистити галерею.'); // нова помилка з описом
  }
 }

 /*
  Показує індикатор завантаження (loader).Ця функція керує видимістю .loader через зміну стилів.
 */
export function showLoader() {
  if (loader) loader.style.display = 'block';
  console.log('Індикатор завантаження показано.');
}


//  Ховає індикатор завантаження (loader).
 
export function hideLoader() {
  if (loader) loader.style.display = 'none';
  console.log('Індикатор завантаження сховано.');
}

// Показує кнопку "Load More".Вона має клас is-hidden, який потрібно видалити.

export function showLoadMoreButton() {
  if (loadMoreButton) loadMoreButton.classList.remove('is-hidden');
  console.log('Кнопку "Load More" показано.');
}

// Ховає кнопку "Load More".
 
export function hideLoadMoreButton() {
  if (loadMoreButton) loadMoreButton.classList.add('is-hidden');
  console.log('Кнопку "Load More" сховано.');
}





