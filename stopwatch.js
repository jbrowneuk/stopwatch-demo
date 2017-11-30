let interval;
let timeStarted;

let isStarted = false;
let startOffset = 0;

setUp();

/**
 * Function used to pad a number with zeros in front of it until the resultant
 * string is the specified length. If the resultant string is greater than or
 * equal to length, it is returned without padding.
 */
function padNumber(number, length) {
  let stringValue = '' + number;
  while (stringValue.length < length) {
    stringValue = '0' + stringValue;
  }

  return stringValue;
}

/**
 * Function used to get the elapsed time since pressing the start button in the
 * format '[mm:]ss:cs'.
 *
 * Uses a time interval calculated using the JavaScript Date object for an
 * accurate elapsed time (rather than relying upon an incremented variable that
 * is updated in an interval function, as these are run in the event loop which
 * may be called after the interval due to JavaScript's single-threaded nature)
 */
function getFormattedElapsedTime() {
  // Use date functions to get accurate elapsed time
  const msec = Date.now() - timeStarted.getTime();

  const centiseconds = Math.floor(msec / 10) % 100;
  const seconds = Math.floor(msec / 1000) % 60;
  const minutes = Math.floor(msec / (1000 * 60)) % 60;

  let minutesText = '';
  if (minutes > 0) {
    minutesText = padNumber(minutes, 2) + ':';
  }

  return minutesText + padNumber(seconds, 2) + ':' + padNumber(centiseconds, 2);
}

/**
 * Convenience method to handle starting/stopping the stopwatch timer.
 */
function handleStartStop() {
  if (isStarted) {
    stopTimer();
  } else {
    startTimer();
  }
}

/**
 * Function that starts (or resumes) the stopwatch timer.
 */
function startTimer() {
  timeStarted = new Date(Date.now() - startOffset);
  interval = setInterval(() => {
    const outputElement = document.getElementById('stopwatch-output');
    outputElement.innerHTML = getFormattedElapsedTime();
    outputElement.className = 'running';
  }, 50);

  isStarted = true;
}

/**
 * Function that pauses the stopwatch timer.
 */
function stopTimer() {
  clearInterval(interval);
  startOffset = Date.now() - timeStarted.getTime();
  const outputElement = document.getElementById('stopwatch-output');

  outputElement.innerHTML = getFormattedElapsedTime();
  outputElement.className = 'paused';
  isStarted = false;
}

/**
 * Function that records the time in the recorded times area.
 */
function recordTime() {
  if (!isStarted) {
    return;
  }

  document.getElementById('recorded-times').innerHTML += getFormattedElapsedTime() + '<br />';
}

/**
 * Function that resets the state of the stopwatch.
 */
function resetTimer() {
  clearInterval(interval);
  startOffset = 0;
  isStarted = false;
  document.getElementById('recorded-times').innerHTML = '';

  const outputElement = document.getElementById('stopwatch-output');
  outputElement.innerHTML = '00:00';
  outputElement.className = '';
}

/**
 * Function used to set up the web application.
 */
function setUp() {
  document.addEventListener('keydown', (event) => {
    switch(event.key) {
      case 's':
        handleStartStop();
        break;

      case 't':
        recordTime();
        break;

      case 'r':
        resetTimer();
        break;
    }
  });

  document.getElementById('start-stop').addEventListener('click', handleStartStop);
  document.getElementById('record-time').addEventListener('click', recordTime);
  document.getElementById('reset').addEventListener('click', resetTimer);
}
