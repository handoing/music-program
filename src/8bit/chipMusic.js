import TUNING from "./tuning";

class ChipMusic {
  constructor({ bpm = 120, volume = 1 }) {
    this.bpm = bpm;
    this.t = 60 / bpm;
    this.per = this.t / 2;
    this.volume = volume;
    this.realIntervalTime = 0.001;
    this.effectorList = [];
    this.init();
  }
  init() {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    this.gainNode.gain.value = this.volume;
    this.analyser.fftSize = 512;
    var bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }
  createWaveForm(type, noteList) {
    const normalWaveFormTypeList = ["sine", "square", "sawtooth", "triangle"];
    let barIndex = -1;

    noteList.forEach(barList => {
      barList.forEach(note => {
        barIndex++;
        if (note === "-") {
          return;
        }
        const barList = note.split(" ");
        barList.forEach(note => {
          if (normalWaveFormTypeList.includes(type)) {
            return this.noteHandle(
              type,
              note,
              barIndex * this.per + this.realIntervalTime,
              this.per - this.realIntervalTime,
              this.gainNode
            );
          }
          if (type === "noise") {
            return this.noiseHandle(
              type,
              note,
              barIndex * this.per + this.realIntervalTime,
              this.per - this.realIntervalTime,
              this.gainNode
            );
          }
        });
      });
    });
  }
  noteHandle(type, note, time, duration, dest) {
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = TUNING[note];
    oscillator.connect(dest);
    this.effectorList.push({
      effector: oscillator,
      startTime: time,
      stopTime: time + duration
    });
    return oscillator;
  }
  noiseHandle(type, note, time, duration, dest) {
    const bufferSize = 2 * this.audioContext.sampleRate;
    const noiseBuffer = this.audioContext.createBuffer(
      1,
      bufferSize,
      this.audioContext.sampleRate
    );
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0.05;
    gainNode.connect(this.audioContext.destination);
    whiteNoise.connect(gainNode);
    this.effectorList.push({
      effector: whiteNoise,
      startTime: time,
      stopTime: time + duration
    });
    return whiteNoise;
  }
  onByteFrequencyData(callback) {
    const getByteFrequencyData = time => {
      requestAnimationFrame(getByteFrequencyData);
      this.analyser.getByteFrequencyData(this.dataArray);
      callback && callback(this.dataArray);
    };
    getByteFrequencyData();
  }
  getByteTimeDomainData(callback) {
    const getByteTimeDomainData = time => {
      requestAnimationFrame(getByteTimeDomainData);
      this.analyser.getByteTimeDomainData(this.dataArray);
      callback && callback(this.dataArray);
    };
    getByteTimeDomainData();
  }
  play() {
    this.effectorList.forEach(({ effector, startTime, stopTime }) => {
      effector.start(startTime);
      effector.stop(stopTime);
    });
  }
}

export default ChipMusic;
