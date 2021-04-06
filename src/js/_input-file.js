const input = document.querySelector(".form__input--file");
const label = document.querySelector(".form__input--label");

const inputFile = () => {
  if (!input) return;
  input.addEventListener("change", function (e) {
    let fileName = "";
    if (this.files && this.files.length > 1)
      fileName = (this.getAttribute("data-multiple-caption") || "").replace(
        "{count}",
        this.files.length
      );
    else fileName = e.target.value.split("\\").pop();
    if (fileName) label.textContent = fileName;
  });
};

export default inputFile;
