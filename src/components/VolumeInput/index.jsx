import React from 'react'

const VolumeInput = ({label, value, handleVolumeChange, decreaseVolume, increaseVolume}) => {
  return (
        <div className="flex flex-row justify-around items-center p-4 gap-2 px-6 max-w-[90%] w-[90%]">
          <label htmlFor="volume" className="text-lg font-semibold text-gray-700 w-[15%]">
            {label}
          </label>
          <input
            // id="volume"
            // name='label'
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={handleVolumeChange}
            className=" h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb text-center align-middle"
          />
            <div className="flex flex-row gap-2 items-center justify-center w-[15%]">
                <button 
                onClick={decreaseVolume}
                className="text-lg w-[40px] max-w-[40px]">-</button>
                <input
                    className="text-md font-medium text-gray-900 w-[20px] max-w-[20px] text-center" // Use a fixed width in pixels
                    type="text"
                    value={value}
                    />
                <button className="text-lg w-[40px] max-w-[40px]"
                    onClick={increaseVolume}
                    >+</button>
            </div>
        </div>
  )
}

export default VolumeInput