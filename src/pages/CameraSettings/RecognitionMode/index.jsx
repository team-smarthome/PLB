import React, { useState } from "react";

const RecognitionMode = () => {
  const [recognitionMode, setRecognitionMode] = useState("any");
  const [comparisonFeatures, setComparisonFeatures] = useState({
    face: true,
    fingerprint: false,
    password: false,
    icCard: true,
    qrCode: false,
  });

  const handleFeatureChange = (feature) => {
    setComparisonFeatures((prevState) => ({
      ...prevState,
      [feature]: !prevState[feature],
    }));
  };
  const recognitionModeArr = ["single", "any", "combination"]
  const comparisonFeaturesArr = ["Face", "Fingerprint", "Password", "IC Card", "QR Code"]
  return (
    <div className="p-4 py-10 flex items-center justify-center flex-col gap-4 ">
      {/* Recognition Mode */}
      <div className="grid grid-rows-1 grid-cols-4 items-center w-[50%]">
        <span className="text-xl">Recognition Mode :</span>
        {recognitionModeArr.map((mode) => (
        <label key={mode} className="flex items-center cursor-pointer px-10">
          <input
            type="radio"
            name="recognitionMode"
            value={mode}
            checked={recognitionMode === mode}
            onChange={() => setRecognitionMode(mode)}
            className="form-radio text-blue-600 focus:ring-blue-500 mr-1"
          />
          <span className={recognitionMode === mode ? "text-blue-600 font-medium" : "text-gray-700"}>
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </span>
        </label>
      ))}


      </div>

      {/* Comparison Features */}
      <div className="flex items-center gap-6 w-[50%]">
        <span className="text-xl">Comparison Features :</span>
        {comparisonFeaturesArr.map((feature) => (
          <label key={feature} className="flex items-center space-x-1 cursor-pointer">
            <input
              type="checkbox"
              name={feature.toLowerCase()}
              checked={comparisonFeatures[feature.toLowerCase().replace(" ", "")]}
              onChange={() => handleFeatureChange(feature.toLowerCase().replace(" ", ""))}
              className="form-checkbox text-blue-600 focus:ring-blue-500"
            />
            <span className={comparisonFeatures[feature.toLowerCase().replace(" ", "")] ? "text-blue-600 font-medium" : "text-gray-700"}>
              {feature}
            </span>
          </label>
        ))}
      </div>

      <div className="flex items-center gap-4 w-[50%]">
        <span className="text-xl">Person Recognition Expiration Interval :</span>
        <div className="flex flex-row items-center gap-2">
            <input type="text" name="" id="" className="w-8" value={10} disabled/>
            <h5>S</h5>
        </div>
      </div>

      <div className="flex flex-col">
      <h4 className="">When recognition mode is 'Single', only one comparison feature can be selected;</h4>
      <h4 className="-mt-4">When recognition mode is 'Any', multiple comparison feature can be selected freely, and any one of them can pass the verification;</h4>
      <h4 className="-mt-4">When recognition mode is 'Combination', multiple comparison feature can be selected freely, and all of them can pass the verification simultaneously;</h4>
    </div>

    </div>
  );
};

export default RecognitionMode;
