import React, { useEffect, useRef } from "react";
import shaka from "shaka-player";

const VideoPlayer = ({ url }) => {
	const videoRef = useRef(null);
	const playerRef = useRef(null);

	useEffect(() => {
		// Initialize the Shaka Player
		const player = new shaka.Player(videoRef.current);
		playerRef.current = player;

		// Attach the player to the video element and load the URL
		player.load(url).catch((error) => {
			console.error("Error loading video:", error);
		});

		// Clean up the player on component unmount
		return () => {
			player.destroy();
		};
	}, [url]);

	return (
		<div style={{ height: "180px" }}>
			<video
				ref={videoRef}
				width="100%"
				height="100%"
				controls
				autoPlay
			/>
		</div>
	);
};

export default VideoPlayer;
