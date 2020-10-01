const checkboxes = document.querySelectorAll(".form__checkbox");

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      checkbox.parentElement.querySelector(
        ".form__checkbox--span--fill"
      ).style.opacity = 1;
    } else {
      checkbox.parentElement.querySelector(
        ".form__checkbox--span--fill"
      ).style.opacity = 0;
    }
  });
});
