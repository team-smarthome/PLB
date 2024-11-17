import React from 'react';
import TableLog from '../../../components/TableLog/TableLog';
import { FaRegTrashAlt } from "react-icons/fa";


const AccessPassword = () => {
  return (
    <div className="p-6  ">
      <div className="flex flex-wrap items-center gap-6 mb-8">
        
        {/* Start Date Field */}
        <div className="flex items-center gap-2">
          <label htmlFor="start_date" className="font-semibold text-gray-600">Start Date</label>
          <input
            type="date"
            name="start_date"
            id="start_date"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* End Date Field */}
        <div className="flex items-center gap-2">
          <label htmlFor="end_date" className="font-semibold text-gray-600">End Date</label>
          <input
            type="date"
            name="end_date"
            id="end_date"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 ml-auto">
          <button className="px-4 py-2 rounded-md font-semibold bg-btnPrimary text-white transition">
            Query
          </button>
          <button className="px-4 py-2 rounded-md font-semibold bg-btnPrimary text-white  transition">
            Add Access Password
          </button>
          <button className="px-4 py-2 rounded-md font-semibold bg-white text-red-600 transition flex items-center">
          <FaRegTrashAlt className='mr-1'/>
            Batch Delete
          </button>
          <button className="px-4 py-2 rounded-md font-semibold bg-gray-400 text-white transition flex items-center">
          <FaRegTrashAlt className='mr-1'/>
          Clear All
          </button>
        </div>

      </div>
        <TableLog 
        tHeader={["Password ID", "Password Nickname", "Password Type", "Visitor Type", "Valid Times for Temporary Password", "Added Time", "Valid Start Time", "Valid End Time" ]}
        showIndex={false}
        tBody={[]}
        />
    </div>
  );
}

export default AccessPassword;
