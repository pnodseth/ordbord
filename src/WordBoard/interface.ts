export interface Config {
	tiles: number;
	rows: number;
	submitKey?: string;
	backKey?: string;
	solution?: string;
}

export interface BoardState {
	boardState: string[][];
	submitted: boolean[];
}

export interface RegisterEventsProps {
	onValidWord?: (result: LetterIndicator[], keyIndicators: KeyIndicator) => void;
	onInvalidWord?: () => void;
	onGameCompleted?: (correct: boolean, word: string) => void;
}

export interface KeyIndicator {
	[key: string]: LetterIndicator;
}

export type LetterIndicator = 'notPresent' | 'present' | 'correct';
