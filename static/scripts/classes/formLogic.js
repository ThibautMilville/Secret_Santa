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
    if ((this.currentStep < this.slides.length) && !this.checkEmptyFields()) {
      this.slides[this.currentStep - 1].classList.remove("active");
      this.currentStep++;
      this.slides[this.currentStep - 1].classList.add("active");
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.slides[this.currentStep - 1].classList.remove("active");
      this.currentStep--;
      this.slides[this.currentStep - 1].classList.add("active");
    }
  }

  checkEmptyFields() {
    // Check if there are empty fields in the current slide
    let emptyFields = false;
    let inputs = this.slides[this.currentStep - 1].querySelectorAll('input');

    inputs.forEach(input => {
      if (input.value === '') {
        emptyFields = true;
      }
    });
    
    return emptyFields;
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