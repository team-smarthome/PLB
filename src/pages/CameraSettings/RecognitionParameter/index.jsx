import React, { useState } from 'react';
import SwitchButton from '../../../components/SwitchButton';
import VolumeInput from '../../../components/VolumeInput';

const RecognitionParameter = () => {
  const [config, setConfig] = useState({
    faceRecognitonMode: false,
    bangsDetection: false,
    visibleLightLivenessDetection: false,
    infraredLivenessDetection: false,
    faceBrightnessDetection: false,
    hatDetection: false,
    glassesDetection: false,
    sunglassesDetection: false,
    blurDetection: false,
    pupillaryDistanceMeasurement: false,

    recognitionThreshold: 0,
    detectionThreshold: 0,
    recognitionThresholdMask: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingBottom: 0,
    paddingRight: 0,
    recognitionThresholdSunglasses: 0,
    recognitionThresholdGlasses: 0,
    recognitionThresholdInfraredLiveness: 0,
    recognitionThresholdVisibleLightLiveness: 0,
    recognitionThresholdBlur: 0,
    recognitionThresholdHat: 0,
    propotionOfBangsToForehead: 0,
    maximumDetectionThreshold: 0,
    minimumDetectionThreshold: 0,
    maximumFaceArea: 0,
    maximumPupillaryDistance: 0,
    minimumPupillaryDistance: 0,
    facialYawThreshold: 0,
    facialRollThreshold: 0,
    facialPitchThreshold: 0,

  })
  

  const handleCheckbox = (state) => {
    setConfig((prevState) => {
      const newValue = !prevState[state];
      console.log(state, prevState, newValue); // Log the toggled value
      return {
        ...prevState,
        [state]: newValue
      };
    });
  };
  
  const distanceList = [0.5, 1.0, 1.5, 2.0, 2.5, 3]


  const [volume, setVolume] = useState(50);

  const handleVolumeChange = (event, name) => {
    setConfig({
      ...config, [name]:event.target.value});
  };

  const decreaseVolume = (name) => {
    setConfig((prevState) => {
      const newValue = prevState[name] - 1;
      return{
        ...prevState,
        [name]: newValue
      }
    })
  }
  const increaseVolume = (name) => {
    setConfig((prevState) => {
      const newValue = prevState[name] + 1;
      return{
        ...prevState,
        [name]: newValue
      }
    })
  }

  console.log(config.recognitionThreshold)
  return (
    <div className="p-4 px-12">
      <div className="w-full flex items-center justify-center gap-4 mb-8">
        <button className="p-4 rounded-md font-bold bg-btnPrimary text-white cursor-pointer">
          Restore Default Settings
        </button>
        <button className="p-4 rounded-md font-bold bg-btnPrimary text-white cursor-pointer">
          Export Parameters
        </button>
        <button className="p-4 rounded-md font-bold bg-btnPrimary text-white cursor-pointer">
          Import Parameters
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-around gap-4 ">
          <SwitchButton 
          label='Face Recognition Mode'
          handleCheckboxChange={() => handleCheckbox("faceRecognitonMode")}
          isChecked={config.faceRecognitonMode}
          />
          <SwitchButton 
          label='Bangs Detection'
          handleCheckboxChange={() => handleCheckbox("bangsDetection")}
          isChecked={config.bangsDetection}
          />
        </div>
        <div className="flex flex-row justify-around gap-4 w-full">
          <div className="">
          <SwitchButton 
          label='Visible light liveness detection'
          handleCheckboxChange={() => handleCheckbox("visibleLightLivenessDetection")}
          isChecked={config.visibleLightLivenessDetection}
          />
          </div>
          <SwitchButton 
          label='Infrared liveness detection'
          handleCheckboxChange={() => handleCheckbox("infraredLivenessDetection")}
          isChecked={config.infraredLivenessDetection}
          />
        </div>
        <div className="flex flex-row justify-around gap-4 w-full">
          <SwitchButton 
          label='Face brightness detection'
          handleCheckboxChange={() => handleCheckbox("faceBrightnessDetection")}
          isChecked={config.faceBrightnessDetection}
          />
          <SwitchButton 
          label='Hat detection'
          handleCheckboxChange={() => handleCheckbox("hatDetection")}
          isChecked={config.hatDetection}
          />
        </div>
        <div className="flex flex-row justify-around gap-4 w-full">
          <SwitchButton 
          label='Glasses detection'
          handleCheckboxChange={() => handleCheckbox("glassesDetection")}
          isChecked={config.glassesDetection}
          />
          <SwitchButton 
          label='Sunglasses detection'
          handleCheckboxChange={() => handleCheckbox("sunglassesDetection")}
          isChecked={config.sunglassesDetection}
          />
        </div>
        <div className="flex flex-row justify-around gap-4 w-full">
          <SwitchButton 
          label='Blur detection'
          handleCheckboxChange={() => handleCheckbox("blurDetection")}
          isChecked={config.blurDetection}
          />
          <SwitchButton 
          label='Pupillary distance detection'
          handleCheckboxChange={() => handleCheckbox("pupillaryDistanceMeasurement")}
          isChecked={config.pupillaryDistanceMeasurement}
          />
        </div>
        <div className="flex flex-row justify-around gap-4 w-full items-center">
          <div className="flex flex-row gap-4">
          <h3>Mask access policy </h3>
          <select 
          className='p-4 border-1 font-bold'
          >
              <option value="0" className='font-bold'>Optional mask-wearing</option>
              <option value="1" className='font-bold'>Mandatory mask-wearing</option>
              <option value="2" className='font-bold'>Prohibition mask-wearing</option>
          </select>
          </div>
          <div className="flex flex-row gap-4">
          <h3>Recognition distance </h3>
          <select 
          className='p-4 border-1 text-md font-bold'
          >
            {distanceList.map((val) => {return(
              <option className='font-bold' value={val}>{val}m</option>
            )})}
          </select>
          </div>
        </div>
      </div>

      <div className="pt-8">

        <div className="">
          <h3
          className='text-start'
          >Developer Mode Face Recognition</h3>
          <VolumeInput 
          label="Recognition threshold"
          value={config.recognitionThreshold}
          handleVolumeChange={(e) => handleVolumeChange(e, "recognitionThreshold")}
          increaseVolume={() => increaseVolume("recognitionThreshold")}
          decreaseVolume={() => decreaseVolume("recognitionThreshold")}
          />
        </div>
        
        <div className="">
          <h3
          className='text-start'
          >Mask Recognition</h3>
          <VolumeInput 
          label="Detection threshold"
          value={config.detectionThreshold}
          handleVolumeChange={(e) => handleVolumeChange(e, "detectionThreshold")}
          increaseVolume={() => increaseVolume("detectionThreshold")}
          decreaseVolume={() => decreaseVolume("detectionThreshold")}
          />
          <VolumeInput 
          label="Recognition threshold"
          value={config.recognitionThresholdMask}
          handleVolumeChange={(e) => handleVolumeChange(e, "recognitionThresholdMask")}
          increaseVolume={() => increaseVolume("recognitionThresholdMask")}
          decreaseVolume={() => decreaseVolume("recognitionThresholdMask")}
          />
        </div>

        <div className="">
          <h3
          className='text-start'
          >Padding Face</h3>
          <VolumeInput 
          label="Padding Top"
          value={config.paddingTop}
          handleVolumeChange={(e) => handleVolumeChange(e, "paddingTop")}
          increaseVolume={() => increaseVolume("paddingTop")}
          decreaseVolume={() => decreaseVolume("paddingTop")}
          />
          <VolumeInput 
          label="Padding Left"
          value={config.paddingLeft}
          handleVolumeChange={(e) => handleVolumeChange(e, "paddingLeft")}
          increaseVolume={() => increaseVolume("paddingLeft")}
          decreaseVolume={() => decreaseVolume("paddingLeft")}
          />
          <VolumeInput 
          label="Padding Bottom"
          value={config.paddingBottom}
          handleVolumeChange={(e) => handleVolumeChange(e, "paddingBottom")}
          increaseVolume={() => increaseVolume("paddingBottom")}
          decreaseVolume={() => decreaseVolume("paddingBottom")}
          />
          <VolumeInput 
          label="Padding Right"
          value={config.paddingRight}
          handleVolumeChange={(e) => handleVolumeChange(e, "paddingRight")}
          increaseVolume={() => increaseVolume("paddingRight")}
          decreaseVolume={() => decreaseVolume("paddingRight")}
          />
        </div>

        <div className="">
          <h3
          className='text-start'
          >Sunglasses Detection</h3>
          <VolumeInput 
          label="Detection Threshold"
          value={config.recognitionThresholdSunglasses}
          handleVolumeChange={(e) => handleVolumeChange(e, "recognitionThresholdSunglasses")}
          increaseVolume={() => increaseVolume("recognitionThresholdSunglasses")}
          decreaseVolume={() => decreaseVolume("recognitionThresholdSunglasses")}
          />
        </div>

        <div className="">
          <h3
          className='text-start'
          >Glasses Detection</h3>
          <VolumeInput 
          label="Detection Threshold"
          value={config.recognitionThresholdGlasses}
          handleVolumeChange={(e) => handleVolumeChange(e, "recognitionThresholdGlasses")}
          increaseVolume={() => increaseVolume("recognitionThresholdGlasses")}
          decreaseVolume={() => decreaseVolume("recognitionThresholdGlasses")}
          />
        </div>

        <div className="">
          <h3
          className='text-start'
          >Infrared Liveness Detection</h3>
          <VolumeInput 
          label="Detection Threshold"
          value={config.recognitionThresholdInfraredLiveness}
          handleVolumeChange={(e) => handleVolumeChange(e, "recognitionThresholdInfraredLiveness")}
          increaseVolume={() => increaseVolume("recognitionThresholdInfraredLiveness")}
          decreaseVolume={() => decreaseVolume("recognitionThresholdInfraredLiveness")}
          />
        </div>

        <div className="">
          <h3
          className='text-start'
          >Visible Light Liveness Detection</h3>
          <VolumeInput 
          label="Detection Threshold"
          value={config.recognitionThresholdVisibleLightLiveness}
          handleVolumeChange={(e) => handleVolumeChange(e, "recognitionThresholdVisibleLightLiveness")}
          increaseVolume={() => increaseVolume("recognitionThresholdVisibleLightLiveness")}
          decreaseVolume={() => decreaseVolume("recognitionThresholdVisibleLightLiveness")}
          />
        </div>

        <div className="">
          <h3
          className='text-start'
          >Blur Detection</h3>
          <VolumeInput 
          label="Detection Threshold"
          value={config.recognitionThresholdBlur}
          handleVolumeChange={(e) => handleVolumeChange(e, "recognitionThresholdBlur")}
          increaseVolume={() => increaseVolume("recognitionThresholdBlur")}
          decreaseVolume={() => decreaseVolume("recognitionThresholdBlur")}
          />
        </div>

        <div className="">
          <h3
          className='text-start'
          >Hat Detection</h3>
          <VolumeInput 
          label="Detection Threshold"
          value={config.recognitionThresholdHat}
          handleVolumeChange={(e) => handleVolumeChange(e, "recognitionThresholdHat")}
          increaseVolume={() => increaseVolume("recognitionThresholdHat")}
          decreaseVolume={() => decreaseVolume("recognitionThresholdHat")}
          />
        </div>

        <div className="">
          <h3
          className='text-start'
          >Bangs Detection</h3>
          <VolumeInput 
          label="Propotion of Bangs to Forehead"
          value={config.propotionOfBangsToForehead}
          handleVolumeChange={(e) => handleVolumeChange(e, "propotionOfBangsToForehead")}
          increaseVolume={() => increaseVolume("propotionOfBangsToForehead")}
          decreaseVolume={() => decreaseVolume("propotionOfBangsToForehead")}
          />
        </div>

        <div className="">
          <h3
          className='text-start'
          >Face Brightness Detection</h3>
          <VolumeInput 
          label="Maximum Detection Threshold"
          value={config.maximumDetectionThreshold}
          handleVolumeChange={(e) => handleVolumeChange(e, "maximumDetectionThreshold")}
          increaseVolume={() => increaseVolume("maximumDetectionThreshold")}
          decreaseVolume={() => decreaseVolume("maximumDetectionThreshold")}
          />
          <VolumeInput 
          label="Minimum Detection Threshold"
          value={config.minimumDetectionThreshold}
          handleVolumeChange={(e) => handleVolumeChange(e, "minimumDetectionThreshold")}
          increaseVolume={() => increaseVolume("minimumDetectionThreshold")}
          decreaseVolume={() => decreaseVolume("minimumDetectionThreshold")}
          />
        </div>

        <div className="">
          <h3
          className='text-start'
          >Pupillary / Face Area</h3>
          <VolumeInput 
          label="Maximum Face Area"
          value={config.maximumFaceArea}
          handleVolumeChange={(e) => handleVolumeChange(e, "maximumFaceArea")}
          increaseVolume={() => increaseVolume("maximumFaceArea")}
          decreaseVolume={() => decreaseVolume("maximumFaceArea")}
          />
          <VolumeInput 
          label="Minimum Pupillary Distance"
          value={config.minimumPupillaryDistance}
          handleVolumeChange={(e) => handleVolumeChange(e, "minimumPupillaryDistance")}
          increaseVolume={() => increaseVolume("minimumPupillaryDistance")}
          decreaseVolume={() => decreaseVolume("minimumPupillaryDistance")}
          />
        </div>

        <div className="mb-8">
          <h3
          className='text-start'
          >Facial Angle</h3>
          <VolumeInput 
          label="Facial Yaw Threshold"
          value={config.facialYawThreshold}
          handleVolumeChange={(e) => handleVolumeChange(e, "facialYawThreshold")}
          increaseVolume={() => increaseVolume("facialYawThreshold")}
          decreaseVolume={() => decreaseVolume("facialYawThreshold")}
          />
          
          <VolumeInput 
          label="Facial Roll Threshold"
          value={config.facialRollThreshold}
          handleVolumeChange={(e) => handleVolumeChange(e, "facialRollThreshold")}
          increaseVolume={() => increaseVolume("facialRollThreshold")}
          decreaseVolume={() => decreaseVolume("facialRollThreshold")}
          />
          <VolumeInput 
          label="Facial Pitch Threshold"
          value={config.facialPitchThreshold}
          handleVolumeChange={(e) => handleVolumeChange(e, "facialPitchThreshold")}
          increaseVolume={() => increaseVolume("facialPitchThreshold")}
          decreaseVolume={() => decreaseVolume("facialPitchThreshold")}
          />
          
        </div>
            <div className="">
              <button
              className=' p-4 w-[20%] rounded-md font-bold bg-btnPrimary text-white cursor-pointer'
              >
                Save
              </button>
            </div>
      </div>
    </div>
  );
};

export default RecognitionParameter;
