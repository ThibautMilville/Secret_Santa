export default class formLogic {
  constructor() {
    this.currentStep = 1;
    this.form = document.getElementById("multistep-form");
    this.slides = document.querySelectorAll(".slide");
  }

  // Methods
  load() {
    this.bindEvents();
  }

  nextStep() {
    if (this.currentStep < this.slides.length) {
      this.slides[this.currentStep - 1].style.display = "none";
      this.currentStep++;
      this.slides[this.currentStep - 1].style.display = "block";
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.slides[this.currentStep - 1].style.display = "none";
      this.currentStep--;
      this.slides[this.currentStep - 1].style.display = "block";
    }
  }

  // Bindings
  bindEvents() {
  }
}