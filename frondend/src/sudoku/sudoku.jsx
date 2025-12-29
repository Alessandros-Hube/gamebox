import { useState, useEffect } from "react";
import "./Sudoku.css";

const initialBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

function Sudoku() {
    const [board, setBoard] = useState(initialBoard);
    const [selected, setSelected] = useState([-1, -1]);
    const [time, setTime] = useState(0);
    const [score, setScore] = useState(0);
    const [winner, setWinner] = useState(false);


    // Timer
    useEffect(() => {
        const timer = setInterval(() => setTime((t) => t + 1), 1000);
        return () => clearInterval(timer);
    }, []);


    useEffect(() => {
        if (checkWinner(board)) {
            setWinner(true);
        }
    }, [board]);


    const handleChange = (row, col, val) => {
        const num = parseInt(val);
        if (isNaN(num) || num < 1 || num > 9) return;

        const newBoard = board.map((r) => [...r]);
        newBoard[row][col] = num;
        setBoard(newBoard);

        if (isValidMove(newBoard, row, col, num)) {
            setScore((s) => s + 10);
        }
    };

    const handleSelect = (r, c) => {
        setSelected([r, c]);
    };

    const getCellClass = (r, c) => {
        const classes = ["cell-sudoku"];
        if (initialBoard[r][c] !== 0) classes.push("fixed");

        if (board[r][c] !== 0 && !isValidMove(board, r, c, board[r][c]))
            classes.push("error");

        const [selR, selC] = selected;
        if (
            selected[0] !== -1 &&
            board[r][c] !== 0 &&
            board[r][c] === board[selR][selC]
        )
            classes.push("highlight");

        const isBlockOdd =
            Math.floor(r / 3) % 2 !== Math.floor(c / 3) % 2;
        if (isBlockOdd) classes.push("block-odd");

        return classes.join(" ");
    };

    const restart = () => {
        setBoard(initialBoard);
        setScore(0);
        setTime(0);
        setSelected([-1, -1]);
    };

    const checkBoard = () => {
        const newBoard = board.map((r, rowIdx) =>
            r.map((cell, colIdx) => {
                if (
                    initialBoard[rowIdx][colIdx] === 0 &&
                    cell !== 0 &&
                    !isValidMove(board, rowIdx, colIdx, cell)
                ) {
                    return 0;
                }
                return cell;
            })
        );

        setBoard(newBoard);
    };

    const checkWinner = (board) => {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r][c] === 0 || !isValidMove(board, r, c, board[r][c])) {
                    return false;
                }
            }
        }
        return true;
    };

    return (
        <div className="sudoku-container">
            <h1>Sudoku</h1>
            <div className="info">
                <span>Score: {score}</span>
                <span>
                    Time: {Math.floor(time / 60)}:
                    {String(time % 60).padStart(2, "0")}
                </span>
            </div>

            <div className="sudoku-grid">
                {board.map((row, rIdx) =>
                    row.map((cell, cIdx) => (
                        <input
                            key={`${rIdx}-${cIdx}`}
                            className={getCellClass(rIdx, cIdx)}
                            value={cell || ""}
                            disabled={initialBoard[rIdx][cIdx] !== 0}
                            onChange={(e) => handleChange(rIdx, cIdx, e.target.value)}
                            onFocus={() => handleSelect(rIdx, cIdx)}
                        />
                    ))
                )}
            </div>

            <div>
                <button className="buttons" onClick={restart}>Restart</button>
                <button className="buttons" onClick={checkBoard}>Correction</button>
            </div>

            {winner && (
                <div className="winner-overlay">
                    <div className="winner-box">
                        <h2>🎉 Congratulations! 🎉</h2>
                        <p>You solved the Sudoku!</p>
                        <button onClick={() => {
                            setWinner(false);
                            restart();
                        }}>Restart</button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Sudoku;

function isValidMove(board, row, col, val) {
    // Check line
    for (let c = 0; c < 9; c++) {
        if (c !== col && board[row][c] === val) return false;
    }

    // Check row
    for (let r = 0; r < 9; r++) {
        if (r !== row && board[r][col] === val) return false;
    }

    // check 3x3 block
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if ((r !== row || c !== col) && board[r][c] === val) return false;
        }
    }

    return true;
}
