const webSocketsServerPort = 4050;
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const path = require("path");

let onProgress = false;
let completed = 0;
let success = 0;
let failed = 0;


const server = http.createServer(function (request, response) {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE, PATCH",
        "Access-Control-Max-Age": 2592000,
        "Access-Control-Allow-Headers": "*",
    };
    if (request.method === "OPTIONS") {
        response.writeHead(204, headers);
        response.end();
        return;
    }
});

server.listen(webSocketsServerPort);
console.log("Listening on port " + webSocketsServerPort);

const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});


function writeLog(baseFolder, logData, fileName) {
    const folderName = logData.userNip;
    const folderPath = path.join(baseFolder, folderName);

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const logEntry = {
        timestamp: new Date().toISOString(),
        id: logData.record.no_passport,
        params: logData.params,
        response: logData.response,
    };

    const filePath = path.join(folderPath, fileName);

    fs.appendFile(filePath, JSON.stringify(logEntry, null, 2) + ",\n", (err) => {
        if (err) {
            console.error("Error writing to log file:", err.message);
        } else {
            console.log(`Log appended to: ${filePath}`);
        }
    });
}

const timestamp = new Date().toISOString().replace(/:/g, "-");
const logFileName = `${timestamp}.log`;



const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const handleSimpanPerlintasan = async (data, socket) => {
    console.log("Hit handleSimpanPerlintasan");
    onProgress = true;
    const { ipServer, version, userNip, userFullName, jenis, totalData } = data;

    const startDate = `${data.startDate}:00`;
    const endDate = `${data.endDate}:59`;

    try {
        const response = await axios.get(`http://localhost:8000/api/datauser`, {
            params: {
                startDate,
                endDate,
                sync_status: 0,
                "not-paginate": true,
            },
        });

        const total = response.data.data.length
        const records = response.data.data;


        if (total === 0 || records.length === 0) {
            socket.emit("hasil-progress", {
                status: "done",
                completed,
                success,
                failed,
                message: "No records to process.",
            });
            return;
        }


        for (const record of records) {

            if (completed === totalData) {
                console.log("All records have been processed.");
                break;
            }

            const paramsSimpanPerlintasan = {
                "nama_aplikasi": jenis,
                "waktu_kirim": formatDate(new Date()),
                "id_request": uuidv4(),
                "kode_kantor_imigrasi": record?.tpi_id.toUpperCase(),
                "id_perlintasan": "",
                "id_sticker": "",
                "refferal": "False",
                "tanggal_perlintasan": formatDate(new Date()),
                "kode_arah_perlintasan": record?.nationality === "Indonesia" ? "D" : "A",
                "status_perlintasan": record?.nationality === "Indonesia" ? "D" : "A",
                "id_bagian": "",
                "id_lokasi": record?.tpi_id.toUpperCase(),
                "id_tpi": record?.tpi_id.toUpperCase(),
                "kode_alat_angkut": "",
                "kode_jenis_dokumen_perjalanan": jenis,
                "nomor_dokumen_perjalanan": record?.no_passport,
                "kode_negara_penerbit_dokumen_perjalanan": record?.nationality === "Indonesia" ? "IDN" : "PNG",
                "tanggal_akhir_berlaku_dokumen_perjalanan": record?.expired_date,
                "id_tpi_luar_negeri": "",
                "id_jenis_visa": "",
                "nomor_visa": "",
                "tanggal_terbit_visa": "",
                "tanggal_akhir_penggunaan_visa": "",
                "tanggal_habis_berlaku_visa": "",
                "tanggal_habis_berlaku_ijin_tinggal": "",
                "nomor_kuitansi_voa": "",
                "harga_dalam_usd": "",
                "nama_belakang": "",
                "nama_depan": record?.name,
                "tanggal_lahir": record?.date_of_birth,
                "kode_jenis_kelamin": record?.gender,
                "kode_kewarganegaraan": record?.nationality === "Indonesia" ? "IDN" : "PNG",
                "id_alasan_rujukan": "",
                "catatan_rujukan": "",
                "waktu_penyelesaian_rujukan": "",
                "id_petugas_penyelesaian_rujukan": "",
                "catatan_penyelesaian_rujukan": "",
                "id_alasan_persetujuan": "",
                "catatan_persetujuan": "",
                "id_alasan_tidak_pindai_biometrik": "",
                "catatan_tidak_pindai_biometrik": "",
                "id_aturan_rujukan_perlintasan": "",
                "hasil_verifikasi_eac": "",
                "wajib_simpan": "0",
                "id_petugas": record?.petugas_id.toUpperCase(),
                "Mrz1": "",
                "Mrz2": "",
                "pindai_foto": record?.profile_image,
                "pindai_paspor": "",
                "pindai_paspor_ultraviolet": "",
                "pindai_paspor_infrared": "",
                "pindai_jari_jempol_kiri": "",
                "pindai_jari_telunjuk_kiri": "",
                "pindai_jari_tengah_kiri": "",
                "pindai_jari_manis_kiri": "",
                "pindai_jari_kelingking_kiri": "",
                "pindai_jari_jempol_kanan": "",
                "pindai_jari_telunjuk_kanan": "",
                "pindai_jari_tengah_kanan": "",
                "pindai_jari_manis_kanan": "",
                "pindai_jari_kelingking_kanan": "",
                "id_jenis_visa_pra_registrasi": "",
                "tanggal_rencana_kedatangan": "",
                "id_tpi_rencana_kedatangan": "",
                "tujuan_kedatangan": "",
                "alamat_tinggal_di_indonesia": "",
                "kota_tinggal_di_indonesia": "",
                "jumlah_hari_tinggal_di_indonesia": "",
                "kode_aplikasi_eksternal": "PLB",
                "id_imigrasi": "",
                "is_vitas_tka": "",
                "field_aplikasi_1": "",
                "field_aplikasi_2": "",
                "field_aplikasi_3": "",
                "field_aplikasi_4": "1",
                "foto_rfid": "",
                "is_status_deportasi": "False",
                "nomor_ijin_tinggal": "",
                "status_cekal": "TIDAK HIT",
                "visa_dan_izin_tinggal": "MODE PLB",
                "perlintasan_terakhir": "MODE PLB",
                "interpol": "MODE PLB",
                "periksa_alat_angkut": "MODE PLB",
                "periksa_paspor_lain": "MODE PLB",
                "validasi_paspor": "",
                "overstay": "",
                "status_paspor": "",
                "overstay_jumlah_hari_overstay": "",
                "overstay_total_overstay": "",
                "overstay_kompensasi_hari": "",
                "overstay_total_kompensasi": "",
                "overstay_alasan_kompensasi": "",
                "overstay_jumlah_hari_setelah_kompensasi": "",
                "overstay_total_setelah_kompensasi": "",
                "overstay_tarif_overstay_perhari": "",
                "overstay_tanggal_overstay": "",
                "overstay_tanggal_awal": "",
                "overstay_tanggal_akhir": "",
                "overstay_status_deportasi": "",
                "overstay_status_keputusan": "",
                "overstay_status_pembayaran": "",
                "overstay_status_overstay": "",
                "overstay_metode_pembayaran": "",
                "apk_version": `versi ${version}` || "versi 1.0",
                "ip_address_client": "10.8.10.3",
                "port_id": record?.tpi_id.toUpperCase(),
                "user_nip": userNip.toUpperCase(),
                "user_full_name": userFullName.toUpperCase(),
                "request_date_time": formatDate(new Date()),
                "keterangan_perlintasan": ""
            };
            try {
                const apiSimpanPerlintasan = await axios(
                    {
                        method: "post",
                        url: `http://10.18.14.246:1101/perlintasan/simpan`,
                        data: paramsSimpanPerlintasan,
                    }
                )

                writeLog("logs", {
                    record,
                    userNip,
                    params: paramsSimpanPerlintasan,
                    response: apiSimpanPerlintasan.data,
                }, logFileName);

                if (apiSimpanPerlintasan.data.response_code === "00") {
                    try {
                        const apiUpdateDataUser = await axios(
                            {
                                method: "patch",
                                url: `http://localhost:8000/api/update-sync-status`,
                                data: {
                                    no_passport: record.no_passport,
                                },
                            }
                        )
                        if (apiUpdateDataUser.data.status === 200) {
                            success++;
                            const dataLogParams = {
                                no_passport: record.no_passport,
                                id_petugas: userNip,
                                is_success: true,
                                start_date: startDate,
                                end_date: endDate,
                            }
                            await InsertLogTODB(dataLogParams);

                        } else {
                            failed++;
                            const dataLogParams = {
                                no_passport: record.no_passport,
                                id_petugas: userNip,
                                is_success: false,
                                start_date: startDate,
                                end_date: endDate,
                            }
                            await InsertLogTODB(dataLogParams);
                        }
                    } catch (error) {
                        failed++;
                        const dataLogParams = {
                            no_passport: record.no_passport,
                            id_petugas: userNip,
                            is_success: false,
                            start_date: startDate,
                            end_date: endDate,
                        }
                        await InsertLogTODB(dataLogParams);
                    }
                } else {
                    failed++;
                    const dataLogParams = {
                        no_passport: record.no_passport,
                        id_petugas: userNip,
                        is_success: false,
                        start_date: startDate,
                        end_date: endDate,
                    }
                    await InsertLogTODB(dataLogParams);
                }

            } catch (error) {
                console.error(`Error for record ID ${record.id}:`, error.message);
                failed++;
                const dataLogParams = {
                    no_passport: record.no_passport,
                    id_petugas: userNip,
                    is_success: false,
                    start_date: startDate,
                    end_date: endDate,
                }
                await InsertLogTODB(dataLogParams);
            }

            completed++;
            socket.emit("hasil-progress", {
                status: "in-progress",
                completed,
                success,
                failed,
                message: `Processing record ${completed} of ${total} ...`,
            });
        }

        onProgress = false;
        socket.emit("hasil-progress", {
            status: "done",
            completed,
            success,
            failed,
            message: "All records have been processed.",
        });

        setTimeout(() => {
            completed = 0;
            success = 0;
            failed = 0;
        }, 1000);
    } catch (error) {
        onProgress = false;
        completed = 0;
        success = 0;
        failed = 0;

        socket.emit("hasil-progress", {
            status: "error",
            completed,
            success,
            failed,
            message: "Error while calling the API-1.",
        });
        console.error("Error while calling the API:", error.message);
    }
};


async function InsertLogTODB(params) {
    try {
        const apiLogPelintas = await axios(
            {
                method: "post",
                url: `http://localhost:8000/api/log-simpan-pelintas`,
                data: params,
            }
        )

        if (apiLogPelintas.data.status === 200) {
            console.log("Success log pelintas");
        } else {
            console.log("Failed log pelintas");
        }
    } catch (error) {
        console.log("Error Insert Log to DB", error);
    }

}



io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("simpan-perlintasan", (data) => {
        onProgress = true;
        completed = 0;
        success = 0;
        failed = 0;
        console.log("# RECEIVED ACTION Save Crossing FROM FRONTEND #");
        handleSimpanPerlintasan(data, socket);
    });

    socket.on("check-progress", () => {
        if (onProgress) {
            socket.emit("hasil-progress", {
                status: "in-progress",
                completed,
                success,
                failed,
                message: "Processing records ...",
            });
        } else {
            socket.emit("hasil-progress", {
                status: "done",
                completed,
                success,
                failed,
                message: "All records have been processed.",
            });
        }
    });


    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});
