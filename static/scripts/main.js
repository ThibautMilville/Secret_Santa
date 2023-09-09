import formLogic from "./classes/formLogic.js";

const form = new formLogic();

document.addEventListener('DOMContentLoaded', function () {
  const nextButtons = document.querySelectorAll('.next-button');
  const prevButtons = document.querySelectorAll('.prev-button');

  nextButtons.forEach( nextButton => {
    nextButton.addEventListener('click', function () {
      form.nextStep();
    });
    
  });

  prevButtons.forEach( prevButton => {
    prevButton.addEventListener('click', function () {
      form.prevStep();
    });
  });
});