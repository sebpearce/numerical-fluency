/**
 * Numerical Fluency
 * Copyright 2014 Seb Pearce
 * Licensed under the MIT license.
 * 
 */

/* 

TODO:

- Make it so that when you change permode to 3, it doesn't multiply the rand
int by 10, i.e. it gives results like 650 and 320 instead of 600 and 300.

Difficulty slider:
Level 1 - single & single
Level 2 - 2 digits & single
Level 3 - 2 digits & 2 digits
Level 4 - 3 digits & 2 digits
Level 5 - 3 digits & 3 digits

- When it gets near 200, repopulate the array with a function.
- Score rewards?
- Time elapsed displayed on screen?

*/

var answerInput = document.getElementById('answer');
var questionInput = document.getElementById('question');
var lastProblem = document.getElementById('lastproblem');
var incorrectMsg = document.getElementById('incorrect');
var correctMsg = document.getElementById('correct');
var scoreDisplay = document.getElementById('score');

var CPM = 0;
var timerInterval;
var secondsElapsed;
var startTime = 0;

function precise_round(num,decimals) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

var operators = ['+','–','*','%'];

var a, b, o, mode, submode;

var problem = '';
var answer = 0;
var score = 0;

var submode = '2';
var addmode = '2';
var mulmode = '2';
var permode = '2';

var counter = 0;

var problemList = new Array();

var messageScores = [10, 25, 50, 100];

var animationSpeed = 800;
var easingType = 'easeOutQuad';
var hasAnswered = false;

function loadNewProblem(mode) {

  switch (mode) {
    case '+':
      o = 0;
      break;
    case '–':
      o = 1;
      break;
    case '*':
      o = 2;
      break;
    case '%':
      o = 3;
      break;
    default:
      o = randomInt(3);
      break;
  }

  switch (o) {
    case 0:
      var power = Math.pow(10,addmode-2);
      a = randomInt(88*power) + 11*power;
      b = randomInt(88*power) + 11*power;
      answer = a + b;
      problem = a + ' + ' + b;
      break;
    case 1:
      var power = Math.pow(10,submode-2);
      a = randomInt(80*power) + 19*power;
      b = randomInt(a-(12*power)) + 11*power;
      answer = a - b;
      problem = a + ' – ' + b;
      break;
    case 2:
      var power = Math.pow(10,mulmode-2);
      a = randomInt(88*power) + 11*power;
      b = randomInt(7*power) + 2*power;
      answer = a * b;
      problem = a + ' \u00D7 ' + b;
      break;
    case 3:
      var power = Math.pow(10,permode-2);
      a = (randomInt(18)+1) * 5;
      b = (randomInt(8) * 10)*power + 10*power;
      answer = precise_round(b * (a/100),2);
      problem = a + '% of ' + b;
      break;
    default:
      answer = 0;
      break;
  }

  return { problem: problem, answer: answer };

}

// refillProblemList () {}

