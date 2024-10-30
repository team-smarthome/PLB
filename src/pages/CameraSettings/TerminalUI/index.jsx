import React from 'react'

const TerminalUi = () => {
  return (
    <div
      className='p-4 px-12 pt-10 flex flex-col gap-8'
    >
         <div className="flex items-center gap-4">
          <h3>Name Desensilitization </h3>
          <div className="">
          <select 
          className='px-10 py-2 border-1 font-bold text-start'
          >
              <option value="0" className='font-bold'>OFF</option>
              <option value="1" className='font-bold'>ON</option>
          </select>
          </div>
          </div>
          <button
        className=' p-4 w-[10%] rounded-md font-bold bg-btnPrimary text-white cursor-pointer'>
            Save
        </button>
    </div>
  )
}

export default TerminalUi