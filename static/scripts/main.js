let currentStep = 1;
const form = document.getElementById("multistep-form");
const slides = document.querySelectorAll(".slide");

function nextStep() {
  if (currentStep < slides.length) {
    slides[currentStep - 1].style.display = "none";
    currentStep++;
    slides[currentStep - 1].style.display = "block";
  }
}

function prevStep() {
  if (currentStep > 1) {
    slides[currentStep - 1].style.display = "none";
    currentStep--;
    slides[currentStep - 1].style.display = "block";
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
});