import React from "react";
import "./keyboard.css";
import { getClassName } from "../GameBoard/gameboard";

let alphabets = [
	["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], //10
	[0.5, "a", "s", "d", "f", "g", "h", "j", "k", "l", 0.5], // 1/2 + 9 + 1/2
	[1.5, "z", "x", "c", "v", "b", "n", "m", 1.5], // 1&1/2 + 7 + 1&1/2
];

export default function KeyBoard({ height, onKey, isOver, keyData }) {
	return (
		<div id="GameKeyBoardContainer" style={{ height: height }}>
			{alphabets.map((ele, i) => {
				return (
					<div key={i} className="KeyBoardRow">
						{ele.map((letter, j) => {
							if (letter === 0.5) return <div key={10 * (i + 1) + j} className="KeyBoardHalfSpaces"></div>;
							else if (letter === 1.5)
								return (
									<button
										key={10 * (i + 1) + j}
										onClick={() => {
											onKey(j === 0 ? "Enter" : "Backspace");
										}}
										className="KeyBoardOneAndHalfSpaces"
									>
										{j === 0 ? "enter" : "del"}
									</button>
								);
							else
								return (
									<button
										onClick={() => {
											if (!isOver) onKey(letter);
										}}
										key={10 * (i + 1) + j}
										className={`KeyBoardKeys ${
											keyData === -1 ? "" : getClassName(keyData[letter.charCodeAt(0) - "a".charCodeAt(0)])
										}`}
									>
										{letter.toUpperCase()}
									</button>
								);
						})}
					</div>
				);
			})}
		</div>
	);
}
