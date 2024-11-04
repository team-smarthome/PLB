import React, { useState } from 'react';


const RegistrationParameter = () => {
  
  return (
    <div className="p-4 px-12 pt-10">
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

            <div className="">
              <h2
              className='text-start'
              >Developer Mode</h2>
              <button
              className=' p-4 w-[20%] rounded-md font-bold bg-btnPrimary text-white cursor-pointer'
              >
                Save
              </button>
            </div>
    </div>
  );
};

export default RegistrationParameter;
