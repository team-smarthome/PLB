import { useSetAtom } from "jotai";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { LanjutSendData } from "../../utils/atomStates";

const ModalCekal = ({ open, onClose, row, skorKemiripan }) => {
    const [activeTab, setActiveTab] = useState(0);

    console.log("skorKemiripan", typeof skorKemiripan);
    console.log("Row", row);
    const setLanjut = useSetAtom(LanjutSendData);

    const handleTabChange = (index) => {
        setActiveTab(index);
    };

    const initialFormData = {
        namaLengkap:
            row?.informasi_terlapor?.nama_depan || row?.informasi_terlapor?.nama_belakang
                ? `${row?.informasi_terlapor?.nama_depan} ${row?.informasi_terlapor?.nama_belakang}`
                : "",
        kewarganegaraan: row?.informasi_terlapor?.nama_kewarganegaraan || "",
        tipeIdentitas: row?.informasi_terlapor?.tipe_identitas || "",
        IdIdentitas: row?.informasi_terlapor?.id_identitas || "",
        tanggalLahir: row?.informasi_terlapor?.tanggal_lahir || "",
        jenisKelamin:
            row?.informasi_terlapor?.kode_jenis_kelamin === "M"
                ? "Laki-Laki"
                : row?.informasi_terlapor?.kode_jenis_kelamin === "F"
                    ? "Perempuan"
                    : "",
        alasanCekal: row?.informasi_terlapor?.alasan_cekal || "",
        narasiCekal: row?.informasi_terlapor?.narasi_cekal || "",
        tanggalReviewTerlapor: row?.informasi_terlapor?.tanggal_review_terlapor || "",
        arahPerlintasan: row?.informasi_terlapor?.arah_perlintasan || "",
        namaInstansi: row?.informasi_terlapor?.nama_instansi || "",
        tindakan: row?.informasi_terlapor?.tindakan || "",
        idDokumen:
            Array.isArray(row?.informasi_dokumen) && row?.informasi_dokumen.length > 0
                ? row.informasi_dokumen[0]?.id_dokumen
                : "",
        nomorDokumenPerjalanan:
            Array.isArray(row?.informasi_dokumen) && row?.informasi_dokumen.length > 0
                ? row.informasi_dokumen[0]?.nomor_dokumen_perjalanan
                : "",
        kodeNegaraPenerbit:
            Array.isArray(row?.informasi_dokumen) && row?.informasi_dokumen.length > 0
                ? row.informasi_dokumen[0]?.kode_negara_penerbit
                : "",
        jenisDokumenPerjalanan:
            Array.isArray(row?.informasi_dokumen) && row?.informasi_dokumen.length > 0
                ? row.informasi_dokumen[0]?.jenis_dokumen_perjalanan
                : "",
        instansi:
            Array.isArray(row?.informasi_dokumen) && row?.informasi_dokumen.length > 0
                ? row.informasi_dokumen[0]?.instansi
                : "",
        tindakanDokumen:
            Array.isArray(row?.informasi_dokumen) && row?.informasi_dokumen.length > 0
                ? row.informasi_dokumen[0]?.tindakan
                : "",
    };


    const HandleLanjutKirimData = () => {
        Swal.fire({
            title: "Apakah Anda Yakin?",
            text: "Data akan dikirim ke server",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#17C964",
            cancelButtonColor: "#F31260",
            confirmButtonText: "Ya, Lanjutkan!",
            cancelButtonText: "Batal",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                setLanjut(true);
                onClose();
            }
        });
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg w-[60%] h-[65%] flex flex-col">
                {/* Modal Header */}
                <div
                    className="flex justify-between items-center px-6 mb-4"
                    style={{ borderBottom: "2px solid #E5E7EB" }}
                >
                    <h2 className="text-3xl font-semibold">Detail Cekal</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none bg-white border-none hover:bg-slate-50 hover:cursor-pointer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Modal Tab */}
                <div className="flex border-b-2 border-gray-300 px-6">
                    <div className="flex space-x-4">
                        <label
                            className={`cursor-pointer py-2 px-4 text-lg font-medium `}
                            style={{
                                borderBottom: activeTab === 0 ? "2px solid #2563EB" : "none",
                            }}
                            onClick={() => handleTabChange(0)}
                        >
                            Informasi Terlapor
                        </label>
                        <label
                            className={`cursor-pointer py-2 px-4 text-lg font-medium `}
                            onClick={() => handleTabChange(1)}
                            style={{
                                borderBottom: activeTab === 1 ? "2px solid #2563EB" : "none",
                            }}
                        >
                            Informasi Dokumen
                        </label>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="grid grid-cols-2 px-2 flex-grow overflow-y-auto mt-6">
                    {activeTab === 0 && (
                        <>
                            <div className="px-4 py-3">
                                <label htmlFor="input1" className="block text-slate-700">
                                    Nama Lengkap
                                </label>
                                <input
                                    id="input1"
                                    type="text"
                                    className="w-[90%] p-4 mt-2 bg-white"
                                    value={initialFormData.namaLengkap}
                                    readOnly
                                />
                            </div>
                            <div className="px-3 py-3">
                                <label htmlFor="input2" className="block  text-slate-700">
                                    Kewarganegaraan
                                </label>
                                <input
                                    id="input2"
                                    type="text"
                                    className="w-[90%]  p-4 mt-2 bg-white"
                                    value={initialFormData.kewarganegaraan}
                                    readOnly
                                />
                            </div>
                            <div className="px-3 py-3">
                                <label htmlFor="input1" className="block  text-slate-700">
                                    Tipe Identitas
                                </label>
                                <input
                                    id="input1"
                                    type="text"
                                    className="w-[90%] p-4 mt-2 bg-white"
                                    value={initialFormData.tipeIdentitas}
                                    readOnly
                                />
                            </div>
                            <div className="px-4 py-3">
                                <label htmlFor="input2" className="block  text-slate-700">
                                    ID Identitas
                                </label>
                                <input
                                    id="input2"
                                    type="text"
                                    className="w-[90%]  p-4 mt-2 bg-white"
                                    value={initialFormData.IdIdentitas}
                                    readOnly
                                />
                            </div>
                            <div className="px-4 py-3">
                                <label htmlFor="input1" className="block  text-slate-700">
                                    Tanggal Lahir
                                </label>
                                <input
                                    id="input1"
                                    type="text"
                                    className="w-[90%] p-4 mt-2 bg-white"
                                    value={initialFormData.tanggalLahir}
                                    readOnly
                                />
                            </div>
                            <div className="px-3 py-3">
                                <label htmlFor="input2" className="block  text-slate-700">
                                    Jenis Kelamin
                                </label>
                                <input
                                    id="input2"
                                    type="text"
                                    className="w-[90%]  p-4 mt-2 bg-white"
                                    value={initialFormData.jenisKelamin}
                                    readOnly
                                />
                            </div>
                            <div className="px-3 py-3">
                                <label htmlFor="input1" className="block  text-slate-700">
                                    Alasan Cekal
                                </label>
                                <input
                                    id="input1"
                                    type="text"
                                    className="w-[90%] p-4 mt-2 bg-white"
                                    value={initialFormData.alasanCekal}
                                    readOnly
                                />
                            </div>
                            <div className="px-4 py-3">
                                <label htmlFor="input2" className="block  text-slate-700">
                                    Narasi Cekal
                                </label>
                                <input
                                    id="input2"
                                    type="text"
                                    className="w-[90%]  p-4 mt-2 bg-white"
                                    value={initialFormData.narasiCekal}
                                    readOnly
                                />
                            </div>
                            <div className="px-4 py-3">
                                <label htmlFor="input1" className="block  text-slate-700">
                                    Tanggal Review Terlapor
                                </label>
                                <input
                                    id="input1"
                                    type="text"
                                    className="w-[90%] p-4 mt-2 bg-white"
                                    value={initialFormData.tanggalReviewTerlapor}
                                    readOnly
                                />
                            </div>
                            <div className="px-3 py-3">
                                <label htmlFor="input2" className="block  text-slate-700">
                                    Arah Perlintasan
                                </label>
                                <input
                                    id="input2"
                                    type="text"
                                    className="w-[90%]  p-4 mt-2 bg-white"
                                    value={initialFormData.arahPerlintasan}
                                    readOnly
                                />
                            </div>
                            <div className="px-3 py-3">
                                <label htmlFor="input1" className="block  text-slate-700">
                                    Nama Instansi
                                </label>
                                <input
                                    id="input1"
                                    type="text"
                                    className="w-[90%] p-4 mt-2 bg-white"
                                    value={initialFormData.namaInstansi}
                                    readOnly
                                />
                            </div>
                            <div className="px-4 py-3">
                                <label htmlFor="input2" className="block  text-slate-700">
                                    Tindakan
                                </label>
                                <textarea
                                    className="w-[90%] h-[100%] px-4  mt-2 bg-white text-base text-left"
                                    value={initialFormData.tindakan}
                                    readOnly
                                />
                                {/* <input
                                    id="input2"
                                    type="text"
                                    className="w-[90%] p-4 mt-2 bg-white"
                                    value={initialFormData.tindakan}
                                    readOnly
                                /> */}
                            </div>
                        </>
                    )}
                    {activeTab === 1 && (
                        <>
                            <div className="px-4 py-3">
                                <label htmlFor="input2" className="block  text-slate-700">
                                    ID Dokumen
                                </label>
                                <input
                                    id="input2"
                                    type="text"
                                    className="w-[90%]  p-4 mt-2 bg-white"
                                    value={initialFormData.idDokumen}
                                    readOnly
                                />
                            </div>
                            <div className="px-4 py-3">
                                <label htmlFor="input1" className="block text-slate-700">
                                    Nomor Dokumen Perjalanan
                                </label>
                                <input
                                    id="input1"
                                    type="text"
                                    className="w-[90%] p-4 mt-2 bg-white"
                                    value={initialFormData.nomorDokumenPerjalanan}
                                    readOnly
                                />
                            </div>
                            <div className="px-3 py-3">
                                <label htmlFor="input2" className="block  text-slate-700">
                                    Kode Negara Penerbit
                                </label>
                                <input
                                    id="input2"
                                    type="text"
                                    className="w-[90%]  p-4 mt-2 bg-white"
                                    value={initialFormData.kodeNegaraPenerbit}
                                    readOnly
                                />
                            </div>
                            <div className="px-4 py-3">
                                <label htmlFor="input2" className="block  text-slate-700">
                                    Jenis Dokumen Perjalanan
                                </label>
                                <input
                                    id="input2"
                                    type="text"
                                    className="w-[90%]  p-4 mt-2 bg-white"
                                    value={initialFormData.jenisDokumenPerjalanan}
                                    readOnly
                                />
                            </div>
                            <div className="px-4 py-3">
                                <label htmlFor="input1" className="block  text-slate-700">
                                    Instansi
                                </label>
                                <input
                                    id="input1"
                                    type="text"
                                    className="w-[90%] p-4 mt-2 bg-white"
                                    value={initialFormData.instansi}
                                    readOnly
                                />
                            </div>
                            <div className="px-3 py-3">
                                <label htmlFor="input1" className="block  text-slate-700">
                                    Tindakan
                                </label>
                                <textarea
                                    className="w-[90%] h-[100%] px-4  mt-2 bg-white text-base text-left"
                                    value={initialFormData.tindakanDokumen}
                                    readOnly
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-4 p-4 ">
                    <button
                        onClick={onClose}
                        className="text-base text-white px-4 py-3 bg-[#F31260] border-none rounded-lg hover:bg-[#D30F56] focus:outline-none hover:cursor-pointer"
                    >
                        Batalkan
                    </button>
                    <button
                        onClick={skorKemiripan !== 100 ? HandleLanjutKirimData : null}
                        className={`text-base text-white px-4 py-3 bg-[#17C964] border-none rounded-lg hover:bg-[#1AAB4A] focus:outline-none hover:cursor-pointer ${skorKemiripan === 100 ? "cursor-pointer disabled" : "cursor-not-allowed"}`}
                        disabled={skorKemiripan === 100}
                    >
                        Lanjutkan
                    </button>
                </div>
            </div>
        </div >
    );
};

export default ModalCekal;
