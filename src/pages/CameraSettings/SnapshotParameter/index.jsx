import React, { useState } from 'react'
import TableLog from '../../../components/TableLog/TableLog'
import SwitchButton from '../../../components/SwitchButton';
import { FaRegCircleDot } from "react-icons/fa6";

const SnapshotParameter = () => {
    const [config, setConfig] = useState({
        faceMaskAccess: true,
        recognitionFailed: false,
        livenessDetectionFailed: false
    })
    const tableData = [
        {
            captureType: "Face Mask Access",
            state: config.faceMaskAccess,
            name: "faceMaskAccess"
        },
        {
            captureType: "Recogntion Failed",
            state: config.recognitionFailed,
            name: "recognitionFailed"
        },
        {
            captureType: "Liveness Detection Failed",
            state: config.livenessDetectionFailed,
            name: "livenessDetectionFailed"
        },
    ]
    const handleFeatureChange = (feature) => {
        console.log(feature)
        setConfig((prevState) => ({
          ...prevState,
          [feature]: !prevState[feature],
        }));
      };
    const customRowRenderer = (row) => (
        <>
            <td>{row.captureType}</td>
            <td className='flex justify-center pt-9'>
            <SwitchButton 
                isChecked={row.state}
                handleCheckboxChange={() => handleFeatureChange(`${row.name}`)}

            /></td>
            <td>     
                <h5 className='color-btnprimary flex items-center justify-center gap-2 cursor-pointer'>
                <FaRegCircleDot 
                size={15}/> 
                    jpg
                    </h5>
           </td>
            
        </>
    );
  return (
    <div
    className='p-4 px-12 pt-10 flex flex-col gap-8'
    >
        <TableLog 
        tHeader={['Capture Type', "Enable", "Picture Type"]}
        tBody={tableData}
        rowRenderer={customRowRenderer}
        showIndex={false}
        />

        <button
        className=' p-4 w-[20%] rounded-md font-bold bg-btnPrimary text-white cursor-pointer'>
            Save
        </button>
    </div>
  )
}

export default SnapshotParameter