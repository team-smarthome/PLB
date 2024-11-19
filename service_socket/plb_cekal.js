const { default: axios } = require("axios");
const http = require("http");
const ping = require("ping");

let UserCekal = [];
let ipCameraData = [];

const server = http.createServer(function (request, response) {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Max-Age": 2592000,
        "Access-Control-Allow-Headers": "*",
    };
    if (request.method === "OPTIONS") {
        response.writeHead(204, headers);
        response.end();
        return;
    }
});


const formatBirthDateCekal = (formattedBirthDate) => {

    const dateParts = formattedBirthDate.split("-");
    const reformattedDate = dateParts.join("");
    return reformattedDate;
};

async function getDataKamera() {
    try {
        const { data } = await axios.get('http://localhost:8000/api/ip-kamera/SKOW');
        if (data.status === 200) {
            ipCameraData = data.data.map((item) => ({
                ipCamera: item.ipAddress,
                is_depart: item.is_depart,
            }));
        } else {
            console.error("Failed to fetch camera data: Invalid status");
        }
    } catch (error) {
        console.error("Error fetching camera data:", error.message);
    }
}


async function checkIpAccessible(ip) {
    try {
        const res = await ping.promise.probe(ip, { timeout: 2 });
        return res.alive;
    } catch (error) {
        console.error(`Error pinging IP ${ip}:`, error.message);
        return false;
    }
}


async function checkAllIpAccessibility() {
    const checkResults = await Promise.all(
        ipCameraData.map((camera) => checkIpAccessible(camera.ipCamera))
    );

    const allAccessible = checkResults.every((isAlive) => isAlive);
    return allAccessible;
}


async function DeleteUserCekal() {
    try {
        const deleteRequests = ipCameraData.map(async (ip) => {
            const url = `http://${ip?.ipCamera}/facial_api/aiot_call/service/sendPlatformInfo`;

            const data = UserCekal.map(personId => ({
                identityType: 1,
                deletePersonId: 1,
                personId: personId?.no_passport,
                reserve: ""
            }));

            try {
                const response = await axios.post(url, {
                    method: "delfaceinfonotify",
                    params: {
                        data: data
                    }
                });
                console.log("response delete", response.data);
                return { status: response?.data?.status, message: `Berhasil Menghapus data ke kamera dengan IP ${ip?.ipAddress}` };
            } catch (error) {
                console.log("error delete", error.message);
                return { status: 500, message: `Error ${error.message}` };
            }
        });

        const results = await Promise.all(deleteRequests);
        const allSuccessful = results.every(result => result.status === 0);
        const combinedMessage = results.map(result => result.message).join(', ');
        if (allSuccessful) {
            const { data: deleteUserApi } = await deleteDataCekalFromApi();

            if (deleteUserApi?.status === 200) {
                return { status: 200, message: combinedMessage };
            } else {
                return { status: 500, message: "Failed to delete data from API" };
            }
        } else {
            return { status: 500, message: combinedMessage };
        }
    } catch (error) {
        console.error("Error:", error);
    }
}


async function deleteDataCekalFromApi() {
    const dataUserCekalId = UserCekal.map(personId => personId?.id);

    const { data } = await axios.delete("http://localhost:8000/api/delete-user-cekal", {
        data: { id: dataUserCekalId },
        headers: {
            "Content-Type": "application/json",
        },
    });

    return data;
}

async function startCheckCekal() {
    try {
        const { data } = await axios.get("http://localhost:8000/api/datauser", {
            params: {
                "not-paginate": true,
            },
        });

        const records = data.data;


        for (const record of records) {
            const paramsCekal = {
                "nip": record?.petugas_id,
                "nama_lengkap": record?.name.toUpperCase(),
                "tanggal_lahir": formatBirthDateCekal(record?.date_of_birth),
                "kode_jenis_kelamin": record?.gender,
                "kode_kewarganegaraan": record?.nationality === "Indonesia" ? "IDN" : "PNG",
                "nomor_dokumen_perjalanan": record?.no_passport,
                "tanggal_habis_berlaku_dokumen_perjalanan": formatBirthDateCekal(record?.expired_date),
                "kode_negara_penerbit_dokumen_perjalanan": record?.nationality === "Indonesia" ? "IDN" : "PNG",
                "arah_perlintasan": record?.nationality === "Indonesia" ? "O" : "I",
                "apk_version": "versi 1.0.0",
                "ip_address_client": "10.8.10.3",
                "port_id": record?.tpi_id,
                "user_nip": record?.petugas_id.toUpperCase(),
                "user_full_name": record?.petugas_id.toUpperCase(),
            };

            const { data: responseCekal } = await axios.post("http://localhost:8000/api/cek-cekal", paramsCekal);

            if (responseCekal?.response_code === "25") {
                continue;
            } else if (responseCekal?.response_code === "00") {
                if (responseCekal?.data.length > 0) {
                    if (responseCekal?.data[0]?.skor_kemiripan === 100) {
                        UserCekal.push({
                            id: record?.id,
                            no_passport: record?.no_passport,
                        });
                    }
                }
                continue;
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }

    await main();
}


async function main() {
    console.log("cekal")
    try {
        await getDataKamera();
        if (ipCameraData.length === 0) {
            console.error("No camera data found.");
            throw new Error("Camera data is empty.");
        }

        const allIpsAccessible = await checkAllIpAccessibility();
        if (allIpsAccessible) {
            console.log("All IPs are accessible. Proceeding...");
            if (UserCekal.length > 0) {
                const deleteDataUSer = await DeleteUserCekal();
                if (deleteDataUSer?.status === 200) {
                    UserCekal = [];
                    console.log("Berhasil Menghapus data");
                } else {
                    console.error("Gagal Menghapus data");
                }
            }
        }
        await startCheckCekal();

    } catch (error) {
        console.error("Error:", error)
        console.log("Retrying...");
        await main();
    }
}

main().catch(console.error);
