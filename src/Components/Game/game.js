import React, { useReducer, useEffect, useRef } from "react";
import "./game.css";
import KeyBoard from "../KeyBoard/keyboard";
import GameBoard from "../GameBoard/gameboard";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToggleButton from "react-toggle-button";
import { setCookie, getCookie } from "../../functionalities/cookies";

let noOfRows = 6,
	noOfCols = 5;
let initialBoard = {
	board: [...Array(noOfRows)].map((e) => [...Array(noOfCols)].map((ele) => "")),
	evaluation: [...Array(noOfRows)].map((e) => [...Array(noOfCols)].map((ele) => "")),
	currentCol: 0,
	currentRow: 0,
	isOver: false,
	isHardMode: getCookie("isHardMode") && getCookie("isHardMode") === "true",
};
let correctWord = "apple";
let keyData = [...Array(26)].map((_) => -1);
let correctLetters = [null, null, null, null, null];
let presentLetters = [];

const isValidKey = (key) => {
	return (/[a-zA-Z]/.test(key) && key.length === 1) || key === "Enter" || key === "Backspace";
};

let setVal = (arr, i, j, val) => {
	return arr.map((innerArray, x) => {
		if (x === i)
			return innerArray.map((item, y) => {
				if (y === j) return val;
				return item;
			});
		return innerArray;
	});
};

let getEvaluation = (guess, correct) => {
	//0 => not present => black
	//1 => present => yellow
	//2 => correct => green
	guess = guess.split("");
	return guess.map((ele, i) => {
		if (correct[i] === ele) {
			correct = correct.replace(ele, " ");
			return 2;
		} else if (correct.includes(ele)) {
			correct = correct.replace(ele, " ");
			return 1;
		} else return 0;
	});
};

let setKeyData = (guess, evaluation) => {
	guess = guess.split("");
	for (let i = 0; i < guess.length; i++) {
		const element = guess[i].charCodeAt(0) - "a".charCodeAt(0);
		if (keyData[element] === 2) continue;
		else if (keyData[element] === 0) continue;
		else {
			if (keyData[element] === 1 && evaluation[i] === 2) keyData[element] = 2;
			else if (keyData[element] === -1) keyData[element] = evaluation[i];
		}
	}
};

let isValidGuess = (guess, evaluation) => {
	// for hard mode
	let x = guess;
	for (let i = 0; i < noOfCols; i++) {
		if (correctLetters[i] && correctLetters[i] !== guess[i]) {
			let pos;
			switch (i) {
				case 0:
					pos = "1st";
					break;
				case 1:
					pos = "2nd";
					break;
				case 2:
					pos = "3rd";
					break;
				case 3:
					pos = "4th";
					break;
				default:
					pos = "5th";
			}
			return [false, `${pos} letter must be ${correctLetters[i]}`];
		} else x = x.replace(correctLetters[i], "");
		// else
	}

	if (presentLetters.length) {
		for (let i = 0; i < presentLetters.length; i++) {
			if (!x.split("").includes(presentLetters[i])) {
				return [false, `Guess must contain ${presentLetters[i]}`];
			} else {
				x = x.replace(presentLetters[i], "");
			}
		}
	}

	presentLetters = [];
	correctLetters = [];
	evaluation.forEach((element, i) => {
		if (element == 1) presentLetters.push(guess[i]);
		else if (element == 2) correctLetters[i] = guess[i];
	});
	console.log(presentLetters, correctLetters);

	return [true, ""];
};

