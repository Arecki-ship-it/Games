document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const winMessageElement = document.getElementById('winMessage');

    const tileSize = 40; // Rozmiar każdej komórki w pikselach

    // Definicja labiryntu:
    // 0 = ścieżka
    // 1 = ściana
    // 2 = start
    // 3 = koniec
    const mazeLayout = [
        [2, 0, 1, 1, 1, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 1, 1],
        [1, 1, 0, 1, 1, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 0, 0, 3],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 1]
    ];

    canvas.width = mazeLayout[0].length * tileSize;
    canvas.height = mazeLayout.length * tileSize;

    let player;
    let gameWon = false;

    class Player {
        constructor(gridX, gridY, size, color) {
            this.gridX = gridX; // Pozycja X na siatce
            this.gridY = gridY; // Pozycja Y na siatce
            this.size = size;
            this.color = color;
        }

        draw(context) {
            context.fillStyle = this.color;
            const offset = this.size * 0.15; // Mały margines dla lepszej widoczności
            context.fillRect(
                this.gridX * this.size + offset,
                this.gridY * this.size + offset,
                this.size - offset * 2,
                this.size - offset * 2
            );
        }

        move(dx, dy, maze) {
            if (gameWon) return false;

            const newX = this.gridX + dx;
            const newY = this.gridY + dy;

            // Sprawdzenie granic labiryntu
            if (newX < 0 || newX >= maze[0].length || newY < 0 || newY >= maze.length) {
                return false; // Poza granicami
            }

            // Sprawdzenie kolizji ze ścianą
            if (maze[newY][newX] === 1) {
                return false; // Uderzenie w ścianę
            }

            // Aktualizacja pozycji gracza
            this.gridX = newX;
            this.gridY = newY;

            // Sprawdzenie warunku wygranej
            if (maze[this.gridY][this.gridX] === 3) {
                gameWon = true;
                winMessageElement.textContent = 'Gratulacje! Dotarłeś do celu! Naciśnij R, aby zagrać ponownie.';
            }
            return true;
        }
    }

    function findTile(tileType) {
        for (let y = 0; y < mazeLayout.length; y++) {
            for (let x = 0; x < mazeLayout[y].length; x++) {
                if (mazeLayout[y][x] === tileType) {
                    return { x: x, y: y };
                }
            }
        }
        return null; // Nie znaleziono kafelka
    }

    function initGame() {
        gameWon = false;
        winMessageElement.textContent = '';
        const startPos = findTile(2);
        if (!startPos) {
            console.error("Nie znaleziono pozycji startowej (2) w labiryncie!");
            // Domyślna pozycja, jeśli brakuje startu
            player = new Player(0, 0, tileSize, 'rgba(0, 100, 255, 0.9)');
        } else {
            player = new Player(startPos.x, startPos.y, tileSize, 'rgba(0, 100, 255, 0.9)');
        }
        renderGame();
    }

    function drawMaze(context) {
        for (let y = 0; y < mazeLayout.length; y++) {
            for (let x = 0; x < mazeLayout[y].length; x++) {
                const tileX = x * tileSize;
                const tileY = y * tileSize;

                switch (mazeLayout[y][x]) {
                    case 0: // Ścieżka
                        context.fillStyle = '#f0f0f0'; // Jasnoszary
                        break;
                    case 1: // Ściana
                        context.fillStyle = '#333';    // Ciemnoszary
                        break;
                    case 2: // Start
                        context.fillStyle = 'lightgreen';
                        break;
                    case 3: // Koniec
                        context.fillStyle = 'gold';
                        break;
                }
                context.fillRect(tileX, tileY, tileSize, tileSize);

                // Opcjonalne linie siatki dla lepszej widoczności
                context.strokeStyle = '#ddd';
                context.strokeRect(tileX, tileY, tileSize, tileSize);
            }
        }
    }

    function renderGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Wyczyść canvas
        drawMaze(ctx);
        if (player) {
            player.draw(ctx);
        }
    }

    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();

        if (gameWon && key === 'r') {
            initGame();
            return;
        }

        if (!player || gameWon) return; // Nie ruszaj się, jeśli nie ma gracza lub gra wygrana

        let moved = false;
        switch (key) {
            case 'w':
            case 'arrowup':
                moved = player.move(0, -1, mazeLayout);
                break;
            case 's':
            case 'arrowdown':
                moved = player.move(0, 1, mazeLayout);
                break;
            case 'a':
            case 'arrowleft':
                moved = player.move(-1, 0, mazeLayout);
                break;
            case 'd':
            case 'arrowright':
                moved = player.move(1, 0, mazeLayout);
                break;
        }

        if (moved || gameWon) {
            renderGame();
        }
    });

    // Rozpocznij grę
    initGame();
});