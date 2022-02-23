import React, { useEffect } from "react";
import "./gameboard.css";

export default function GameBoard({ noOfRows, noOfCols, currentRow, boardData }) {
	return (
		<div id="GameBoard">
			{boardData.map((row, i) => {
				return (
					<div
						key={i}
						className={i == currentRow ? "GameBoardRow currentRow" : "GameBoardRow"}
						style={{ gridTemplateColumns: `repeat(5,1fr)` }}
					>
						{[...boardData[i]].map((_, j) => {
							return (
								<div key={(i + 1) * 100 + j} className="GameBoardTile">
									{boardData[i][j] ? boardData[i][j] : ""}
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
}
