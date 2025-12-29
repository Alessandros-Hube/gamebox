import { useEffect, useState } from "react";
import "./TicTacToe.css";

function TicTacToe() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [score, setScore] = useState({ X: 0, O: 0 });
    const [roundOver, setRoundOver] = useState(false);

    const result = calculateWinner(board);

    useEffect(() => {
        if (!isXNext && !result) {
            const move = getBestMove(board);
            if (move !== null) {
                setTimeout(() => {
                    makeMove(move);
                }, 400);
            }
        }
    }, [isXNext, board, result]);

    function makeMove(index) {
        if (board[index] || result) return;

        const newBoard = board.slice();
        newBoard[index] = isXNext ? "X" : "O";
        setBoard(newBoard);
        setIsXNext(!isXNext);
    }

    function handleClick(index) {
        if (!isXNext) return;
        makeMove(index);
    }

    function resetGame() {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setRoundOver(false);
    }

    useEffect(() => {
        if (result?.winner && !roundOver) {
            setScore((prev) => ({
                ...prev,
                [result.winner]: prev[result.winner] + 1,
            }));
            setRoundOver(true);
        }
    }, [result, roundOver]);

    function getStatusText() {
        if (result?.winner) return `winner: ${result.winner}`;
        if (result?.draw) return "tie!";
        return isXNext ? "Your move (X)" : "AI thinks...";
    }

    return (
        <div className="tictactoe">
            <h1>Tic Tac Toe</h1>

            <div className="score">
                <span>X: {score.X}</span>
                <span>O: {score.O}</span>
            </div>

            <div className="status">{getStatusText()}</div>

            <div className="board">
                {board.map((value, index) => (
                    <button
                        key={index}
                        className={`cell ${result?.line?.includes(index) ? "win" : ""
                            }`}
                        onClick={() => handleClick(index)}
                    >
                        {value}
                    </button>
                ))}
            </div>

            <button className="reset" onClick={resetGame}>
                New round
            </button>
        </div>
    );
}

function calculateWinner(board) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], line };
        }
    }

    if (board.every((cell) => cell !== null)) {
        return { draw: true };
    }

    return null;
}


function getBestMove(board) {
    // 1. winning streak
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            const test = board.slice();
            test[i] = "O";
            if (calculateWinner(test)?.winner === "O") return i;
        }
    }

    // 2. Block players
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            const test = board.slice();
            test[i] = "X";
            if (calculateWinner(test)?.winner === "X") return i;
        }
    }

    // 3. center
    if (!board[4]) return 4;

    // 4. First free cell
    return board.findIndex((cell) => cell === null);
}


export default TicTacToe;
