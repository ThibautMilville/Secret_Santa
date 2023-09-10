export default class formLogic {
  constructor() {
    // Elements
    this.form = document.getElementById("multistep-form");
    this.slides = document.querySelectorAll("div.slide");
    this.participantsList = document.getElementsByClassName('participants-list')[0];

    this.nextButtons = document.querySelectorAll('.next-button');
    this.prevButtons = document.querySelectorAll('.prev-button');
    this.addAParticipantButton = document.getElementsByClassName('add-a-participant')[0];

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

  addAParticipant() {
    let inputs = this.slides[this.currentStep - 1].querySelectorAll('input');
    let participantName = inputs[0].value;
    let participantEmail = inputs[1].value;

    let newParticipant = document.createElement('div');
    newParticipant.classList.add('participant');
    newParticipant.innerHTML = `
      <span class="participant-name">${participantName}</span>
      <span class="participant-email">${participantEmail}</span>
      <button class="remove-participant"><i class="fa-solid fa-trash"></i></button>
    `;
    this.participantsList.appendChild(newParticipant);
    this.participantsList.style.display = 'flex';
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
    this.nextButtons.forEach(nextButton => {
      nextButton.addEventListener('click', function(e) {
        e.preventDefault();
        this.nextStep();
      }.bind(this));
    });
    // Previous button
    this.prevButtons.forEach(prevButton => {
      prevButton.addEventListener('click', function(e) {
        e.preventDefault();
        this.prevStep();
      }.bind(this));
    });
    // Add a participant button
    this.addAParticipantButton.addEventListener('click', function(e) {
      e.preventDefault();
      this.addAParticipant();
    }.bind(this));
  }
}