answerInput.addEventListener('keypress', function(e) {

  if (e.keyCode == 13) {

    // if we haven't just had an answer AND
    if (!hasAnswered && 
       // the user's answer was correct OR
       (answerInput.value == problemList[counter].answer ||
       // it's a points message
        problemList[counter].answer == 'x')) {

      hasAnswered = true;

      // 'x' means a points message, so don't increment the score
      if (problemList[counter].answer != 'x') {
        score++;
        lastProblem.innerHTML = problemList[counter].problem + ' = ' + 
          problemList[counter].answer;
        // update correct per minute
        CPM = score / (secondsElapsed / 60);
        $( '#timedebug2' ).text(CPM.toFixed(1) + ' per minute');
        // show correct
        $( '#correct' ).css({opacity: '1'});
        $( '#correct' ).animate({
          zoom: 6,
          opacity: 0.2,
          lineHeight: '0px',
          color: 'transparent'
        }, animationSpeed, easingType);

      } else {
        lastProblem.innerHTML = problemList[counter].problem;
      }
      scoreDisplay.innerHTML = score;   

      $( '#incorrect' ).hide();

      // fade in new question at the back
      $( '#question-next-fade-in' ).hide().text(problemList[counter+5].problem)
        .fadeTo(1500,0.1);

      // next question 4 zoom
      $( '#question-next-4' ).animate({
        zoom: 1.3,
        opacity: 0.2,
        marginTop: '5px',
        textShadow: '0 0 3px hsl(210, 30%, 83%)'
      }, animationSpeed, easingType);

      // next question 3 zoom
      $( '#question-next-3' ).animate({
        zoom: 1.35,
        opacity: 0.2,
        marginTop: '6px',
        textShadow: '0 0 3px hsl(210, 30%, 83%)'
        // color: 'rgba(199, 212, 225, 0.5)'
      }, animationSpeed, easingType);

      // next question 2 zoom
      $( '#question-next-2' ).animate({
        zoom: 1.6,
        opacity: 0.2,
        marginTop: '10px',
        textShadow: '0 0 3px hsl(210, 30%, 83%)',
        // color: 'hsl(210, 30%, 83%)'
      }, animationSpeed, easingType);

      // next question 1 zoom
      $( '#question-next-1' ).animate({
        zoom: 2.5,
        opacity: 1,
        marginTop: '7px',
        // marginTop: '1.47%',
        textShadow: 'none',
        color: 'hsl(210, 30%, 83%)'
      }, animationSpeed, easingType);

      // main question zoom
      $( '#question' ).animate({
        zoom: 3,
        opacity: 0,
        marginTop: '-10px',
        color: 'transparent'
      }, animationSpeed, easingType, function(){
        $( '#question, #question-next-1, #question-next-2, #question-next-3, #question-next-4, #question-next-fade-in, #correct').removeAttr('style');
        $( '#question-next-fade-in' ).hide();
        $( '#question' ).text(problemList[++counter].problem);
        $( '#question-next-1' ).text(problemList[counter+1].problem);
        $( '#question-next-2' ).text(problemList[counter+2].problem);
        $( '#question-next-3' ).text(problemList[counter+3].problem);
        $( '#question-next-4' ).text(problemList[counter+4].problem);
        // console.log(problemList[counter].problem + "; " + problemList[counter].answer)
        console.log('counter: ' + counter);
        answerInput.value = '';
        answerInput.focus();
        // reset incorrectMsg opacity and turn on display in background
        $( '#incorrect' ).css({opacity: '0'}).show();

        hasAnswered = false;

      });

    } else {
      $( '#incorrect' ).css({opacity: '1'});
      $( '#answer' ).effect( 'shake', function(){
        answerInput.value = '';
        answerInput.focus();
      });
    }

  // cheat code!!!
  } else if (e.keyCode == 104) { // h
    e.preventDefault();
    answerInput.value = problemList[counter].answer;
  }

});


function handleClick(radiobutton) {

  switch (radiobutton.value) {
    case 'add':
      mode = '+';
      break;
    case 'subtract':
      mode = '–';
      break;
    case 'multiply':
      mode = '*';
      break;
    case 'percent':
      mode = '%';
      break;
    case 'all':
      mode = '';
      break;
    default:
      break;
  }

  $( '#incorrect' ).css({opacity: '0'}).show();

  // push 100 new problems onto problemList
  problemList = [];
  counter = 0;
  var i = 0;
  while (i++ < 1000) {
    problemList.push(loadNewProblem(mode)); // returns an obj with problem & answer
  }

  messageScores.forEach(function(item) {
    if (item > score) {
      problemList[item - score].problem = item + ' POINTS!';
      problemList[item - score].answer = 'x';
    }
  });

  // $( '#question' ).text(loadNewProblem(mode).problem);
  $( '#question' ).text(problemList[counter].problem);
  $( '#question-next-1' ).text(problemList[counter+1].problem);
  $( '#question-next-2' ).text(problemList[counter+2].problem);
  $( '#question-next-3' ).text(problemList[counter+3].problem);
  $( '#question-next-4' ).text(problemList[counter+4].problem);
  answerInput.focus();

};

$(document).ready(function(){

  // push 100 new problems onto problemList
  var i = 0;
  while (i++ < 1000) {
    problemList.push(loadNewProblem()); // returns an obj with problem & answer
  }

  messageScores.forEach(function(item) {
    if (item > score) {
      problemList[item - score].problem = item + ' POINTS!';
      problemList[item - score].answer = 'x';
    }
  });

  $( '#question' ).text(problemList[counter].problem);
  $( '#question-next-1' ).text(problemList[counter+1].problem);
  $( '#question-next-2' ).text(problemList[counter+2].problem);
  $( '#question-next-3' ).text(problemList[counter+3].problem);
  $( '#question-next-4' ).text(problemList[counter+4].problem);
  answerInput.focus();

  startTime = Date.now();

  timerInterval = setInterval(function(){

    secondsElapsed = parseInt((Date.now() - startTime) / 1000);
    // $( '#timedebug' ).text(secondsElapsed);

  }, 1000);

  incorrectMsg.innerHTML = 'Try again.';
  correctMsg.innerHTML = 'Correct!';


});


