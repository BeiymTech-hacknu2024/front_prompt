import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const generateRandomCharacter = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  // const characters = "FUCKYOU";
  return characters.charAt(Math.floor(Math.random() * characters.length));
};

const replaceStringCharWith1 = (indI, indJ, visible) => {
  const orig = visible[indI];
  const modif = orig.slice(0, indJ) + "1" + orig.slice(indJ + 1);

  return modif;
};

const numRows = 8;
const numCols = 42;

export const NotFound = () => {
  const navigate = useNavigate();

  const timeOut = 4000;
  const [show, setShow] = useState(false);
  const [randomChars, setRandomChars] = useState([]);

  let visible = [
    "0000    0000    0000000000    0000    0000",
    "0000    0000    000    000    0000    0000",
    "0000    0000    000    000    0000    0000",
    "0000    0000    000    000    0000    0000",
    "000000000000    000    000    000000000000",
    "        0000    000    000            0000",
    "        0000    000    000            0000",
    "        0000    0000000000            0000",
  ];

  const arr = [
    "####    ####    ##########    ####    ####",
    "####    ####    ###    ###    ####    ####",
    "####    ####    ###    ###    ####    ####",
    "####    ####    ###    ###    ####    ####",
    "############    ###    ###    ############",
    "        ####    ###    ###            ####",
    "        ####    ###    ###            ####",
    "        ####    ##########            ####",
  ];

  const prev = Array.from({ length: numRows }, () => Array(numCols).fill(" "));
  console.log(prev);

  useEffect(() => {
    let i = 0,
      j = 0,
      animEnded = false,
      charGen = 0;

    setTimeout(() => setShow(true), timeOut);
    const interval = setInterval(() => {
      if (i >= 8) animEnded = true;

      if (!animEnded) {
        // visible[i][j] = visible[i][j] === "0" ? "1" : visible[i][j];
        if (visible[i][j] === "0") {
          visible[i] = replaceStringCharWith1(i, j, visible);
        }
      }
      if (j === 41) {
        i++;
        j = 0;
      } else j++;

      charGen = (charGen + 1) % 2;

      const newRandomChars = arr.map((line, indI) =>
        line
          .split("")
          .map((char, indJ) =>
            char === " "
              ? char
              : visible[indI][indJ] === "1"
              ? charGen === 1
                ? (prev[indI][indJ] = generateRandomCharacter())
                : prev[indI][indJ]
              : " "
          )
          .join("")
      );
      setRandomChars(newRandomChars);
    }, 10);

    return () => clearInterval(interval);
  }, []);

  const handlePClick = () => {
    navigate("/");
  };

  return (
    <div className="NotFound">
      <svg width={355} height={175}>
        {randomChars.map((elem, ind) => (
          <text key={ind} x="10" y={`${19 * (ind + 1)}`} xmlSpace="preserve">
            {elem}
          </text>
        ))}
      </svg>
      <p
        style={{
          opacity: show ? "1" : "0",
          marginBottom: show ? "-50px" : "",
        }}
        onClick={handlePClick}
      >
        go to home
      </p>
    </div>
  );
};
