import React, { useEffect, useRef } from "react";
import "./gameboard.css";

export let getClassName = (val) => {
	switch (val) {
		case 0:
			return "absent";
		case 1:
			return "present";
		case 2:
			return "correct";
		default:
			return "";
	}
};

export default function GameBoard({ noOfRows, noOfCols, boardData }) {
	const board = useRef(null);
	useEffect(() => {
		if (boardData.currentRow !== 0 && boardData.currentRow <= noOfRows) {
			for (let i = 0; i < boardData.board[0].length; i++) {
				let ele = board.current.children[boardData.currentRow - 1].children[i];
				setTimeout(() => {
					ele.classList.add("flipping");
					ele.classList.add(getClassName(boardData.evaluation[boardData.currentRow - 1][i]));
				}, i * 100);
				setTimeout(() => {
					ele.classList.remove("flipping");
				}, (i * 200)+1000);
			}
		}
	}, [boardData.currentRow]);
	return (
		<div id="GameBoard" ref={board}>
			{boardData.board.map((row, i) => {
				return (
					<div
						key={i}
						className={i === boardData.currentRow ? "GameBoardRow currentRow" : "GameBoardRow"}
						style={{ gridTemplateColumns: `repeat(5,1fr)` }}
					>
						{[...boardData.board[i]].map((_, j) => {
							return (
								<div key={(i + 1) * 100 + j} className={`GameBoardTile`}>
									{boardData.board[i][j] ? boardData.board[i][j] : ""}
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
}
