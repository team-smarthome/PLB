import { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoFeed = () => {
  const videoRef = useRef(null);
  const [player, setPlayer] = useState();

  useEffect(() => {
    if (!player) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      setPlayer(
        videojs(videoElement, {}, () => {
          console.log("player is ready");
        })
      );
    }
  }, [player]);

  useEffect(() => {
    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [player]);

  return (
    <div>
      <video
        ref={videoRef}
        className="video-js"
        controls
        style={{ maxWidth: '50%', maxHeight: '50%' }}
      >
        <source src={"http://localhost:8083/stream/pattern/channel/0/hls/live/index.m3u8"} type="application/x-mpegURL" />
      </video>
    </div>
  );
};

export default VideoFeed;
