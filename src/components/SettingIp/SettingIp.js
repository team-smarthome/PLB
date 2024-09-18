import React, { useEffect, useState } from 'react';
import Select from "react-select";
import Cookies from 'js-cookie';
import { apiDeleteIp, apiEditIp, apiGetIp, apiIsertIP } from '../../services/api';

const SettingIp = () => {
    const [totalCameras, setTotalCameras] = useState(0);
    const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
    const [cameraNames, setCameraNames] = useState([]);
    const [cameraIPs, setCameraIPs] = useState([]);
    const [dataUserIp, setDataUserIp] = useState({});
    const [isEditing, setIsEditing] = useState(false); // New state to determine if we are editing

    const optionCameras = [...Array(10)].map((_, index) => ({
        value: index + 1,
        label: `${index + 1} Kamera`,
    }));

    useEffect(() => {
        const getUserdata = Cookies.get('userdata');
        setDataUserIp(JSON.parse(getUserdata));
        console.log(JSON.parse(getUserdata), 'hasildaricookie');

        const fetchAllIp = async () => {
            try {
                const res = await apiGetIp(dataUserIp?.petugas?.id);
                console.log(res, 'res');

                if (res.data.data.length === 0) {
                    setCameraNames(new Array(totalCameras).fill(''));
                    setCameraIPs(new Array(totalCameras).fill(''));
                    setIsEditing(false); // No data, so we are in submit mode
                } else {
                    const names = res.data.data.map(item => item.namaKamera);
                    const ips = res.data.data.map(item => item.ipAddress);
                    setTotalCameras(res.data.data.length);
                    setCameraNames(names);
                    setCameraIPs(ips);
                    setIsEditing(true); // Data present, so we are in edit mode
                }
            } catch (err) {
                console.log(err.message);
            }
        };

        if (dataUserIp?.petugas?.id) {
            fetchAllIp();
        }
    }, [dataUserIp?.petugas?.id, totalCameras]);

    const handleTotalCamerasChange = (selectedOption) => {
        if (selectedOption) {
            const numCameras = selectedOption.value;
            setTotalCameras(numCameras);
            setCameraIPs(new Array(numCameras).fill(''));
            setCameraNames(new Array(numCameras).fill(''));
            setCurrentCameraIndex(0);
        } else {
            setTotalCameras(0);
            setCameraNames([]);
            setCameraIPs([]);
            setCurrentCameraIndex(0);
        }
    };

    const handleCameraNameChange = (e) => {
        const newCameraNames = [...cameraNames];
        newCameraNames[currentCameraIndex] = e.target.value;
        setCameraNames(newCameraNames);
    };

    const handleIPChange = (e) => {
        const newCameraIPs = [...cameraIPs];
        newCameraIPs[currentCameraIndex] = e.target.value;
        setCameraIPs(newCameraIPs);
    };

    const handleNextCamera = () => {
        if (currentCameraIndex < totalCameras - 1) {
            setCurrentCameraIndex(currentCameraIndex + 1);
        }
    };

    const handlePrevCamera = () => {
        if (currentCameraIndex > 0) {
            setCurrentCameraIndex(currentCameraIndex - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(dataUserIp, 'dataUserIp');
        const dataApiKemera = {
            userId: dataUserIp?.petugas?.id,
            namaKamera: cameraNames,
            ipAddress: cameraIPs
        };

        const insertIpKamera = apiIsertIP(dataApiKemera);
        insertIpKamera.then((res) => {
            console.log(res, "Form_submitted");
        }).catch((err) => {
            console.log(err.message);
        });

        console.log('Form_submitted:', { totalCameras, cameraNames, cameraIPs });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        console.log(dataUserIp, 'dataUserIp');
        const dataApiKemera = {
            userId: dataUserIp?.petugas?.id,
            namaKamera: cameraNames,
            ipAddress: cameraIPs
        };

        const editIpKamera = apiEditIp(dataApiKemera, dataUserIp?.petugas?.id);
        editIpKamera.then((res) => {
            console.log(res, "Form_submitted");
        }).catch((err) => {
            console.log(err.message);
        });

        console.log('Form_submitted:', { totalCameras, cameraNames, cameraIPs });
    };

    const handleDelete = () => {
        const deleteIpKamera = apiDeleteIp(dataUserIp?.petugas?.id);
        deleteIpKamera.then((res) => {
            if (res?.data?.status) {
                setTotalCameras(0);
                setCameraNames([]);
                setCameraIPs([]);
                setIsEditing(false);
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }

    return (
        <div>
            <form
                className="full-width-form"
                onSubmit={isEditing ? handleEdit : handleSubmit} // Adjust submit handler based on mode
                style={{ width: "120vh" }}
            >
                <div className="form-group">
                    <div className="wrapper-form">
                        <div className="wrapper-input">
                            <label htmlFor="total_cameras">Jumlah Kamera</label>
                        </div>
                        <Select
                            id="totalCameras"
                            name="totalCameras"
                            value={optionCameras.find(option => option.value === totalCameras)}
                            onChange={handleTotalCamerasChange}
                            options={optionCameras}
                            className="basic-single"
                            classNamePrefix="select"
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    flex: 1,
                                    width: '100%',
                                    borderRadius: '10px',
                                    backgroundColor: 'rgba(217, 217, 217, 0.75)',
                                    fontFamily: 'Roboto, Arial, sans-serif',
                                }),
                                valueContainer: (provided) => ({
                                    ...provided,
                                    flex: 1,
                                    width: '100%',
                                }),
                                control: (provided) => ({
                                    ...provided,
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'rgba(217, 217, 217, 0.75)',
                                }),
                            }}
                        />
                    </div>
                </div>

                {totalCameras > 0 && (
                    <div className="form-group">
                        <div className="wrapper-form">
                            <div className="wrapper-input">
                                <label htmlFor="cameraName">Masukkan Nama Kamera {currentCameraIndex + 1}</label>
                            </div>
                            <input
                                type="text"
                                id="cameraName"
                                name="cameraName"
                                placeholder={`Nama Kamera ${currentCameraIndex + 1}`}
                                onChange={handleCameraNameChange}
                                value={cameraNames[currentCameraIndex] || ''}
                            />
                        </div>
                    </div>
                )}

                {totalCameras > 0 && (
                    <div className="form-group">
                        <div className="wrapper-form">
                            <div className="wrapper-input">
                                <label htmlFor="cameraIP">Masukkan IP untuk Kamera {currentCameraIndex + 1}</label>
                            </div>
                            <input
                                type="text"
                                id="cameraIP"
                                name="cameraIP"
                                onChange={handleIPChange}
                                value={cameraIPs[currentCameraIndex] || ''}
                            />
                        </div>
                    </div>
                )}

                <div>
                    <button
                        type="button"
                        onClick={handlePrevCamera}
                        disabled={currentCameraIndex === 0}
                    >
                        Kamera Sebelumnya
                    </button>
                    <button
                        type="button"
                        onClick={handleNextCamera}
                        disabled={currentCameraIndex === totalCameras - 1}
                    >
                        Kamera Berikutnya
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                    >
                        {isEditing ? 'Simpan Perubahan' : 'Simpan'}
                    </button>
                </div>
            </form>
            <button
                onClick={handleDelete}
            >
                Delete
            </button>
        </div>
    );
};

export default SettingIp;
