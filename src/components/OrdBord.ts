interface Config {
	tiles: number;
	rows: number;
}

export class OrdBord {
	numberOfTiles = 5;
	numberOfRows = 6;

	currentRowIdx = 0;
	currentTileIdx = 0;
	entered = [];
	gameCompleted = false;
	rowCompleted = false;
	constructor(config: Config) {
		this.numberOfTiles = config.tiles;
		this.numberOfRows = config.rows;

		this.setupBoard();
	}

	setupBoard(): void {
		for (let i = 0; i < this.numberOfRows; i++) {
			if (!this.entered[i]) {
				this.entered[i] = [];
			}
			for (let j = 0; j < this.numberOfTiles; j++) {
				if (this.entered[i][j]) {
					this.entered[i][j] = [];
				}
				this.entered[i][j] = '';
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
		this.entered[this.currentRowIdx][this.currentTileIdx] = letter;
	}

	submitWord(): void {
		const submittedWord = this.entered[this.currentRowIdx];

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

	changeLayout(): void {
		this.numberOfTiles = 8;
		this.numberOfRows = 8;
		this.setupBoard();
	}
}
