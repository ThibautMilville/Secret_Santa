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

    // Arrays
    this.participants = [];

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

    // Check if there are empty fields
    if (this.checkEmptyFields()) {
      alert('Please fill all the fields!');
    }
    else {
      let participantName = inputs[0].value;
      let participantEmail = inputs[1].value;

      // Update participants array
      this.participants.push({
        name: participantName,
        email: participantEmail
      });

      // Add participant to the list
      let newParticipant = document.createElement('div');
      newParticipant.classList.add('participant');
      newParticipant.innerHTML = `
      <span class="participant-name">${participantName}</span>
      <span class="participant-email">${participantEmail}</span>
      <button class="remove-participant"><i class="fa-solid fa-trash"></i></button>
      `;
      this.participantsList.appendChild(newParticipant);
      this.participantsList.style.display = 'flex';

      // Reset inputs
      inputs[0].value = '';
      inputs[1].value = '';

      // Remove participant
      this.removeAParticipant();
    }
  }

  removeAParticipant() {
    let removeButtons = document.querySelectorAll('.remove-participant');
    removeButtons.forEach(removeButton => {
      removeButton.addEventListener('click', function (e) {
        e.preventDefault();

        // Update array by finding the index of the participant to remove
        let participantName = removeButton.parentNode.querySelector('.participant-name').innerHTML;
        let participantEmail = removeButton.parentNode.querySelector('.participant-email').innerHTML;
        let participantIndex = this.participants.findIndex(participant => participant.name === participantName && participant.email === participantEmail);
        this.participants.splice(participantIndex, 1);

        this.participantsList.removeChild(removeButton.parentNode);
        if (this.participantsList.children.length === 0) {
          this.participantsList.style.display = 'none';
        }
      }.bind(this));
    });
  }

  checkEmptyFields() {
    // Check if there are empty required fields in the current slide
    let emptyFields = false;
    let inputs = this.slides[this.currentStep - 1].querySelectorAll('input[required]');

    inputs.forEach(input => {
      if (input.value === '') {
        emptyFields = true;
      }
    });

    return emptyFields;
  }

  checkNumberOfParticipants() {
    // Check if there are at least 2 participants
    if (this.participants.length < 2) {
      return false;
    } else {
      return true;
    }
  }

  // Bindings
  bindEvents() {
    // Next button
    this.nextButtons.forEach(nextButton => {
      nextButton.addEventListener('click', function (e) {
        e.preventDefault();
        switch (this.slides[this.currentStep - 1]) {
          case this.slides[0] || this.slides[2]:
            this.nextStep();
            break;
          case this.slides[1]:
            if (this.checkNumberOfParticipants()) {
              this.nextStep();
            } else {
              alert('You need at least 2 participants!');
            }
            break;
        }
      }.bind(this));
    });
    // Previous button
    this.prevButtons.forEach(prevButton => {
      prevButton.addEventListener('click', function (e) {
        e.preventDefault();
        this.prevStep();
      }.bind(this));
    });
    // Add and remove a participant buttons
    this.addAParticipantButton.addEventListener('click', function (e) {
      e.preventDefault();
      this.addAParticipant();
      this.removeAParticipant();
    }.bind(this));
  }
}