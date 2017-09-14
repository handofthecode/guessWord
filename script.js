
var randomWord =  function(){
  var words = ['acquiesce', 'alacrity', 'brusque', 'circumspect', 'erudite']

  return function() {
    if (words.length === 0) return '';
    var maxIndex = words.length - 1;
    var index = Math.floor(Math.random() * maxIndex);
    return words.splice(index, 1)[0];
  }
}();

var $word = $('#word');
var $guesses = $('#guesses');
var $apples = $('#apples');
var $message = $('#message');
var $newGame = $('#new_game');

function Game() {
  this.currentWord = randomWord().split('');
  this.chances = 6;
  this.init();
}

Game.prototype = {
  resetScreen: function() {
    $word.html('');
    $guesses.html('');
    $apples[0].className = '';
    this.display('');
    $newGame.hide();
  },
  outOfWords: function() {
    this.display("Sorry, you've played all the words.");
    $newGame.hide();
  },
  createBlanks: function() {
    this.currentWord.forEach(function() {
      $word.append($('<div>').text(' '));
    });
  },
  handleGuess: function(e) {
    var choice = e.key
    if (choice.match(/^[a-z]{1}$/) && !$guesses.text().includes(choice)) {
      if (this.currentWord.includes(choice)) {
        this.correct(choice);
      } else {
        this.incorrect(choice);
      }
      $guesses.append('<div>' + choice + '</div>');
    }
  },
  correct: function(choice) {
    this.currentWord.forEach(function(char, i) {
      if (char === choice) $word.children('div')[i].innerText = choice;
    });
    if ($word.children('div').toArray().every(function(div) {return div.innerText.match(/\w/)})) this.win();
  },
  incorrect: function(choice) {
    this.chances--;
    this.subtractApple();
    if (this.chances === 0) this.lose();
    return function() {
      this.chances;
    }();
  },
  subtractApple: function() {
    var guessNum = String(6 - this.chances);
    $apples[0].className = 'guess-' + guessNum;
  },
  lose: function() {
    document.body.className = 'lose';
    this.display('you lose... :(');
    this.displayPlayAgain();
    this.unregisterHandlers();
  },
  win: function() {
    document.body.className = 'win';
    this.display('you win! :D');
    this.displayPlayAgain();
    this.unregisterHandlers();
  },
  display: function(content) {
    $message.text(content);
  },
  displayPlayAgain: function() {
    $newGame.show();
  },
  unregisterHandlers: function() {
    $(document).off('keyup');
  },
  registerHandlers: function() {
    $(document).on('keyup', this.handleGuess.bind(this));
  },
  init: function() {
    if (this.currentWord.length === 0) this.outOfWords();
    else {
      this.resetScreen();
      this.createBlanks();
      document.body.className = '';
      this.registerHandlers();
    }
  }
}

new Game();

$newGame.on('click', function(e) { 
  e.preventDefault();
  new Game;
});
