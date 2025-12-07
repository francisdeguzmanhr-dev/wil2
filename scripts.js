document.addEventListener('DOMContentLoaded', function () {

  const chips = Array.from(document.querySelectorAll(".chip"));
  const answerCells = Array.from(document.querySelectorAll(".answer-cell"));
  const submitBtn = document.getElementById("submitBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const questionDiv = document.querySelector(".question");

  const questions = [
    { q: "Sa walong usa ni Santa Claus, anong kulay ang ilong ni Rudolph?", a: "PULA" },
    { q: "Ano ang susunod na numero pagkatapos ng lima?", a: "ANIM" },
    { q: "Ano ang ibang paraan ng pagsulat ng “Christmas”?", a: "XMAS" },
    { q: "Ano ang kulay ng karagatan?", a: "ASUL" },
    { q: "Ano ang ginagamit ng tao upang makakita?", a: "MATA" }
  ];

  let remainingQuestions = [...questions]; // copy of questions for random selection
  let currentQuestion = null;

  // Show a random question
  function showRandomQuestion() {
    if (remainingQuestions.length === 0) {
      window.location.href = "2nd.html"
      remainingQuestions = [...questions]; // reset for replay
      return;
    }

    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    currentQuestion = remainingQuestions[randomIndex];
    remainingQuestions.splice(randomIndex, 1); // remove selected question to avoid repetition

    questionDiv.textContent = currentQuestion.q;

    // Clear previous answer
    answerCells.forEach(cell => {
      cell.textContent = "";
      cell.style.backgroundColor = "";
      cell.style.color = "";
    });
    chips.forEach(c => c.classList.remove('selected'));
  }

  showRandomQuestion();

  chips.forEach(c => c.setAttribute('type', 'button'));

  function parseColorToRgb(color) {
    if (!color) return { r: 255, g: 255, b: 255 };
    color = color.trim();

    if (color[0] === '#') {
      let hex = color.slice(1);
      if (hex.length === 3) hex = hex.split('').map(ch => ch + ch).join('');
      const int = parseInt(hex, 16);
      return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
    }

    const m = color.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
    if (m) return { r: +m[1], g: +m[2], b: +m[3] };

    return { r: 255, g: 255, b: 255 };
  }

  function readableTextColor(bgColor) {
    const { r, g, b } = parseColorToRgb(bgColor);
    const luminance = 0.2126*r + 0.7152*g + 0.0722*b;
    return luminance < 140 ? '#ffffff' : '#111827';
  }

  function getNextEmptyCell() {
    return answerCells.find(cell => cell.textContent.trim() === "");
  }

  function getLastFilledCell() {
    const filled = answerCells.filter(cell => cell.textContent.trim() !== "");
    return filled.length ? filled[filled.length - 1] : null;
  }

  chips.forEach(chip => {
    chip.addEventListener('click', function () {

      chips.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');

      const nextCell = getNextEmptyCell();
      if (!nextCell) return;

      const letter = this.textContent.trim();
      const color = this.dataset.color;

      nextCell.textContent = letter;
      nextCell.style.backgroundColor = color;
      nextCell.style.color = readableTextColor(color);
    });
  });

submitBtn.addEventListener('click', function () {
  const userAnswer = answerCells.map(cell => cell.textContent.trim()).join("");
  const correctAnswer = currentQuestion.a;

  // Create popup image element
  const img = document.createElement('img');
  img.style.position = 'fixed';
  img.style.top = '50%';
  img.style.left = '50%';
  img.style.transform = 'translate(-50%, -50%)';
  img.style.zIndex = 1000;
  img.style.width = '400px';
  img.style.height = '400px';
  img.style.borderRadius = '12px';
  img.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
  
  // Set image source based on answer
  if (userAnswer === correctAnswer) {
    img.src = 'Tama.jpg';
  } else {
    img.src = 'Mali.png';
  }

  document.body.appendChild(img);

  // Remove the image after 3 seconds
  setTimeout(() => {
    document.body.removeChild(img);
    // Show next random question
    showRandomQuestion();
  }, 3000);
});


  // DELETE button functionality
  deleteBtn.addEventListener('click', function () {
    const lastCell = getLastFilledCell();
    if (!lastCell) return;

    lastCell.textContent = "";
    lastCell.style.backgroundColor = "";
    lastCell.style.color = "";
  });

});
