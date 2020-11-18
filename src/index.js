const savitzkyGolay = require('ml-savitzky-golay');

let options = {
  windowSize: 11,
  derivative: 0
};

let audio;

function start(URL) {
  // console.log(URL)
  audio = new Audio();
  audio.src = "http://127.0.0.1:8080/a37e83.mp3";
  // const audio = document.getElementById('audio');
  // audio.crossOrigin = "anonymous";

  const context = new(window.AudioContext || window.webkitAudioContext)();
  const analyser = context.createAnalyser();
  analyser.fftSize = 512;
  const source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  const canvas = document.getElementById('canvas');
  const canvas2 = document.getElementById('canvas2');
  const ctx = canvas.getContext("2d");
  const ctx2 = canvas2.getContext("2d");
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  let barWidth = WIDTH / bufferLength * 1.5;
  let barHeight;

  function renderFrame() {
    requestAnimationFrame(renderFrame);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (let i = 0, x = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];
      let r = barHeight + 25 * (i / bufferLength);
      let g = 250 * (i / bufferLength);
      let b = 50;
      ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
      x += barWidth + 2;
    }

    let dataArray2 = savitzkyGolay(dataArray, 1, options);
    ctx2.clearRect(0, 0, WIDTH, HEIGHT);
    for (let i = 0, x = 0; i < bufferLength; i++) {
      barHeight = dataArray2[i];
      let r = barHeight + 25 * (i / bufferLength);
      let g = 250 * (i / bufferLength);
      let b = 50;
      ctx2.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
      ctx2.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
      x += barWidth + 2;
    }
  }
  
  renderFrame();

}

document.getElementById('play').addEventListener('click', function() {
  start();
  audio.play();
});