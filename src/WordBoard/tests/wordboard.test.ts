import { WordBoard } from '../WordBoard';

test('Initial boardstate to be empty strings', () => {
	const wordLength = 5;
	const rows = 6;
	const board = new WordBoard({ rows, solution: 'jiras', tiles: wordLength });

	const expected: string[][] = [];
	for (let i = 0; i < rows; i++) {
		const row = Array.from({ length: wordLength }, () => '');
		expected.push(row);
	}
	const { boardState } = board.getBoardState();
	expect(boardState).toEqual(expected);
});

test('Initial board state to have false submit checks', () => {
	const wordLength = 7;
	const board = new WordBoard({ rows: 6, solution: 'jirasas', tiles: wordLength });

	const { submitted } = board.getBoardState();
	const expected = Array.from({ length: wordLength }, () => false);
	expect(submitted).toEqual(expected);
});

test('Adding q as first letter produces new board state', () => {
	const board = new WordBoard({ rows: 6, solution: 'jirar', tiles: 5 });
	board.addLetter('q');
	const expected = [
		['q', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', '']
	];

	const { boardState } = board.getBoardState();
	expect(boardState).toEqual(expected);
});

test('Expect board to fill up with letters in all tiles', () => {
	const wordLength = 5;
	const rows = 6;

	const board = new WordBoard({ rows, solution: 'jiras', tiles: wordLength });
	const expected = [];

	const word = 'grine';
	for (let i = 0; i < rows; i++) {
		const arr = [];
		for (let j = 0; j < wordLength; j++) {
			arr.push(word[j]);
			board.addLetter(word[j]);
		}
		board.addLetter('Enter');
		expected.push(arr);
	}

	const { boardState } = board.getBoardState();
	expect(boardState).toEqual(expected);
});

test('Enter should be disabled until end of row', () => {
	const wordLength = 5;
	const rows = 6;
	const board = new WordBoard({ rows, solution: 'jiras', tiles: wordLength });

	board.addLetter('q');
	board.addLetter('Enter');

	const { boardState } = board.getBoardState();

	const expected = [
		['q', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', '']
	];

	expect(boardState).toEqual(expected);
});

test('Back should remove previously added letter', () => {
	const wordLength = 5;
	const rows = 6;
	const board = new WordBoard({ rows, solution: 'jiras', tiles: wordLength });

	board.addLetter('q');
	board.addLetter('Backspace');
	const { boardState } = board.getBoardState();

	const expected = [
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', '']
	];

	expect(boardState).toEqual(expected);
});

test('Back should remove previously added letter when entered full row', () => {
	const wordLength = 5;
	const rows = 6;
	const board = new WordBoard({ rows, solution: 'jiras', tiles: wordLength });

	board.addLetter('p');
	board.addLetter('h');
	board.addLetter('a');
	board.addLetter('r');
	board.addLetter('s');
	board.addLetter('Backspace');
	const { boardState } = board.getBoardState();

	const expected = [
		['p', 'h', 'a', 'r', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', '']
	];

	expect(boardState).toEqual(expected);
});

test('Expect first row to have submitted state after row complete', () => {
	const wordLength = 5;
	const rows = 6;
	const board = new WordBoard({ rows, solution: 'jiras', tiles: wordLength });

	board.addLetter('g');
	board.addLetter('r');
	board.addLetter('å');
	board.addLetter('t');
	board.addLetter('e');
	board.addLetter('Enter');

	const { submitted } = board.getBoardState();

	const expected = [true, false, false, false, false];
	expect(submitted).toEqual(expected);
});

test('Expect onValidWord event to be triggered after row complete', () => {
	const wordLength = 5;
	const rows = 6;
	const expected = 'it works!';
	let eventString = '';

	const board = new WordBoard({ rows, solution: 'gråte', tiles: wordLength });

	board.registerEvents({
		onValidWord: () => (eventString = expected)
	});

	board.addLetter('g');
	board.addLetter('r');
	board.addLetter('å');
	board.addLetter('t');
	board.addLetter('e');
	board.addLetter('Enter');
	expect(eventString).toBe(expected);
});

test('Expect onGameCompleted event to be triggered after row complete', () => {
	const wordLength = 5;
	const rows = 6;
	const expected = 'game is now completed!';
	let eventString = '';

	const board = new WordBoard({ rows, solution: 'jiras', tiles: wordLength });

	board.registerEvents({
		onGameCompleted: () => {
			eventString = expected;
		}
	});
	const word = 'gråte';
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < wordLength; j++) {
			board.addLetter(word[j]);
		}
		board.addLetter('Enter');
	}

	expect(eventString).toBe(expected);
});

test('Expect onGameCompleted event to NOT be triggered after row complete with wrong word', () => {
	const wordLength = 5;
	const rows = 6;
	const solution = 'jiras';
	const expected = 'game is now completed!';
	let eventString = '';

	const board = new WordBoard({ rows, solution, tiles: wordLength });

	board.registerEvents({
		onGameCompleted: () => {
			eventString = expected;
		}
	});

	board.addLetter('g');
	board.addLetter('r');
	board.addLetter('å');
	board.addLetter('t');
	board.addLetter('e');
	board.addLetter('Enter');

	expect(eventString).toEqual('');
});

test('Expect valid row submission to produce array of correct letter indicators', () => {
	const wordLength = 5;
	const rows = 6;
	const solution = 'kajak';
	const expected = ['correct', 'notPresent', 'present', 'notPresent', 'notPresent'];
	let result;
	const board = new WordBoard({ rows, solution, tiles: wordLength });
	board.registerEvents({
		onValidWord: (r) => {
			result = r;
		}
	});
	board.addLetter('k');
	board.addLetter('l');
	board.addLetter('a');
	board.addLetter('r');
	board.addLetter('e');
	board.addLetter('Enter');

	expect(result).toEqual(expected);
});

test('Expect onGameCompleted event to have solution word argument', () => {
	const wordLength = 5;
	const rows = 6;
	const solution = 'riske';
	let expected = '';
	let result;
	const board = new WordBoard({ rows, solution, tiles: wordLength });
	board.registerEvents({
		onGameCompleted: (result, word) => {
			expected = word;
		}
	});
	board.addLetter('r');
	board.addLetter('i');
	board.addLetter('s');
	board.addLetter('k');
	board.addLetter('e');
	board.addLetter('Enter');

	expect(solution).toBe(expected);
});

test('Expect Enter and Backspace to not be allowed as input letters', () => {
	const wordLength = 5;
	const rows = 6;
	const solution = 'prism';
	const expected = [
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', '']
	];
	const board = new WordBoard({ rows, solution, tiles: wordLength });

	board.addLetter('i');
	board.addLetter('Enter');
	board.addLetter('Enter');
	board.addLetter('Backspace');
	board.addLetter('Backspace');
	const { boardState } = board.getBoardState();

	expect(boardState).toEqual(expected);
});
