

/* Які діі в цьому файлі:
1.createGallery(images) — формує і додає HTML в .gallery.
2.clearGallery() — очищає HTML в .gallery.
3.showLoader() / hideLoader() — керують індикатором завантаження.
4.showLoadMoreButton() / hideLoadMoreButton() — показують або ховають кнопку завантаження.*/


/* Імпортую бібліотеку для лайтбоксу.ДЛя перегляду зображень в модальному вікні. Бібліотека SimpleLightbox надає зручний перегляд зображень у вигляді модального вікна зі збільшенням.*/
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Знаходжу контейнер для галереї. Щоб надалі працювати з елементами,зберігаю їх у змінних.
const galleryContainer = document.querySelector('.gallery'); // Вибираю елемент галереї за класом "gallery"

// знаходжу кнопку для пролістування галереі
const loadMoreButton = document.querySelector('.select');

// знаходжу індікатор завантаження
const loader = document.querySelector('.loader');

// перевірка елемента галереї
// console.log('Контейнер галереї знайдено:', galleryContainer);

let lightbox = null; // Змінна для екземпляра SimpleLightbox.Вона буде містить екземпляр бібліотеки SimpleLightbox
// console.log('Ініціалізовано змінну для SimpleLightbox:', lightbox); // перевіряю початкового значення змінної

/* Функція для створення галереї з масиву зображень, зображення будут рендеріться.
 1. Перетворюємо кожне зображення з масиву на шматок HTML-коду, щоб відобразити його в галереї.
 2.Усі згенеровані HTML-елементи вставляються всередину контейнера з класом .gallery, тобто на сторінку.
 3. Якщо модальне вікно для перегляду зображень (lightbox) уже створене — оновлюємо його, щоб показував нові фото. Якщо його ще немає — створюємо нове.
 4.Якщо в галереї вже є хоча б одне зображення — показуємо кнопку "Load more", щоб користувач міг завантажити ще.*/
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

/* Функція для очищення галереї, приховування кнопки "Loadmore".
Видаля. весь вміст галереї перед новим запитом. Також ховаю кнопку "Load more", бо вона не потрібна під час нового пошуку. Немає жодної причини бути async. Вона ні чекає нічого з затримкою*/
export  function clearGallery() {
  try {
    galleryContainer.innerHTML = ''; // видаляю весь HTML-контент с контейнера галереї

    // Сховати кнопку під час нового пошуку
    hideLoadMoreButton();

    console.log('Галерея очищена.');
  } catch (error) {

    // Обробка помилок під час очищення
    console.error('Помилка у функції clearGallery:', error);
    throw new Error('Не вдалося очистити галерею.');
  }
}

/* Функціі для того щоб під час запиту показую лоадер, після завершення — ховаю.
Вони обидві синхронні бо просто забирають і додають клас лоадера в DOM- операціі*/

export function showLoader() { //керує коли треба показувати лоадер
  // console.log('Виклик функції showLoader.'); //  виклику функції

  try {
    //
    loader.style.display = 'block'; /*Тут я показую що індикатор завантаження (loader) на сторінці.Перед тим, як починаєтся завантажуваня зображення з API, я викликаю цю команду, щоб зрозуміти-йде завантаження.Потім коли завантаження завершується я ховаю лоадер іншою функцією*/
    console.log('Клас "loading" додано до тега <body>.'); // підтвердження додавання класу після невірного вводу
  } catch (error) {
    // Обробка помилок під час відображення лоадера
    console.error('Помилка у функції showLoader:', error);
    throw new Error('Не вдалося показати лоадер.');
  }
}

// Функція для приховування
export function hideLoader() {
  // console.log('Виклик функції hideLoader.'); //  виклик
  try {
    loader.style.display = 'none'; //Коли завантаження зображень завершено, я використовую цей рядок, щоб сховати спінер , який показує, що щось завантажується. Елемент буде ніби видалений зі сторінки (але фізично залишиться в коді)
    // console.log('Клас "loading" видалено з тега <body>.'); //  підтвердження видалення класу
  } catch (error) {
    // Обробка помилок під час приховування лоадера
    console.error('Помилка у функції hideLoader:', error);
    throw new Error('Не вдалося приховати лоадер.');
  }
}

/* Кнопка "Load more" зʼявляється лише якщо є що завантажити. Коли починаєтьсчя новий пошук — ховаю її. Після успішного завантаження — показую знову.Для куруванням кнопкою додаю дві функціі*/
//показую кнопку
export function showLoadMoreButton() {
  try {
    loadMoreButton.classList.remove('is-hidden'); //прибираю клас is-hidden який раніше ховав цю кнопку.Виконується тоді коли зображень більш ніж одна сторінка
  } catch (error) {
    console.error('Помилка при показі кнопки Load more:', error);
    throw error;
  }
}
// Приховати кнопку
export function hideLoadMoreButton() {
  try {
    loadMoreButton.classList.add('is-hidden'); //додаю клас is-hidden який раніше був знятий.Виконується тоді коли зображень тільки на одну сторінку
  } catch (error) {
    console.error('Помилка при приховуванні кнопки Load more:', error);
    throw error;
  }
}








