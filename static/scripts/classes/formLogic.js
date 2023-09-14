export default class formLogic {
  constructor() {
    // Elements
    this.form = document.getElementById("multistep-form");
    this.slides = document.querySelectorAll("div.slide");
    this.participantsList = document.getElementsByClassName('participants-list')[0];
    this.textarea = document.getElementById('message');

    // Buttons
    this.nextButtons = document.querySelectorAll('.next-button');
    this.prevButtons = document.querySelectorAll('.prev-button');
    this.addAParticipantButton = document.getElementsByClassName('add-a-participant')[0];
    this.addABlacklistButton = document.getElementsByClassName('add-a-blacklist')[0];
    this.submitButton = document.getElementById('submit-button');

    // Properties
    this.currentStep = 1;

    // Arrays
    this.participants = [];
    this.blacklist = [];
    this.message = '';

    this.load();
  }

  // Methods
  load() {
    this.bindEvents();
  }

  nextStep() {
    if (this.currentStep < this.slides.length) {
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
    if (this.currentStep === 1 && this.checkEmptyFieldsRequired()) {
      alert('Please fill all the fields!');
    }
    else if (this.currentStep != 1 && this.checkEmptyFields()) {
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

      // If it is the second slide, show the participants list
      if (this.currentStep === 2) {
        this.showParticipants(participantName, participantEmail);

        // Reset inputs
        inputs[0].value = '';
        inputs[1].value = '';

        // Remove participant
        this.removeAParticipant();
      }
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

  showParticipants(participantName, participantEmail) {
    // Add participant to the list
    let newParticipant = document.createElement('div');
    newParticipant.classList.add('participant');
    newParticipant.innerHTML = `
    <span class="participant-name">${participantName}</span>
    <span class="participant-email">${participantEmail}</span>
    <button class="remove-participant" title="Delete the participant"><i class="fa-solid fa-trash"></i></button>
    `;
    this.participantsList.appendChild(newParticipant);
    this.participantsList.style.display = 'flex';
  }

  initBlacklist() {
    // Get the select elements
    let selects = this.slides[2].querySelectorAll('select');

    // Add participants to the select elements
    this.participants.forEach(participant => {
      let option = document.createElement('option');
      option.value = participant.name;
      option.innerHTML = participant.name;
      selects[0].appendChild(option);
      selects[1].appendChild(option.cloneNode(true));
    });
  }

  addABlacklist() {
    let selects = this.slides[this.currentStep - 1].querySelectorAll('select');

    // Check if there are empty fields
    if (this.checkEmptyFields()) {
      alert('Please fill all the fields!');
    }
    else {
      let blacklistGiver = selects[0].value;
      let blacklistReceiver = selects[1].value;

      // Update blacklist array
      this.blacklist.push({
        giver: blacklistGiver,
        receiver: blacklistReceiver
      });

      // If it is the second slide, show the blacklist list
      if (this.currentStep === 2) {
        // this.showBlacklist(blacklistGiver, blacklistReceiver);

        // Reset inputs
        selects[0].value = '';
        selects[1].value = '';

        // Remove blacklist
        // this.removeABlacklist();
      }
    }
  }

  checkEmptyFields() {
    // Check if there are empty fields in the current slide
    let emptyFields = false;
    let inputs = this.slides[this.currentStep - 1].querySelectorAll('input', 'select');

    inputs.forEach(input => {
      if (input.value === '') {
        emptyFields = true;
      }
    });

    return emptyFields;
  }

  checkEmptyFieldsRequired() {
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

  getTextareaValue() {
    // Get the value of the textarea
    this.message = this.textarea.value;
  }

  sendData() {
    // Send data to the server
    let data = {
      participants: this.participants,
      message: this.message
    };

    fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    }).then(response => {
      if (response.status === 200) {
        alert('Your form has been submitted!');
      } else {
        alert('Something went wrong, please try again!');
      }
    })
  }

  // Bindings
  bindEvents() {
    // Next button
    this.nextButtons.forEach(nextButton => {
      nextButton.addEventListener('click', function (e) {
        e.preventDefault();
        if (this.slides[this.currentStep - 1]) {
          if (this.slides[0] || this.slides[2]) {
            // If it is the first slide, add the participant
            if (this.slides[this.currentStep - 1] === this.slides[0]) {
              this.addAParticipant();
            }
            this.nextStep();
          }
          else if (this.slides[1]) {
            // If it is the second slide, check if there are at least 2 participants
            if (this.checkNumberOfParticipants()) {
              this.initBlacklist();
              this.nextStep();
            } else {
              alert('You need at least 2 participants!');
            }
          }
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
    // Add and remove a blacklist buttons
    this.addABlacklistButton.addEventListener('click', function (e) {
      e.preventDefault();
      this.addABlacklist();
      // this.removeABlacklist();
    }.bind(this));
    // Submit button
    this.submitButton.addEventListener('click', function (e) {
      e.preventDefault();
      this.getTextareaValue();
      this.sendData();
    }.bind(this));
  }
}