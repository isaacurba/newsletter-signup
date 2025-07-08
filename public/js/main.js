document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const submitBtn = document.getElementById("submitBtn");
  const spinner = document.getElementById("loadingSpinner");

  if (form) {
    form.addEventListener("submit", () => {
      // submitBtn.textContent = ""; // Hide text
      submitBtn.disabled = true;
      spinner.classList.remove("d-none");
    });
  }
});