const reducer = (state, action) => {
	switch (action.type) {
		case "Enter":
			if (action.currentCol !== noOfCols) {
				if (!toast.isActive("incomplete")) {
					toast("not a complete word", {
						toastId: "incomplete",
					});
				}
				// console.log("not a complete word");
				return state;
			} else {
				let enteredWord = action.board[action.currentRow].join("");
				console.log(`entered a word "${enteredWord}"`);

				let result = getEvaluation(enteredWord, correctWord);
				if (action.isHardMode) {
					let [isValid, message] = isValidGuess(enteredWord, result);
					console.log([isValid, message]);
					if (!isValid) {
						if (!toast.isActive("invalidGuess")) {
							toast(message, {
								toastId: "invalidGuess",
							});
						}
						return state;
					}
				}

				setKeyData(enteredWord, result);
				// console.log(result);
				action.evaluation.splice(action.currentRow, 1, result);
				if (result.every((val) => val === 2) || action.currentRow >= noOfRows - 1) {
					result.every((val) => val === 2)
						? toast("Hurray!!", {
								toastId: "success",
						  })
						: toast(`Word is "${correctWord}" `, {
								toastId: "loss",
						  });
					// console.log("game over");
					return {
						...state,
						evaluation: action.evaluation,
						currentCol: 0,
						currentRow: action.currentRow + 1,
						isOver: true,
					};
				}
				return {
					...state,
					evaluation: action.evaluation,
					currentCol: 0,
					currentRow: action.currentRow + 1,
				};
			}
		case "Backspace":
			if (action.currentCol === 0) {
				if (!toast.isActive("emptyWord")) {
					toast("Empty word", {
						toastId: "emptyWord",
					});
				}
				// console.log("empty word");
				return state;
			} else {
				return {
					...state,
					currentCol: action.currentCol - 1,
					board: setVal(state.board, action.currentRow, action.currentCol - 1, ""),
				};
			}
		case "key":
			if (action.currentCol === noOfCols) {
				if (!toast.isActive("alreadyFilled")) {
					toast("word already filled", {
						toastId: "alreadyFilled",
					});
				}
				// console.log("word already filled", action.currentCol);
				return state;
			} else {
				return {
					...state,
					currentCol: action.currentCol + 1,
					board: setVal(state.board, action.currentRow, action.currentCol, action.value),
				};
			}
		case "setHardMode":
			if (action.currentRow !== 0) {
				if (!toast.isActive("invalidHardSwitch")) {
					toast("You can only switch before the game", {
						toastId: "invalidHardSwitch",
					});
				}
				return state;
			}
			setCookie("isHardMode", !action.value, 20);
			return { ...state, isHardMode: !action.value };
		default:
			return state;
	}
};

export default function Game(props) {
	let [boardData, setBoard] = useReducer(reducer, initialBoard);
	let currentDataRef = useRef(boardData);

	let processKey = (key) => {
		if (!boardData.isOver) {
			if (key === "Enter" || key === "Backspace") setBoard({ type: key, ...currentDataRef.current });
			else setBoard({ type: "key", value: key, ...currentDataRef.current });
		}
	};
	let handleEvent = (e) => {
		if (e.key === "Enter") e.preventDefault();
		if (isValidKey(e.key)) processKey(e.key);
	};

	useEffect(() => {
		currentDataRef.current = boardData;
	}, [boardData]);

	useEffect(() => {
		if (boardData.isOver) {
			document.removeEventListener("keydown", handleEvent);
		} else {
			document.addEventListener("keydown", handleEvent);
		}
		return () => {
			document.removeEventListener("keydown", handleEvent);
		};
	}, [boardData.isOver]);

	return (
		<div id="Game">
			<div className="headerContainer">
				<header id="GameHead"> Wordle</header>
				<div id="hardModeContainer">
					<ToggleButton
						value={boardData.isHardMode}
						onToggle={(val) => {
							setBoard({ type: "setHardMode", value: val, ...currentDataRef.current });
						}}
						style={{ transform: "scale(0.5)" }}
					/>
					<label htmlFor="hard-mode-toggle" id="hardModeLabel">
						Hard mode
					</label>
				</div>
			</div>

			<div id="GameBoardContainer">
				<GameBoard noOfRows={noOfRows} noOfCols={noOfCols} boardData={boardData} />
			</div>
			<KeyBoard height={"27vh"} onKey={(key) => processKey(key)} isOver={boardData.isOver} keyData={keyData} />
			<ToastContainer
				position="top-center"
				autoClose={2000}
				hideProgressBar
				newestOnTop={false}
				closeOnClick={true}
				rtl={false}
				pauseOnFocusLoss
				draggable={false}
				pauseOnHover={false}
				transition={Slide}
				limit={3}
				closeButton={false}
			/>
		</div>
	);
}
