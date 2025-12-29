import { useEffect, useRef, useState } from "react";
import "./Pong.css";

function Pong() {
    const fieldRef = useRef(null);
    const ballRef = useRef(null);
    const leftRef = useRef(null);
    const rightRef = useRef(null);

    const keys = useRef({});
    const animationId = useRef(null);
    const started = useRef(false);

    const ball = useRef({ x: 294, y: 194, vx: 4, vy: 4 });
    const paddles = useRef({ left: 150, right: 150 });

    const [score, setScore] = useState({ left: 0, right: 0 });
    const [aiEnabled, setAiEnabled] = useState(false);


    const [isLandscape] = useState(window.innerWidth > window.innerHeight);


    /* ---------------- KEYBOARD ---------------- */

    useEffect(() => {
        const down = (e) => {
            keys.current[e.key] = true;

            if (["w", "s", "ArrowUp", "ArrowDown"].includes(e.key)) {
                started.current = true;
            }
        };

        const up = (e) => {
            keys.current[e.key] = false;
        };

        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);

        return () => {
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
        };
    }, []);

    /* ---------------- TOUCH ---------------- */

    useEffect(() => {
        const handleTouch = (e) => {
            if (!isLandscape) return;

            started.current = true;

            for (let touch of e.touches) {
                const x = touch.clientX;
                const y = touch.clientY - 50;

                if (x < window.innerWidth / 2) {
                    paddles.current.left = clamp(y);
                } else {
                    paddles.current.right = clamp(y);
                }
            }
        };

        window.addEventListener("touchstart", handleTouch, { passive: false });
        window.addEventListener("touchmove", handleTouch, { passive: false });

        return () => {
            window.removeEventListener("touchstart", handleTouch);
            window.removeEventListener("touchmove", handleTouch);
        };
    }, [isLandscape]);

    /* ---------------- GAME LOOP ---------------- */

    useEffect(() => {
        const loop = () => {
            update();
            animationId.current = requestAnimationFrame(loop);
        };

        animationId.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationId.current);
    }, [aiEnabled, isLandscape]);

    function update() {
        if (!isLandscape) return;

        // left player (W/S)
        if (keys.current["w"]) paddles.current.left -= 6;
        if (keys.current["s"]) paddles.current.left += 6;

        // right player or AI
        if (!aiEnabled) {
            if (keys.current["ArrowUp"]) paddles.current.right -= 6;
            if (keys.current["ArrowDown"]) paddles.current.right += 6;
        } else {
            paddles.current.right +=
                (ball.current.y - paddles.current.right - 40) * 0.05;
        }

        paddles.current.left = clamp(paddles.current.left);
        paddles.current.right = clamp(paddles.current.right);

        leftRef.current.style.top = paddles.current.left + "px";
        rightRef.current.style.top = paddles.current.right + "px";

        if (!started.current) return;

        // Ball
        ball.current.x += ball.current.vx;
        ball.current.y += ball.current.vy;

        // wall
        if (ball.current.y <= 0 || ball.current.y >= 388) {
            ball.current.vy *= -1;
        }

        // Paddle on the left
        if (
            ball.current.x <= 20 &&
            ball.current.y >= paddles.current.left &&
            ball.current.y <= paddles.current.left + 100
        ) {
            ball.current.vx *= -1;
        }

        // Paddle on the right
        if (
            ball.current.x >= 568 &&
            ball.current.y >= paddles.current.right &&
            ball.current.y <= paddles.current.right + 100
        ) {
            ball.current.vx *= -1;
        }

        // goal
        if (ball.current.x < 0) scorePoint("right");
        if (ball.current.x > 600) scorePoint("left");

        ballRef.current.style.left = ball.current.x + "px";
        ballRef.current.style.top = ball.current.y + "px";
    }

    function scorePoint(player) {
        setScore((s) => ({ ...s, [player]: s[player] + 1 }));
        resetBall();
        started.current = false;
    }

    function resetBall() {
        ball.current = {
            x: 294,
            y: 194,
            vx: Math.random() > 0.5 ? 4 : -4,
            vy: Math.random() > 0.5 ? 4 : -4,
        };
    }

    function clamp(y) {
        return Math.max(0, Math.min(300, y));
    }

    /* ---------------- RENDER ---------------- */

    return (
        <>
            <div className="pong-container">
                <h1>Pong</h1>

                <div className="score">
                    <span>{score.left}</span>
                    <span>:</span>
                    <span>{score.right}</span>
                </div>

                <div className="field" ref={fieldRef}>
                    <div className="paddle left" ref={leftRef} />
                    <div className="paddle right" ref={rightRef} />
                    <div className="ball" ref={ballRef} />
                </div>

                {!started.current && (
                    <p className="hint">Move to start</p>
                )}

                <button onClick={() => setAiEnabled((v) => !v)}>
                    KI: {aiEnabled ? "ON" : "OFF"}
                </button>

                <p>Keyboard: W/S & ↑/↓ · Mobile: Touch</p>
            </div>
        </>
    );
}

export default Pong;
