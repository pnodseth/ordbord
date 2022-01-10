import type { BoardState, Config, LetterIndicator, RegisterEventsProps } from './interface';

export class WordBoard {
	private numberOfTiles = 5;
	private numberOfRows = 6;
	private currentRowIdx = 0;
	private currentTileIdx = 0;
	private boardState: BoardState = { boardState: [], submitted: [] };
	private solutionWord = '';
	private gameEnded = false;
	SUBMIT_KEY = 'Enter';
	BACKSPACE_KEY = 'Backspace';

	private onInvalidWord: () => void = () =>
		console.log('Not implemented. Register onInvalidWord handler with add registerEvents method');
	private onValidWord: (result: LetterIndicator[]) => void = () =>
		console.log('not implemented.Register onValidWord handler with add registerEvents method');
	private onGameCompleted: (correct: boolean) => void = () =>
		console.log(
			'not implemented.Register onGameCompleted event handler with add registerEvents method'
		);

	constructor(config: Config) {
		this.numberOfTiles = config.tiles;
		this.numberOfRows = config.rows;
		if (config.submitKey) this.SUBMIT_KEY = config.submitKey;
		if (config.backKey) this.BACKSPACE_KEY = config.backKey;
		this.solutionWord = config.solution;

		if (config.solution.length !== config.tiles) {
			throw Error('Solution word must have same amount of characters as config.');
		}

		this.setupBoard();
	}

	registerEvents(obj: RegisterEventsProps): void {
		if (typeof obj.onValidWord === 'function') {
			this.onValidWord = obj.onValidWord;
		}
		if (typeof obj.onInvalidWord === 'function') {
			this.onInvalidWord = obj.onInvalidWord;
		}
		if (typeof obj.onGameCompleted === 'function') {
			this.onGameCompleted = obj.onGameCompleted;
		}
	}

	addLetter(key: string): BoardState | undefined {
		if (!this.isAllowedKey(key)) {
			return;
		}
		if (this.gameEnded) {
			return;

			// Game Completed
		} else if (this.isGameCompleted()) {
			if (key === 'Enter') {
				this.submitWord();
				const indicators = this.getIndicatorsForCurrentRow();
				this.onValidWord(indicators);
				this.onGameCompleted(WordBoard.isCorrectAnswer(indicators));
				this.gameEnded = true;
			}
		} else if (this.isRowCompleted()) {
			if (key === 'Enter') {
				const word = this.boardState.boardState[this.currentRowIdx].join('');
				const isValid = this.checkValidWord(word);

				if (isValid) {
					this.submitWord();
					const indicators = this.getIndicatorsForCurrentRow();

					this.onValidWord(indicators);

					if (WordBoard.isCorrectAnswer(indicators)) {
						this.onGameCompleted(WordBoard.isCorrectAnswer(indicators));
						this.gameEnded = true;
					}
				} else {
					this.onInvalidWord();
				}
				this.startNewRow();
			} else if (key == this.BACKSPACE_KEY) {
				console.log('hi');
				this.deleteLastLetter();
			}
		} else {
			// Continue adding / removing letters
			if (key === this.BACKSPACE_KEY && this.isAllowedToBackSpace()) {
				this.deleteLastLetter();
			} else if (this.isInputKey(key)) {
				this.addInputToTile(key);

				this.updateGame();
			}
		}

		return this.boardState;
	}

	private static isCorrectAnswer(indicators: LetterIndicator[]) {
		return !indicators.includes('present') && !indicators.includes('notPresent');
	}

	private setupBoard(): void {
		for (let i = 0; i < this.numberOfRows; i++) {
			if (!this.boardState.boardState[i]) {
				this.boardState.boardState[i] = [];
			}
			for (let j = 0; j < this.numberOfTiles; j++) {
				if (!this.boardState.boardState[i][j]) {
					this.boardState.boardState[i][j] = '';
				}
				this.boardState.boardState[i][j] = '';
			}
		}

		// Set initial submit checks
		for (let i = 0; i < this.numberOfTiles; i++) {
			this.boardState.submitted[i] = false;
		}
	}

	private deleteLastLetter(): void {
		this.currentTileIdx--;
		this.addInputToTile('');
	}

	private isAllowedToBackSpace(): boolean {
		// Check if we are not at the first letter
		return this.currentTileIdx != 0;
	}

	private isInputKey(key) {
		return this.getInputKeys().includes(key);
	}

	private getInputKeys() {
		const norwegian = ['æ', 'ø', 'å'];
		const english = [
			'q',
			'w',
			'e',
			'r',
			't',
			'y',
			'u',
			'i',
			'o',
			'p',
			'a',
			's',
			'd',
			'f',
			'g',
			'h',
			'j',
			'k',
			'l',
			'z',
			'x',
			'c',
			'v',
			'b',
			'n',
			'm'
		];
		return [...norwegian, ...english];
	}

	private isAllowedKey(key: string): boolean {
		const actions = ['enter', 'backspace'];
		const norwegian = ['æ', 'ø', 'å'];
		const english = [
			'q',
			'w',
			'e',
			'r',
			't',
			'y',
			'u',
			'i',
			'o',
			'p',
			'a',
			's',
			'd',
			'f',
			'g',
			'h',
			'j',
			'k',
			'l',
			'z',
			'x',
			'c',
			'v',
			'b',
			'n',
			'm'
		];
		return [...norwegian, ...actions, ...english].includes(key.toLowerCase());
	}

	private addInputToTile(letter: string): void {
		this.boardState.boardState[this.currentRowIdx][this.currentTileIdx] = letter;
	}

	private submitWord(): void {
		this.boardState.submitted[this.currentRowIdx] = true;
	}

	private isRowCompleted(): boolean {
		return this.currentTileIdx == this.numberOfTiles;
	}

	private isGameCompleted(): boolean {
		return (
			this.currentTileIdx == this.numberOfTiles - 1 && this.currentRowIdx == this.numberOfRows - 1
		);
	}

	private startNewRow(): void {
		this.currentRowIdx++;
		this.currentTileIdx = 0;
	}

	private nextTile(): void {
		this.currentTileIdx++;
	}

	private updateGame(): void {
		if (!this.isRowCompleted()) {
			this.nextTile();
		}
	}

	private checkValidWord(word: string) {
		return true;
	}

	private getIndicatorsForCurrentRow(): LetterIndicator[] {
		const letterArr = this.boardState.boardState[this.currentRowIdx];

		const result: LetterIndicator[] = [];

		for (let i = 0; i < letterArr.length; i++) {
			const char = letterArr[i];

			if (char === this.solutionWord[i]) {
				result.push('correct');
			} else if (this.solutionWord.includes(char)) {
				result.push('present');
			} else {
				result.push('notPresent');
			}
		}
		return result;
	}

	getBoardState(): BoardState {
		return this.boardState;
	}
}
