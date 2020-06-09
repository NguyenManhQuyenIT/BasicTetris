document.addEventListener('DOMContentLoaded', () => {
  const width = 10;
  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const ScoreDisplay = document.querySelector('#score');
  const StartBtn = document.querySelector('#start-button');

  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 4;
  let currentRotation = 0;

  let random = Math.floor(Math.random() * theTetrominoes.length);

  //console.log(random)
  //console.log(Math.random())

  let current = theTetrominoes[random][currentRotation];

  //console.log(theTetrominoes[0][0]);
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      //console.log(current+index)
      //console.log(index)
      //console.log(currentPosition + index)
      //console.log(squares[currentPosition + index])
    })
  }

  function undraw() {
    current.forEach(index => squares[currentPosition + index].classList.remove('tetromino'))
  }

  timerId = setInterval(moveDown, 500);

  function control(e) {
    if (e.keyCode === 37) moveLeft();
    else if(e.keyCode === 38) rorate();
    else if(e.keyCode === 39) moveRight();
    else if(e.keyCode === 40) moveDown();
  }
  document.addEventListener('keyup', control);

  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'));
      random = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
    }
  }

  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if (!isAtLeftEdge) currentPosition -= 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1;
    }
    draw();
  }

  function moveRight(){
    undraw();
    const isAtRightEdge = current.some( index => (currentPosition+index) % width === width - 1);
    if(!isAtRightEdge) currentPosition +=1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1;
    }
    draw();
  }

  function rorate(){
    undraw();
    currentRotation++;
    if(currentRotation === current.length) currentRotation = 0;
    current = theTetrominoes[random][currentRotation];
    draw();
  }
})