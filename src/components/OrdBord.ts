interface Config {
	tiles: number;
	rows: number;
}

interface ReturnData {
	disableInputs: boolean;
	updatedEntries: string[][];
	gameCompleted: boolean;
	rowCompleted: boolean;
	rowSubmitted: boolean;
}

export class OrdBord {
	numberOfTiles = 5;
	numberOfRows = 6;
	currentRowIdx = 0;
	currentTileIdx = 0;
	userEntries = [];
	gameCompleted = false;
	rowCompleted = false;

	constructor(config: Config) {
		this.numberOfTiles = config.tiles;
		this.numberOfRows = config.rows;

		this.setupBoard();
	}

	handleTap(key: string): ReturnData {
		const returnData = {
			disableInputs: false,
			updatedEntries: [],
			gameCompleted: false,
			rowCompleted: false,
			rowSubmitted: false
		};

		if (this.gameCompleted) {
			if (key === 'Enter') {
				this.submitWord();
				console.log('Thank you for playing!');

				returnData.disableInputs = true;
			}
		} else if (this.rowCompleted) {
			if (key === 'Enter') {
				this.submitWord();

				returnData.rowSubmitted = true;
				this.startNewRow();
			} else if (key == 'Back') {
				this.deleteLastLetter();
				this.rowCompleted = false;
			}
		} else {
			// Continue adding / removing letters
			if (this.isBackSpace(key) && this.isAllowedToBackSpace()) {
				this.deleteLastLetter();
			} else if (this.isAllowedKey(key)) {
				this.addInputToTile(key);

				this.updateGame();
			}
		}
		returnData.updatedEntries = this.userEntries;
		returnData.gameCompleted = this.gameCompleted;
		returnData.rowCompleted = this.rowCompleted;
		return returnData;
	}

	setupBoard(): void {
		for (let i = 0; i < this.numberOfRows; i++) {
			if (!this.userEntries[i]) {
				this.userEntries[i] = [];
			}
			for (let j = 0; j < this.numberOfTiles; j++) {
				if (this.userEntries[i][j]) {
					this.userEntries[i][j] = [];
				}
				this.userEntries[i][j] = '';
			}
		}
	}

	deleteLastLetter(): void {
		if (!this.rowCompleted) {
			this.currentTileIdx--;
		}
		this.addInputToTile('');
	}

	isBackSpace(key: string): boolean {
		return key == 'Back';
	}

	isAllowedToBackSpace(): boolean {
		// Check if we are not at the first letter
		return this.currentTileIdx != 0;
	}

	isAllowedKey(key: string): boolean {
		return !(key == 'Enter' || key == 'Back');
	}

	addInputToTile(letter: string): void {
		this.userEntries[this.currentRowIdx][this.currentTileIdx] = letter;
	}

	submitWord(): void {
		const submittedWord = this.userEntries[this.currentRowIdx];

		console.log('submitted: ', submittedWord.join(''));
	}

	isRowCompleted(): boolean {
		return this.currentTileIdx == this.numberOfTiles - 1;
	}

	isGameCompleted(): boolean {
		return (
			this.currentTileIdx == this.numberOfTiles - 1 && this.currentRowIdx == this.numberOfRows - 1
		);
	}

	startNewRow(): void {
		this.rowCompleted = false;
		this.currentRowIdx++;
		this.currentTileIdx = 0;
	}

	nextTile(): void {
		this.currentTileIdx++;
	}

	updateGame(): void {
		if (this.isGameCompleted()) {
			this.gameCompleted = true;
			console.log('Game is completed');
		} else if (this.isRowCompleted()) {
			console.log('Row is completed');
			this.rowCompleted = true;
		} else {
			console.log('next tile');
			this.nextTile();
		}
	}
}
