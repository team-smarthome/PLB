import React from 'react'
import TableLog from '../../../components/TableLog/TableLog'

const AccessStrategy = () => {
  return (
    <div
    className='p-4 px-12'
    >
        <div className="flex items-center gap-4">
          <h3>Policy Name</h3>
          <div className="">
          <input 
          className='px-2 py-4 border-1 font-bold text-start bg-white'
            type='text'
           />
          </div>
        </div>

        <div className="flex flex-row gap-4">
        <button
        className=' p-4 w-[10%] rounded-md font-bold bg-btnPrimary text-white cursor-pointer'>
            Query
        </button>
        <button
        className=' p-4 w-[10%] rounded-md font-bold bg-white text-black cursor-pointer border-1 '>
            Reset
        </button>
        </div>

        <TableLog 
        tHeader={["Policy Name", "Creation Name", "Operation"]}
        tBody={[]}
        showIndex={false}
        />
    </div>
  )
}

export default AccessStrategy