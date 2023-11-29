// WebcamComponent.js
import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

const WebcamComponent = () => {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    // Lakukan sesuatu dengan gambar yang diambil, misalnya kirim ke server
    console.log('Captured:', imageSrc);
  }, [webcamRef]);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <button onClick={capture}>Capture photo</button>
    </div>
  );
};

export default WebcamComponent;
