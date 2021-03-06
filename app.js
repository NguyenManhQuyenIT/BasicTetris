document.addEventListener('DOMContentLoaded', () => {
    const width = 10;
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const endGame = document.querySelector('#endGame');
    const startBtn = document.querySelector('#start-button');
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const colors = ['#f67575', '#a8d3da', '#116979', '#ffa372', '#fff591']

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

    let currentPosition = 4; // vị trí khi xuất tetromino 4/10
    let currentRotation = 0; // vị trí xoay tetromino, tổng 4 hình thái xoay

    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation]; // lấy ra tetromino bất kỳ trong Array theTetrominoes với kiểu hình dạng mặc định 0

    function draw() {
        current.forEach(index => {
                squares[currentPosition + index].classList.add('tetromino')
                squares[currentPosition + index].style.backgroundColor = colors[random]
            })
            // currentPosition + index: vị trí mà tetromino được xuất ra
            // trong Array squares (200 div), tại vị trí mà tetromino được xuất ra, ta add class='tetromino' vào nó
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    function control(e) {
        if (e.keyCode === 37) moveLeft();
        else if (e.keyCode === 38) rorate();
        else if (e.keyCode === 39) moveRight();
        else if (e.keyCode === 40) moveDown();
        // tham khảo keyCode trên https://keycode.info/
    }
    document.addEventListener('keyup', control);

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
        gameOver();

    }

    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) { // kiểm tra xem tại ô tiếp theo của tetromino có thuộc lớp taken ?
            current.forEach(index => squares[currentPosition + index].classList.add('taken')); // nếu đúng thì add ô vị trí hiện tại class = 'taken'
            //các lớp taken sẽ bị đẩy lên
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
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

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    function rorate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) currentRotation = 0;
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4;
    let displayIndex = 0;

    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
        [1, displayWidth, displayWidth + 1, displayWidth + 2],
        [0, 1, displayWidth, displayWidth + 1],
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
    ]

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 300)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
        }
    })

    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            endGame.innerHTML = 'END GAME'
            clearInterval(timerId)
        }
    }
})