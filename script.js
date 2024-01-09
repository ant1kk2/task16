"use strict";

/* Я додав трохи тексту, щоб було видно маніпуляції зі скролом */

let scrollPosition = 0;
const form = document.querySelector(".form");
const titleInput = document.querySelector(".title");
const textInput = document.querySelector(".text");

/* Тут створюємо каркас модалки */

const modal = document.createElement("div");
modal.className = "modal";

const modalContainer = document.createElement("div");
modalContainer.className = "modal__container";

const modalTitle = document.createElement("h2");
modalTitle.className = "modal__title";

const modalText = document.createElement("p");
modalText.className = "modal__text";

const modalCloseBtn = document.createElement("button");
modalCloseBtn.className = "modal__close";
modalCloseBtn.textContent = "OK";

modal.style.opacity = "0";

/* Ця функція допоможе прибрати скрол при появі модалки */
function disabledScroll() {
  scrollPosition = window.scrollY;
  document.body.style.cssText = `
        overflow: hidden;
        position: fixed;
        top: -${scrollPosition}px;
        left: 0;
        height: 100vh;
        width: 100vw;
        padding-right: ${window.innerWidth - document.body.offsetWidth}px;
    `;
}

/* Ця функція поверне скрол при зникненні модалки */
function enabledScroll() {
  document.body.style.cssText = ``;
  window.scroll({ top: scrollPosition });
}

/* Ця функція перевіряє чи не пустий інпута, коли ми почали вводити і фарбує поля, якщо пустий*/
function checkInput({ target }) {
  if (target.value.trim() !== "") {
    target.classList.remove("invalid");
  } else {
    target.classList.add("invalid");
  }
}

/* Ця функція виводить алерт і прибирає скрол */
function showAlert(title = "Default title", text = "Default text") {
  modal.prepend(modalContainer);
  modalContainer.append(modalTitle);
  modalContainer.append(modalText);
  modalContainer.append(modalCloseBtn);
  form.after(modal);
  modalTitle.innerHTML = title;
  modalText.innerHTML = text;

  setTimeout(() => {
    /* Якщо так не зробити, модалка буде з`являтись не плавно */
    modal.style.opacity = "1";
  });

  disabledScroll();
}

/* Ця функція перевіряє, щоб поля не були пустими і виводить модалку*/
function showModal(e) {
  e.preventDefault();
  const title = titleInput.value;
  const text = textInput.value;
  if (title.trim() === "") {
    titleInput.classList.add("invalid");
  }
  if (text.trim() === "") {
    textInput.classList.add("invalid");
  }
  if (title.trim() === "" || text.trim() === "") {
    return;
  }
  showAlert(title, text);
}

/* Ця функція прибирає алерт [плавно)] і повертає скрол */
function closeAlert() {
  setTimeout(() => {
    modal.remove();
    // modal.style.visibility = "hidden";
    enabledScroll();
  }, 300);
  modalTitle.innerHTML = "";
  modalText.innerHTML = "";
  modal.style.opacity = "0";
}

/* тут прикручуєм всі функції до лістнерів */
titleInput.addEventListener("input", checkInput);
textInput.addEventListener("input", checkInput);
form.addEventListener("submit", showModal);
modalCloseBtn.addEventListener("click", closeAlert);

/* Це щоб закривати модалку при натисканні на область поза тілом модалки */
modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    closeAlert();
  }
});

window.addEventListener("keydown", (e) => {
  /* Це додатково, щоб не грав скрол при відкритій модалці коли натискаєш пробіл або ентер*/
  if ((e.key === " " || e.key === "Enter") && modal.style.opacity === "1") {
    e.preventDefault();
  }
  /* Це додатково, щоб закривалось при натисканні на ескейп. А також при натисканні на ентер (ми ж зробили його
    preventDefault() у попередньому if), коли кнопка ОК в модалці у фокусі (привіт для людей з обмеженими можливостями)*/
  if (
    (e.key === "Escape" && modal.style.opacity === "1") ||
    (e.key === "Enter" && document.activeElement === modalCloseBtn)
  ) {
    closeAlert();
  }
});
