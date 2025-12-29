import { useEffect, useRef, useState } from "react";
import "./Game2048.css";

const SIZE = 4;

function Game2048() {
    const [grid, setGrid] = useState(createStartGrid);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const touchStart = useRef({ x: 0, y: 0 });

    /* ---------- KEYBOARD ---------- */
    useEffect(() => {
        const handleKey = (e) => {
            const map = {
                ArrowUp: "up",
                ArrowDown: "down",
                ArrowLeft: "left",
                ArrowRight: "right",
                w: "up",
                s: "down",
                a: "left",
                d: "right",
            };

            if (map[e.key]) {
                e.preventDefault();
                move(map[e.key]);
            }
        };

        window.addEventListener("keydown", handleKey);

        return () => {
            window.removeEventListener("keydown", handleKey);
        };
    }, [grid, gameOver]);


    /* ---------- TOUCH / SWIPE ---------- */
    useEffect(() => {
        const start = (e) => {
            const t = e.touches[0];
            touchStart.current = { x: t.clientX, y: t.clientY };
        };

        const end = (e) => {
            const t = e.changedTouches[0];
            const dx = t.clientX - touchStart.current.x;
            const dy = t.clientY - touchStart.current.y;

            if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

            if (Math.abs(dx) > Math.abs(dy)) {
                move(dx > 0 ? "right" : "left");
            } else {
                move(dy > 0 ? "down" : "up");
            }
        };

        window.addEventListener("touchstart", start);
        window.addEventListener("touchend", end);

        return () => {
            window.removeEventListener("touchstart", start);
            window.removeEventListener("touchend", end);
        };
    });

    /* ---------- GAME LOGIC ---------- */
    function move(dir) {
        if (gameOver) return;

        let rotated = rotate(grid, dir);
        let moved = false;
        let gained = 0;

        rotated = rotated.map((row) => {
            const { row: newRow, score } = mergeRow(row);
            if (!arraysEqual(row, newRow)) moved = true;
            gained += score;
            return newRow;
        });

        if (!moved) return;

        let next = rotateBack(rotated, dir);
        next = addRandom(next);

        setGrid(next);
        setScore((s) => s + gained);

        if (isGameOver(next)) {
            setGameOver(true);
        }
    }

    function restart() {
        setGrid(createStartGrid());
        setScore(0);
        setGameOver(false);
    }

    /* ---------- RENDER ---------- */
    return (
        <div className="game2048">
            <h1>2048</h1>
            <div className="score">Score: {score}</div>

            <div className="grid">
                {grid.flat().map((value, i) => (
                    <div
                        key={i}
                        className={`tile tile-${value} ${value ? "pop" : ""}`}
                    >
                        {value || ""}
                    </div>
                ))}
            </div>

            <button onClick={restart}>Restart</button>

            {gameOver && (
                <div className="overlay">
                    <div className="overlay-box">
                        <h2>Game Over</h2>
                        <p>Score: {score}</p>
                        <button onClick={restart}>Restart</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Game2048;

/* ---------- HELPERS ---------- */

function createStartGrid() {
    let g = emptyGrid();
    g = addRandom(g);
    g = addRandom(g);
    return g;
}

function emptyGrid() {
    return Array(SIZE)
        .fill(null)
        .map(() => Array(SIZE).fill(0));
}

function addRandom(grid) {
    const empty = [];
    grid.forEach((r, i) =>
        r.forEach((c, j) => c === 0 && empty.push([i, j]))
    );
    if (!empty.length) return grid;

    const [x, y] = empty[Math.floor(Math.random() * empty.length)];
    grid[x][y] = Math.random() < 0.9 ? 2 : 4;
    return grid;
}

function mergeRow(row) {
    let arr = row.filter((n) => n);
    let score = 0;

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            score += arr[i];
            arr[i + 1] = 0;
        }
    }

    arr = arr.filter((n) => n);
    while (arr.length < SIZE) arr.push(0);

    return { row: arr, score };
}

function rotate(grid, dir) {
    switch (dir) {
        case "left":
            return grid;
        case "right":
            return grid.map((r) => [...r].reverse());
        case "up":
            return transpose(grid);
        case "down":
            return transpose(grid).map((r) => [...r].reverse());
        default:
            return grid;
    }
}

function rotateBack(grid, dir) {
    switch (dir) {
        case "left":
            return grid;
        case "right":
            return grid.map((r) => [...r].reverse());
        case "up":
            return transpose(grid);
        case "down":
            return transpose(grid.map((r) => [...r].reverse()));
        default:
            return grid;
    }
}

function transpose(grid) {
    return grid[0].map((_, i) => grid.map((row) => row[i]));
}


function arraysEqual(a, b) {
    return a.every((v, i) => v === b[i]);
}

function isGameOver(grid) {
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (grid[r][c] === 0) return false;
            if (grid[r][c] === grid[r]?.[c + 1]) return false;
            if (grid[r][c] === grid[r + 1]?.[c]) return false;
        }
    }
    return true;
}
