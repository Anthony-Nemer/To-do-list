import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Flowers.css";

function Flower({ number }) {
  return (
    <div className={`flower flower--${number}`}>
      <div className={`flower__leafs flower__leafs--${number}`}>
        <div className="flower__leaf flower__leaf--1"></div>
        <div className="flower__leaf flower__leaf--2"></div>
        <div className="flower__leaf flower__leaf--3"></div>
        <div className="flower__leaf flower__leaf--4"></div>
        <div className="flower__white-circle"></div>

        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`flower__light flower__light--${i + 1}`}
          ></div>
        ))}
      </div>

      <div className="flower__line">
        {Array.from({ length: number === 1 ? 6 : 4 }).map((_, i) => (
          <div
            key={i}
            className={`flower__line__leaf flower__line__leaf--${i + 1}`}
          ></div>
        ))}
      </div>
    </div>
  );
}

function GrassGroup() {
  return (
    <div className="growing-grass">
      <div className="flower__grass flower__grass--1">
        <div className="flower__grass--top"></div>
        <div className="flower__grass--bottom"></div>

        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`flower__grass__leaf flower__grass__leaf--${i + 1}`}
          ></div>
        ))}

        <div className="flower__grass__overlay"></div>
      </div>
    </div>
  );
}

function LongGrass({ number }) {
  return (
    <div className={`long-g long-g--${number}`}>
      {[0, 1, 2, 3].map((leaf, i) => (
        <div
          key={leaf}
          className="grow-ans"
          style={{ "--d": `${2.4 + i * 0.4}s` }}
        >
          <div className={`leaf leaf--${leaf}`}></div>
        </div>
      ))}
    </div>
  );
}

function Flowers() {
  const [loaded, setLoaded] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flowers-page ${loaded ? "loaded" : ""}`}>
      <div className="night"></div>

      <button className="focus-btn" onClick={() => nav("/")}>
        yalla back to focus
      </button>

      <div className="butterflies">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={`butterfly butterfly--${i + 1}`}>
            🦋
          </span>
        ))}
      </div>

      <div className="flowers-scene">
        <Flower number={1} />
        <Flower number={2} />
        <Flower number={3} />

        <div className="grow-ans" style={{ "--d": "1.2s" }}>
          <div className="flower__g-long">
            <div className="flower__g-long__top"></div>
            <div className="flower__g-long__bottom"></div>
          </div>
        </div>

        <GrassGroup />

        {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
          <LongGrass key={n} number={n} />
        ))}
      </div>

      <h1 className="title">ba2ousi, I love you ❤️</h1>
    </div>
  );
}

export default Flowers;