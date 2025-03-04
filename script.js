const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color');
const brushSize = document.getElementById('size');
const eraserButton = document.getElementById('eraser');
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');
const clearButton = document.getElementById('clear');

let painting = false;
let history = [];
let historyIndex = -1;

// Set canvas size
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.6;

// Save current canvas state to history
function saveState() {
  historyIndex++;
  history = history.slice(0, historyIndex); // Remove redo history
  history.push(canvas.toDataURL());
}

// Undo last action
function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    const img = new Image();
    img.src = history[historyIndex];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }
}

// Redo last undone action
function redo() {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    const img = new Image();
    img.src = history[historyIndex];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }
}

// Start drawing
function startPosition(e) {
  painting = true;
  draw(e);
  saveState();
}

// End drawing
function endPosition() {
  painting = false;
  ctx.beginPath();
}

// Draw on canvas
function draw(e) {
  if (!painting) return;

  ctx.lineWidth = brushSize.value;
  ctx.lineCap = 'round';

  // Check if eraser is active
  if (eraserButton.classList.contains('active')) {
    ctx.strokeStyle = '#ffffff'; // White color for eraser
  } else {
    ctx.strokeStyle = colorPicker.value;
  }

  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

// Clear canvas
clearButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  saveState();
});

// Toggle eraser
eraserButton.addEventListener('click', () => {
  eraserButton.classList.toggle('active');
});

// Undo functionality
undoButton.addEventListener('click', undo);

// Redo functionality
redoButton.addEventListener('click', redo);

// Event listeners
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

// Save initial blank canvas state
saveState();