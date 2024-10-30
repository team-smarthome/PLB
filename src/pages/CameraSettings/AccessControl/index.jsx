import React, { useState } from 'react';
import SwitchButton from '../../../components/SwitchButton';

const AccessControl = () => {
    const [whiteLightControl, setWhiteLightControl] = useState("turn-off");
    const [infraredLight, setInfraredLight] = useState(false);
    const [outputControl, setOutputControl] = useState("switch");
    const [doorAction, setDoorAction] = useState("normally-open");
    const [protocolOrder, setProtocolOrder] = useState("forward");
    const [wiegandProtocol, setWiegandProtocol] = useState("26-bit");
    const [wiegandEnabled, setWiegandEnabled] = useState(false);
    const [serialPort, setSerialPort] = useState("qr");


    return (
        <div className="p-8">
            <div className="flex flex-row justify-between gap-4 mb-4">
            {/* Access Control */}
            <div className="rounded-lg border bg-white w-[50%]">
                <div className="bg-btnPrimary px-4 py-2 rounded-t-lg">
                    <h2 className="font-semibold text-white">Access Control</h2>
                </div>
                <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center ">
                        <label>White Light Control</label>
                        <select
                            value={whiteLightControl}
                            onChange={(e) => setWhiteLightControl(e.target.value)}
                            className="w-52 p-2 border rounded"
                        >
                            <option value="turn-off">Turn Off After No Person</option>
                        </select>
                    </div>

                    <div className="flex flex-row justify-between items-center gap-2">
                        
                        <label htmlFor="white-brightness">
                            White Light Brightness <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="white-brightness"
                            type="number"
                            defaultValue="50"
                            className="max-w-[40%] p-2 border rounded"
                        />
                        
                        <span className="text-sm text-muted">10-100 (100 is max)</span>
                    </div>

                    <SwitchButton
                    label="Infrared Light Control"
                    isChecked={false}
                    />

                    <div className="flex flex-row justify-between items-center gap-2">
                        
                        <label htmlFor="white-brightness">
                            Infrared Light Brightness <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="white-brightness"
                            type="number"
                            defaultValue="50"
                            className="max-w-[40%] p-2 border rounded"
                        />
                        
                        <span className="text-sm text-muted">10-100 (100 is max)</span>
                    </div>
                <div className="flex items-center justify-center">
                    <button
                        className=' p-4 w-[20%] rounded-md font-bold bg-btnPrimary text-white cursor-pointer self-center'>
                            Save
                        </button>
                </div>
                </div>
            </div>

            {/* Gate Control */}
            <div className="rounded-lg border bg-white w-[50%]">
                <div className="bg-btnPrimary px-4 py-2 rounded-t-lg">
                    <h2 className="font-semibold text-white">Gate Control</h2>
                </div>
                <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <label>Output Control</label>
                        <select
                            value={outputControl}
                            onChange={(e) => setOutputControl(e.target.value)}
                            className="w-52 p-2 border rounded"
                        >
                            <option value="switch">Switch Interface</option>
                        </select>
                    </div>

                    <div className="flex flex-row justify-between items-center gap-2">
                        <label htmlFor="white-brightness">
                             Output Hold Time T <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="white-brightness"
                            type="number"
                            defaultValue="50"
                            className="max-w-[40%] p-2 border rounded"
                        />
                        
                        <span className="text-sm text-muted">10-100 (100 is max)</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <label>Door Opening Action</label>
                        <select
                            value={outputControl}
                            onChange={(e) => setOutputControl(e.target.value)}
                            className="w-52 p-2 border rounded"
                        >
                            <option value="switch">Normally Open</option>
                        </select>
                    </div>

                    <div className="flex flex-row justify-between items-center gap-2">
                        <label htmlFor="white-brightness">
                            Pulse Period t1<span className="text-red-500">*</span>
                        </label>
                        <input
                            id="white-brightness"
                            type="number"
                            defaultValue="50"
                            className="max-w-[40%] p-2 border rounded"
                        />
                        
                        <span className="text-sm text-muted">10-100 (100 is max)</span>
                    </div>

                    <div className="flex flex-row justify-between items-center gap-2">
                        <label htmlFor="white-brightness">
                            Pulse Duration t2<span className="text-red-500">*</span>
                        </label>
                        <input
                            id="white-brightness"
                            type="number"
                            defaultValue="50"
                            className="max-w-[40%] p-2 border rounded"
                        />
                        
                        <span className="text-sm text-muted">10-100 (100 is max)</span>
                    </div>
                </div>
            </div>

            </div>

            <div className="flex flex-row justify-between gap-4 ">
            {/* Serial Port */}
            <div className="rounded-lg border bg-white w-[50%] h-[20%] max-h-[20%]">
                <div className="bg-btnPrimary px-4 py-2 rounded-t-lg">
                    <h2 className="font-semibold text-white">Serial Port</h2>
                </div>
                <div className="p-4 space-y-4 flex flex-col items-center">
                    <div className="flex justify-center items-center gap-2">
                        <label>232</label>
                        <select
                            value={serialPort}
                            onChange={(e) => setSerialPort(e.target.value)}
                            className="w-52 p-2 border rounded"
                        >
                            <option value="qr">QR code card</option>
                        </select>
                    </div>
                    <button
                        className=' p-4 w-[20%] rounded-md font-bold bg-btnPrimary text-white cursor-pointer '>
                            Save
                        </button>
                </div>
            </div>

            {/* Card Reader */}
            <div className="rounded-lg border w-[50%] flex flex-col gap-4">
                <div className=" py-2 rounded-t-lg bg-white">
                <div className="bg-btnPrimary px-4 py-2 rounded-t-lg">
                    <h2 className="font-semibold text-white">Gate Control</h2>
                </div>
                    <div className='p-4 flex flex-row items-center justify-center gap-4'>
                        <h3>Interface</h3>
                            <label>
                                <input
                                    type="radio"
                                    value="26-bit"
                                    checked={wiegandProtocol === "26-bit"}
                                    onChange={(e) => setWiegandProtocol(e.target.value)}
                                />
                                26-bit
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="30-bit"
                                    checked={wiegandProtocol === "30-bit"}
                                    onChange={(e) => setWiegandProtocol(e.target.value)}
                                />
                                30-bit
                            </label>
                    </div>
                </div>
               <div className="bg-white py-2 rounded-t-lg">
                     <div className="bg-btnPrimary px-4 py-2 rounded-t-lg">
                    <h2 className="font-semibold text-white">Wiegand</h2>
                </div>
                    <div className='p-4 flex flex-col items-start'>
                        <SwitchButton
                        label="Wiegand Enable/Disable"
                        isChecked={false}
                        />

                        <div className='p-4 flex flex-row items-center justify-center gap-4'>
                        <h3>Wiegand Protocol</h3>
                            <label>
                                <input
                                    type="radio"
                                    value="26-bit"
                                    checked={wiegandProtocol === "26-bit"}
                                    onChange={(e) => setWiegandProtocol(e.target.value)}
                                />
                                26-bit
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="30-bit"
                                    checked={wiegandProtocol === "30-bit"}
                                    onChange={(e) => setWiegandProtocol(e.target.value)}
                                />
                                30-bit
                            </label>
                        </div>    

                        <div className='p-4 flex flex-row items-center justify-center gap-4'>
                        <h3>Protocol Order</h3>
                            <label>
                                <input
                                    type="radio"
                                    value="26-bit"
                                    checked={wiegandProtocol === "26-bit"}
                                    onChange={(e) => setWiegandProtocol(e.target.value)}
                                />
                                Forward Order
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="30-bit"
                                    checked={wiegandProtocol === "30-bit"}
                                    onChange={(e) => setWiegandProtocol(e.target.value)}
                                />
                                Revers
                            </label>
                        </div>    
                        <button
                        className=' p-4 w-[20%] rounded-md font-bold bg-btnPrimary text-white cursor-pointer'>
                            Save
                        </button>
                    </div>
                </div>
            </div>

            </div>
        </div>
    );
}

export default AccessControl;
