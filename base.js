// don't touch this
output = document.getElementById('output');

// logging function
function log() {
  try {
    console.log.apply(console, arguments);
  }
  catch(e) {
    try {
      opera.postError.apply(opera, arguments);
    }
    catch(e){
      alert(Array.prototype.join.call( arguments, " "));
    }
  }
}

// check if integer
function isInt(x) {
  return (typeof x === 'number' && (x % 1) === 0);
}

// return random integer
function randomInt(max)
{
    return Math.floor(Math.random()*(max+1));
}
