const instruments = require("@mohayonao/wave-tables");

function getPeriodicWave(ctx, name) {
  const instrument_obj = instruments[name];
  const wave = ctx.createPeriodicWave(
    Float32Array.from(instrument_obj.real),
    Float32Array.from(instrument_obj.imag)
  );
  return wave;
}

function getWaveOscillator(ctx, name) {
  const oscillator = ctx.createOscillator();
  const wave = getPeriodicWave(ctx, name);
  oscillator.setPeriodicWave(wave);
  return oscillator;
}

module.exports.getWaveOscillator = getWaveOscillator;
