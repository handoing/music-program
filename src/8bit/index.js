import ChipMusic from "./chipMusic";

var chipMusic = new ChipMusic({
  bpm: 200,
  volume: 0.2
});

chipMusic.createWaveForm("square", [
  ["E5 F#4", "E5 F#4", "-", "E5 F#4"],
  ["-", "C5 F#4", "E5 F#4", "-"],
  ["G5 B4 G4", "-", "-", "-"],
  ["G4", "-", "-", "-"],

  ["C5 E4", "-", "-", "G4 C4"],
  ["-", "-", "E4 G3", "-"],
  ["-", "A4 C4", "-", "B4 D4"],
  ["-", "Bb4 Db4", "A4 C4", "-"]
]);
chipMusic.createWaveForm("triangle", [
  ["D3", "D3", "-", "D3"],
  ["-", "D3", "D3", "-"],
  ["-", "-", "-", "-"],
  ["G3", "-", "-", "-"],

  ["G3", "-", "-", "E3"],
  ["-", "-", "C3", "-"],
  ["-", "F3", "-", "G3"],
  ["-", "Gb3", "F3", "-"]
]);

chipMusic.createWaveForm("noise", [
  ["-", "-", "-", "-"],
  ["-", "-", "-", "-"],
  ["-", "-", "-", "-"],
  ["-", "-", "-", "-"],

  ["*", "-", "*", "-"],
  ["-", "-", "*", "-"],
  ["*", "-", "*", "-"],
  ["-", "-", "*", "-"]
]);

function renderCanvas() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  chipMusic.onByteFrequencyData(function(dataArray) {
    const bufferLength = dataArray.length;
    let barWidth = (WIDTH / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 2;
      ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
      ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);
      x += barWidth + 1;
    }
  });
}

document.getElementById("play").addEventListener("click", function() {
  chipMusic.play();
  renderCanvas();
});
