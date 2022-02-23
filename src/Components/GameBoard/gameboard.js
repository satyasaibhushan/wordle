import React, { useEffect } from "react";
import "./gameboard.css";

export default function GameBoard({ noOfRows, noOfCols,boardData }) {
	return (
		<div id="GameBoard">
			{boardData.board.map((row, i) => {
				return (
					<div
						key={i}
						className={i == boardData.currentRow ? "GameBoardRow currentRow" : "GameBoardRow"}
						style={{ gridTemplateColumns: `repeat(5,1fr)` }}
					>
						{[...boardData.board[i]].map((_, j) => {
							return (
								<div key={(i + 1) * 100 + j} className="GameBoardTile">
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
