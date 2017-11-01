var boxes = [];

for(i = 0; i < 930; i++) {
  hex_color = '';
  for(j = 0; j < 6; j++) {hex_color += Math.floor(Math.random()*16).toString(16);}
  console.log(hex_color);
  var box = document.createElement('div');
  box.className = "box";
  box.style.backgroundColor = '#'+hex_color;
  document.getElementById('boxes').appendChild(box);
  boxes.push(box);
}


var tracks = ["Final_Fantasy_6_Magicite_Made_My_Mind_Melt_OC_ReMix.mp3"];

var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
var audio = document.getElementById('audio');
var audioSrc = audioCtx.createMediaElementSource(audio);
audioSrc.connect(analyser);
audioSrc.connect(audioCtx.destination);

analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);

// Get a canvas defined with ID "oscilloscope"
var canvas = document.getElementById("oscilloscope");
var canvasCtx = canvas.getContext("2d");

// draw an oscilloscope of the current audio source

function draw() {

  drawVisual = requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.fillStyle = 'rgb(200, 200, 200)';
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

  canvasCtx.beginPath();

  var sliceWidth = canvas.width * 1.0 / bufferLength;
  var x = 0;

  for (var i = 0; i < bufferLength; i++) {

    var v = dataArray[i] / 128.0;
    var y = v * canvas.height / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    if (i % analyser.frequencyBinCount == 0) {
      for (var j = 0; j < boxes.length; ++j) {
        boxes[j].style.backgroundColor = "rgb(" + (x % 256) + ", " + (y % 256) + ", " + (j % 256) + ")";
      }
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
};

draw();
