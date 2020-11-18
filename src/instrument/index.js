const { getWaveOscillator } = require("./utils.js");

document.getElementById("play").addEventListener("click", function() {
  const instrumentName = document.getElementById("input").value;
  play(instrumentName);
});

function play(instrumentName) {
  const ctx = new AudioContext();
  const osc = getWaveOscillator(ctx, instrumentName);
  osc.frequency.value = 60;
  osc.start(0);
  osc.stop(1);
  osc.connect(ctx.destination);
}
