import React, { useEffect, useState } from 'react';
import Select from "react-select";
import Cookies from 'js-cookie';
import { apiDeleteIp, apiEditIp, apiGetIp, apiInsertIP } from '../../services/api';
import './settingip.style.css'
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import TableLog from '../TableLog/TableLog';
import Modals from '../Modal/Modal';

const SettingIp = () => {
    const [totalCameras, setTotalCameras] = useState(0);
    const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
    const [cameraNames, setCameraNames] = useState([]);
    const [cameraIPs, setCameraIPs] = useState([]);
    const [dataUserIp, setDataUserIp] = useState({});
    const [listCamera, setListCamera] = useState([])
    const [isEditing, setIsEditing] = useState(false);
    const [modalAdd, setModalAdd] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [detailData, setDetailData] = useState({})

    const optionCameras = [...Array(10)].map((_, index) => ({
        value: index + 1,
        label: `${index + 1} Kamera`,
    }));
    const getUserdata = Cookies.get('userdata');

    const fetchAllIp = async () => {
        try {
            const res = await apiGetIp(dataUserIp?.petugas?.id);
            console.log(res, 'res');
            // console.log(res.data.data, "res.data.data")
            setListCamera(res.data.data)
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
    useEffect(() => {
        setDataUserIp(JSON.parse(getUserdata));
        console.log(JSON.parse(getUserdata), 'hasildaricookie');


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
            ...detailData,
            userId: dataUserIp?.petugas?.id,
        };

        const insertIpKamera = apiInsertIP(dataApiKemera);
        insertIpKamera.then((res) => {
            if (res.status == 200) {
                closeModalAdd()
                fetchAllIp()
            }
        }).catch((err) => {
            console.log(err);
        });

        console.log('Form_submitted:', { totalCameras, cameraNames, cameraIPs });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        console.log(dataUserIp, 'dataUserIp');
        const dataApiKemera = {
            ...detailData,
            userId: dataUserIp?.petugas?.id,
        };

        const editIpKamera = apiEditIp(dataApiKemera, detailData?.id);
        editIpKamera.then((res) => {
            if (res.status == 200) {
                closeModalEdit()
                fetchAllIp()
            }
        }).catch((err) => {
            console.log(err.message);
        });

        console.log('Form_submitted:', { totalCameras, cameraNames, cameraIPs });
    };

    const handleDelete = () => {
        const deleteIpKamera = apiDeleteIp(detailData.id);
        deleteIpKamera.then((res) => {
            if (res.status == 200) {
                closeModalDelete()
                fetchAllIp()
            }
            // if (res?.data?.status) {
            //     setTotalCameras(0);
            //     setCameraNames([]);
            //     setCameraIPs([]);
            //     setIsEditing(false);
            // }
        }).catch((err) => {
            console.log(err.message);
        });
    }

    const openModalAdd = () => {
        // setDetailData(row)
        setModalAdd(true)
    }

    const closeModalAdd = () => {
        setDetailData({})
        setModalAdd(false)
    }
    const openModalEdit = (row) => {
        setDetailData(row)
        setModalEdit(true)
    }

    const closeModalEdit = () => {
        setDetailData({})
        setModalEdit(false)
    }
    const openModalDelete = (row) => {
        setDetailData(row)
        setModalDelete(true)
    }

    const closeModalDelete = () => {
        setDetailData({})
        setModalDelete(false)
    }
    const customRowRenderer = (row) =>
    (
        <>
            <td>{row.namaKamera}</td>
            <td>{row.ipAddress}</td>
            <td className='button-action' style={{ height: '100px', display: 'flex', alignItems: "center" }}>
                <button
                    onClick={() => openModalEdit(row)}
                >Edit</button>
                <button
                    onClick={() => openModalDelete(row)}
                    style={{ background: 'red' }}>Delete</button>
            </td>
        </>
    );

    const modalAddLayout = () => (
        <div className="modal-edit-container">
            <div className="input-config">
                <span>Nama Kamera</span>
                <input type="text"
                    value={detailData?.namaKamera}
                    onChange={(e) => setDetailData({ ...detailData, namaKamera: e.target.value })}
                />
            </div>
            <div className="input-config">
                <span>IP Kamera</span>
                <input type="text"
                    value={detailData?.ipAddress}
                    onChange={(e) => setDetailData({ ...detailData, ipAddress: e.target.value })}
                />
            </div>
        </div>
    )
    const modalEditLayout = () => (
        <div className="modal-edit-container">
            <div className="input-config">
                <span>Nama Kamera</span>
                <input type="text"
                    value={detailData?.namaKamera}
                    onChange={(e) => setDetailData({ ...detailData, namaKamera: e.target.value })}
                />
            </div>
            <div className="input-config">
                <span>IP Kamera</span>
                <input type="text"
                    value={detailData?.ipAddress}
                    onChange={(e) => setDetailData({ ...detailData, ipAddress: e.target.value })}
                />
            </div>
        </div>
    )

    const modalDeleteLayout = () => {
        return (
            <div className="" >
                <span
                    style={{ fontSize: 20, fontWeight: '400' }}
                >Are You Sure Want Delete <span style={{ fontWeight: "bold" }}>{detailData.namaKamera}</span> with ip address <span style={{ fontWeight: "bold" }}>{detailData.ipAddress}</span> ?</span>
            </div>
        )
    }
    return (
        <div className='config-container'>
            <div className="add-btn-container">
                <button
                    onClick={openModalAdd}
                >Tambah</button>
            </div>
            <TableLog
                tHeader={['no', 'Nama Kamera', "Ip Address", "Action"]}
                tBody={listCamera}
                rowRenderer={customRowRenderer}
            />
            <Modals
                buttonName="Submit"
                headerName="Add Kamera"
                closeModal={closeModalAdd}
                showModal={modalAdd}
                onConfirm={handleSubmit}
            >
                {modalAddLayout()}
            </Modals>
            <Modals
                buttonName="Submit"
                headerName="Edit Kamera"
                closeModal={closeModalEdit}
                showModal={modalEdit}
                onConfirm={handleEdit}
            >
                {modalEditLayout()}
            </Modals>
            <Modals
                buttonName="Submit"
                headerName="Delete Kamera"
                closeModal={closeModalDelete}
                showModal={modalDelete}
                onConfirm={handleDelete}
            >
                {modalDeleteLayout()}
            </Modals>
            {/* <form
                // className=""
                onSubmit={isEditing ? handleEdit : handleSubmit} // Adjust submit handler based on mode
            // style={{ width: "120vh" }}
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

                <div className='button-config-list'>
                    <button
                        type="button"
                        onClick={handlePrevCamera}
                        disabled={currentCameraIndex === 0}
                    >
                        <MdKeyboardDoubleArrowLeft
                            size={16}
                        />
                        Sebelumnya
                    </button>
                    <button
                        type="button"
                        onClick={handleNextCamera}
                        disabled={currentCameraIndex === totalCameras - 1}
                    >
                        Berikutnya
                        <MdKeyboardDoubleArrowRight
                            size={16}
                        />
                    </button>
                </div>
            </form> */}
            {/* <div className="btn-submit">
                <button
                    type="submit"
                // className="btn-submit"
                >
                    {isEditing ? 'Simpan Perubahan' : 'Simpan'}
                </button>
            </div> */}
            {/* <button
                onClick={handleDelete}
            >
                Delete
            </button> */}
        </div>
    );
};

export default SettingIp;
