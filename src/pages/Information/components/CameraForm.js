// CameraForm.js
import React from 'react';
import Select from 'react-select';

const CameraForm = ({
    newWifiResults,
    setNewWifiResults,
    totalCameras,
    optionCameras,
    handleTotalCamerasChange,
    cameraOptions,
    handleCameraSelect,
    selectedCamera,
    selectedCameraIndex,
    cameraIPs,
    handleIPChange,
    handleSubmit
}) => {
    return (
        <form
            className="full-width-form"
            onSubmit={handleSubmit}
            style={{ width: "120vh" }}
        >
            <div className="form-group">
                <div className="wrapper-form">
                    <div className="wrapper-input">
                        <label htmlFor="ip_server_pc">IP Server PC</label>
                    </div>
                    <input
                        type="text"
                        name="ipServerPC"
                        id="ipServerPC"
                        className={newWifiResults ? "" : ""}
                        value={newWifiResults}
                        onChange={(e) => setNewWifiResults(e.target.value)}
                    />
                </div>
            </div>
            <div>
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
                                <label htmlFor="status_card_reader">Pilih Kamera</label>
                            </div>
                            <Select
                                id="statusCardReader"
                                name="statusCardReader"
                                classNamePrefix="select"
                                options={cameraOptions}
                                onChange={handleCameraSelect}
                                value={cameraOptions.find(option => option.value === selectedCamera)}
                                placeholder="-- Pilih Kamera --"
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        flex: 1,
                                        width: "100%",
                                        borderRadius: "10px",
                                        backgroundColor: "rgba(217, 217, 217, 0.75)",
                                        fontFamily: "Roboto, Arial, sans-serif",
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        backgroundColor: "rgba(217, 217, 217, 0.75)",
                                    }),
                                }}
                            />
                        </div>
                    </div>
                )}

                {selectedCamera && (
                    <div className="form-group">
                        <div className="wrapper-form">
                            <div className="wrapper-input">
                                <label htmlFor="status_camera">Masukkan IP untuk {selectedCamera}</label>
                            </div>
                            <input
                                type="text"
                                name="statusCamera"
                                id="statusCamera"
                                className="disabled-input"
                                onChange={(e) => handleIPChange(e, selectedCameraIndex)}
                                value={cameraIPs[selectedCameraIndex] || ''}
                            />
                        </div>
                    </div>
                )}
            </div>
            <button
                className="ok-button"
                style={{ width: "100%" }}
            >
                Save
            </button>
        </form>
    );
};

export default CameraForm;
