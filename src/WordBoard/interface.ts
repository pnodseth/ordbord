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
	onValidWord?: (result: LetterIndicator[]) => void;
	onInvalidWord?: () => void;
	onGameCompleted?: (correct: boolean) => void;
}

export type LetterIndicator = 'notPresent' | 'present' | 'correct';
