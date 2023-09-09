export default class formLogic {
  constructor() {
    // Elements
    this.form = document.getElementById("multistep-form");
    this.slides = document.querySelectorAll("div.slide");
    this.nextButtons = document.querySelectorAll('.next-button');
    this.prevButtons = document.querySelectorAll('.prev-button');

    // Properties
    this.currentStep = 1;

    this.load();
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
    // Next button
    this.nextButtons.forEach( nextButton => {
      nextButton.addEventListener('click', function () {
        this.nextStep();
      }.bind(this));
    });

    // Previous button
    this.prevButtons.forEach( prevButton => {
      prevButton.addEventListener('click', function () {
        this.prevStep();
      }.bind(this));
    });
  }
}