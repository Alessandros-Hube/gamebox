import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home/home";
import Page1 from "./sudoku/sudoku";
import Page2 from "./game2048/game2048";
import Page3 from "./pong/pong";
import Page4 from "./tictactoe/tictactoe";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sudoku" element={<Page1 />} />
        <Route path="/game2048" element={<Page2 />} />
        <Route path="/pong" element={<Page3 />} />
        <Route path="/tictactoe" element={<Page4 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
