import { Link } from "react-router-dom";
import "./Home.css";

const games = [
    { name: "Sudoku", path: "/sudoku", image: "/sudoku.png" },
    { name: "2048", path: "/game2048", image: "/2048.png" },
    { name: "Pong", path: "/pong", image: "/pong.png" },
    { name: "Tic Tac Toe", path: "/tictactoe", image: "/tictactoe.png" },
];

function Home() {
    return (
        <div className="home">
            <h1 className="title">🎮 GameBox</h1>

            <div className="gridHome">
                {games.map((game) => (
                    <Link to={game.path} className="card" key={game.name}>
                        <img src={game.image} alt={game.name} />
                        <div className="card-title">{game.name}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Home;
