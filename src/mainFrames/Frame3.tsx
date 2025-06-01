'use client';

import { useState, useEffect } from 'react';

interface Frame3Props {
	data: {
		title: string;
		subtitle: string;
		description: string;
		emoji: string[];
	};
}

interface Emoji {
	id: number;
	emoji: string;
	x: number;
	y: number;
}

export default function Frame3({ data }: Frame3Props) {
	const [emojis, setEmojis] = useState<Emoji[]>([]);
	const [triggerConfetti, setHasTriggeredConfetti] = useState(false);

	const showConfetti = async () => {
		if (triggerConfetti) return;

		const confetti = (await import('canvas-confetti')).default;
		const duration = 3 * 1000;
		const animationEnd = Date.now() + duration;
		const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

		function randomInRange(min: number, max: number) {
			return Math.random() * (max - min) + min;
		}

		const interval: NodeJS.Timeout = setInterval(function () {
			const timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				return clearInterval(interval);
			}

			const particleCount = 50 * (timeLeft / duration);

			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
			});
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
			});
		}, 350);

		setHasTriggeredConfetti(true);
	};

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						showConfetti();
					}
				});
			},
			{
				threshold: 0.5,
			},
		);

		const isFrame3 = document.querySelector('#frame3');
		if (isFrame3) {
			observer.observe(isFrame3);
		}

		return () => {
			if (isFrame3) {
				observer.unobserve(isFrame3);
			}
		};
	}, []);

	const clickEmoji = (e: React.MouseEvent) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const randomEmoji =
			data.emoji[Math.floor(Math.random() * data.emoji.length)];

		const newEmoji = {
			id: Date.now(),
			emoji: randomEmoji,
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		};

		setEmojis((prev) => [...prev, newEmoji]);

		setTimeout(() => {
			setEmojis((prev) => prev.filter((emoji) => emoji.id !== newEmoji.id));
		}, 1000);
	};

	return (
		<section
			id="frame3"
			className="relative flex items-center justify-center min-h-screen overflow-hidden cursor-pointer bg-gradient-to-t to-ossca-mint-200 from-white"
			onClick={clickEmoji}
		>
			<div className="container flex flex-col items-center justify-center max-w-5xl text-center">
				<div className="mb-4 text-2xl text-black text-opacity-25 pretendard-500">
					{data.subtitle}
				</div>
				<div className="mb-4 text-4xl text-black pretendard-700">
					{data.title}
				</div>
				<div className="text-xl text-black text-opacity-25 pretendard-500">
					{data.description}
				</div>
			</div>

			{emojis.map((emoji) => (
				<div
					key={emoji.id}
					className="absolute text-6xl pointer-events-none select-none animate-pulse"
					style={{
						left: `${emoji.x}px`,
						top: `${emoji.y}px`,
						transform: 'translate(-50%, -50%)',
						zIndex: 5,
					}}
				>
					{emoji.emoji}
				</div>
			))}
		</section>
	);
}
