import * as chalk from 'chalk';

export type Loader = {
	done: () => void;
	error: () => void;
};

const loaderIcons = ['▝', '▐', '▗', '▄', '▖', '▌', '▘', '▀'];

function runningTimer(name: string, time: number): string {
	const loader = loaderIcons[time % loaderIcons.length];
	return `${chalk.gray(loader)} ${name} — ${(time / 10).toFixed(1)}s`;
}

export default function startLoading(name: string): Loader {
	let time = 0;

	process.stdout.write(runningTimer(name, time));

	const interval = setInterval(() => {
		time += 1;
		process.stdout.write(`\r\x1b[K${runningTimer(name, time)}`);
	}, 100 /* Updates timer every 0.1s */);

	return {
		done() {
			clearInterval(interval);
			process.stdout.write(`\r\x1b[K${chalk.green('✓')} ${name} — ${(time / 10).toFixed(1)}s\n`);
		},
		error() {
			clearInterval(interval);
			process.stdout.write(`\r\x1b[K${chalk.red('✕')} ${name} — ${(time / 10).toFixed(1)}s\n`);
		},
	};
}
