export default class formLogic {
  constructor() {
    // Elements
    this.form = document.getElementById("multistep-form");
    this.slides = document.querySelectorAll("div.slide");
    this.blacklistList = document.getElementsByClassName('blacklist-list')[0];
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

    // Load the methods
    this.bindEvents();
  }

  // Next button
  nextStep() {
    if (this.currentStep < this.slides.length) {
      this.slides[this.currentStep - 1].classList.remove("active");
      this.currentStep++;
      this.slides[this.currentStep - 1].classList.add("active");
    }
  }

  // Previous button
  prevStep() {
    if (this.currentStep > 1) {
      this.slides[this.currentStep - 1].classList.remove("active");
      this.currentStep--;
      this.slides[this.currentStep - 1].classList.add("active");
    }
  }

  // Add a participant to the participants list
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
      }
    }
  }

  // Remove a participant from the participants list
  removeAParticipant() {
    // Define the participants list and the remove buttons
    let participantsList = document.getElementsByClassName('participants-list')[0];
    let removeButtons = document.querySelectorAll('.remove-participant');

    // For each remove button, add an event listener
    removeButtons.forEach(removeButton => {
      removeButton.addEventListener('click', function (e) {
        e.preventDefault();

        // Update array by finding the index of the participant to remove
        let participantName = removeButton.parentNode.querySelector('.participant-name').innerHTML;
        let participantEmail = removeButton.parentNode.querySelector('.participant-email').innerHTML;
        let participantIndex = this.participants.findIndex(participant => participant.name === participantName && participant.email === participantEmail);
        this.participants.splice(participantIndex, 1);

        // Remove the participant from the displayed list
        console.log(participantsList)
        console.log(removeButton.parentNode);
        participantsList.removeChild(removeButton.parentNode);

        // Hide the participants list if it is empty
        if (participantsList.children.length === 1) {
          participantsList.style.display = 'none';
        }
      }.bind(this));
    });
  }

  // Show the participants list
  showParticipants(participantName, participantEmail) {
    // Define the participants list
    let participantsList = document.getElementsByClassName('participants-list')[0];

    // Add participant to the list
    let newParticipant = document.createElement('div');
    newParticipant.classList.add('participant');
    newParticipant.innerHTML = `
    <span class="participant-name">${participantName}</span>
    <span class="participant-email">${participantEmail}</span>
    <button class="remove-participant" title="Delete the participant"><i class="fa-solid fa-trash"></i></button>
    `;
    participantsList.appendChild(newParticipant);
    participantsList.style.display = 'flex';
  }

  // Initialize the blacklist select elements
  initBlacklist() {
    const selects = this.slides[2].querySelectorAll('select');

    // Add the participants to the select
    function addOptionToSelect(select, participantName) {
      const option = document.createElement('option');
      option.value = participantName;
      option.innerHTML = participantName;
      select.appendChild(option);
    }

    this.participants.forEach(participant => {
      const optionSelect1 = selects[0].querySelector(`option[value="${participant.name}"]`);
      const optionSelect2 = selects[1].querySelector(`option[value="${participant.name}"]`);

      // Add the participant to the select if it is not already in it
      if (!optionSelect1) {
        addOptionToSelect(selects[0], participant.name);
      }

      // Add the participant to the select if it is not already in it
      if (!optionSelect2) {
        addOptionToSelect(selects[1], participant.name);
      }
    });
  }

  // Update the blacklist select elements
  updateSelects(e) {
    const selects = this.slides[2].querySelectorAll('select');
    const changedSelect = e.target;

    if (changedSelect === selects[0] || changedSelect === selects[1]) {
      this.initBlacklist();

      if (changedSelect.value !== 'default') {
        // Remove the default option
        if (changedSelect.querySelector('option[value="default"]')) {
          changedSelect.querySelector('option[value="default"]').remove();
        }
        // Determine the other select and remove the selected option
        const otherSelect = changedSelect === selects[0] ? selects[1] : selects[0];
        const optionToRemove = otherSelect.querySelector(`option[value="${changedSelect.value}"]`);

        if (optionToRemove) {
          optionToRemove.remove();
        }
      }
    }
  }

  // Reset the selects value to default and add the participants to the select list
  resetSelects() {
    // Reset the selects value to default and add the participants to the select
    const selects = this.slides[2].querySelectorAll('select');
    selects.forEach(select => {
      // Remove all existing options
      select.innerHTML = '';

      // Create the default option
      const defaultOption = document.createElement('option');
      defaultOption.value = 'default';
      defaultOption.innerHTML = 'Select a participant';

      // Set the "selected" attribute on the default option
      defaultOption.setAttribute('selected', 'selected');

      // Add the default option to the select
      select.appendChild(defaultOption);

      // Call the function to initialize the participants list
      this.initBlacklist();
    });
  }

  // Add a blacklist to the blacklist list
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
      if (this.currentStep === 3) {
        this.showBlacklist(blacklistGiver, blacklistReceiver);
        this.resetSelects();

        // Remove blacklist
        this.removeABlacklist();
      }
    }
  }

  // Remove a blacklist from the blacklist list
  removeABlacklist() {
    // For each remove button, add an event listener
    let removeButtons = document.querySelectorAll('.remove-blacklist');
    removeButtons.forEach(removeButton => {
      removeButton.addEventListener('click', function (e) {
        e.preventDefault();

        // Update array by finding the index of the blacklist to remove
        let blacklistGiver = removeButton.parentNode.querySelector('.blacklist-giver').innerHTML;
        let blacklistReceiver = removeButton.parentNode.querySelector('.blacklist-receiver').innerHTML;
        let blacklistIndex = this.blacklist.findIndex(blacklist => blacklist.giver === blacklistGiver && blacklist.receiver === blacklistReceiver);
        this.blacklist.splice(blacklistIndex, 1);

        // Remove the blacklist from the displayed list
        this.blacklistList.removeChild(removeButton.parentNode);

        // Hide the blacklist list if it is empty
        if (this.blacklistList.children.length === 0) {
          this.blacklistList.style.display = 'none';
        }
      }.bind(this));
    });
  }

  // Show the blacklist list
  showBlacklist(blacklistGiver, blacklistReceiver) {
    // Add blacklist to the list
    let newBlacklist = document.createElement('div');
    newBlacklist.classList.add('blacklist');
    newBlacklist.innerHTML = `
    <span class="blacklist-giver">${blacklistGiver}</span>
    <span class="blacklist-receiver">${blacklistReceiver}</span>
    <button class="remove-blacklist" title="Delete the blacklist"><i class="fa-solid fa-trash"></i></button>
    `;
    this.blacklistList.appendChild(newBlacklist);
    this.blacklistList.style.display = 'flex';
  }

  // Check if there are empty fields in the current slide
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

  // Check if there are empty required fields in the current slide
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

  // Check if there are at least 2 participants + the organizer
  checkNumberOfParticipants() {
    if (this.participants.length < 3) {
      return false;
    } else {
      return true;
    }
  }

  // Get the value of the textarea
  getTextareaValue() {
    // Get the value of the textarea
    this.message = this.textarea.value;
  }

  // Send data to the server
  sendData() {
    let data = {
      participants: this.participants,
      blacklist: this.blacklist,
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
        return response.json();
      } else {
        alert('Something went wrong, please try again!');
      }
    }).then(data => {
      if (data.response) {
        if (data.response === "Emails sent successfully") {
          this.nextStep();
        }
        else {
          alert('Something went wrong, please try again!');
        }
      }
    });
  }

  // Bindings
  bindEvents() {
    // Next button
    this.nextButtons.forEach(nextButton => {
      nextButton.addEventListener('click', function (e) {
        e.preventDefault();
        if (this.slides[this.currentStep - 1]) {
          if ((this.slides[this.currentStep - 1] === this.slides[0]) || (this.slides[this.currentStep - 1] === this.slides[2])) {
            // If it is the first slide, add the participant
            if (this.slides[this.currentStep - 1] === this.slides[0]) {
              this.addAParticipant();
            }
            this.nextStep();
          }
          else if (this.slides[this.currentStep - 1] === this.slides[1]) {
            // If it is the second slide, check if there are at least 2 participants and init the blacklist
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
    // Update the blacklist select elements
    this.slides[2].querySelectorAll('select').forEach(select => {
      select.addEventListener('change', function (e) {
        e.preventDefault();
        this.updateSelects(e);
      }.bind(this));
    });
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