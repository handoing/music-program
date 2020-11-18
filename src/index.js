const savitzkyGolay = require('ml-savitzky-golay');

const audio = new Audio();
let context, source, analyser;

document.getElementById('load').addEventListener('click', function(e) {
  context = new AudioContext();
  source = context.createMediaElementSource(audio);
  analyser = context.createAnalyser();

  source.connect(analyser);
  analyser.connect(context.destination);

  audio.src = "http://127.0.0.1:8080/a37e83.mp3";
  audio.addEventListener("canplay", function() {
    e.target.innerText = 'loaded';
  });
});

document.getElementById('play').addEventListener('click', function() {
  audio.play();

  analyser.fftSize = 512;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext("2d");
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
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
      x += barWidth + 2;
    }
  }
  
  renderFrame();

});

document.getElementById('smooth').addEventListener('click', function() {
  audio.play();
  
  analyser.fftSize = 512;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const canvas = document.getElementById('canvas2');
  const ctx = canvas.getContext("2d");
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  let barWidth = WIDTH / bufferLength * 1.5;
  let barHeight;

  function renderFrame() {
    requestAnimationFrame(renderFrame);
    analyser.getByteFrequencyData(dataArray);

    const smoothDataArray = savitzkyGolay(dataArray, 1, {
      windowSize: 11,
      derivative: 0
    });

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (let i = 0, x = 0; i < bufferLength; i++) {
      barHeight = smoothDataArray[i];
      let r = barHeight + 25 * (i / bufferLength);
      let g = 250 * (i / bufferLength);
      let b = 50;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
      x += barWidth + 2;
    }
  }
  
  renderFrame();

});
