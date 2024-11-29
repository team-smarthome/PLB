import axios from "axios";
import { url_dev, url_devel } from "./env";

export async function apiPaymentHistory(header, body) {
  const apiUrl = `${url_dev}HistoryTransaction.php`;
  const headers = header;
  const requestBody = body;

  try {
    const response = await axios.post(apiUrl, requestBody, { headers });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function apiPaymentGateway(header, body) {
  const apiUrl = `${url_dev}ApplicationBank2.php`;
  const headers = header;
  const requestBody = body;

  try {
    const response = await axios.post(apiUrl, requestBody, { headers });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function apiPaymentGatewaySearch(header, body) {
  const apiUrl = `${url_dev}ApplicationVoaBank.php`;
  const headers = header;
  const requestBody = body;

  try {
    const response = await axios.post(apiUrl, requestBody, { headers });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function apiVoaPayment(header, body) {
  const apiUrl = `${url_dev}VoaApplication.php`;
  const headers = header;
  const requestBody = body;

  try {
    const response = await axios.post(apiUrl, requestBody, { headers });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function apiPblAddFaceRec(header, body) {
  console.log("Cookieapakahdapat", header);
  const apiUrl = `${url_dev}cgi-bin/entry.cgi/event/person-info`;
  const headers = header;
  const requestBody = body;

  try {
    const response = await axios.post(apiUrl, requestBody, { headers });
    return response;
  } catch (error) {
    throw error;
  }
}


export async function apiInsertDataUser(body, url) {
  try {
    const response = await axios.post(
      `${url_devel}api/datauser`,
      body,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function apiGetDataLogRegister(params) {
  try {
    const response = await axios({
      method: "GET",
      url: `${url_devel}api/datauser`,
      headers: {
        'Content-Type': 'application/json'
      },
      params
    })
    return response;
  } catch (error) {
    console.log(error)
  }
}
export const getDataPetugas = async (url, searchName) => {
  try {
    const response = await axios.get(`${url_devel}api/users`, {
      params: {
        name: searchName
      },
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
}

export const getDataUserAPI = async (filterParams) => {
  console.log("filterParams2", filterParams);
  try {
    const response = await axios.get(`${url_devel}api/datauser`, {
      params: filterParams,
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
}

export const getAllPetugas = async (params) => {
  try {
    const res = await axios({
      method: "get",
      url: `${url_devel}api/users`,
      headers: {
        'Content-Type': 'application/json'
      },
      params
    })
    return res;
  } catch (error) {
    throw error
  }
}

export const InsertPetugas = async (payload) => {
  try {
    const res = await axios({
      method: "post",
      url: `${url_devel}api/register`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    })
    return res;
  } catch (error) {
    console.log(error)
  }
}

export const UpdatePetugas = async (id, payload) => {
  try {
    const res = await axios({
      method: "PUT",
      url: `${url_devel}api/users/${id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    })
    return res;
  } catch (error) {
    console.log(error)
  }
}
export const DeletePetugas = async (id) => {
  try {
    const res = await axios({
      method: "delete",
      url: `${url_devel}api/users/${id}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return res;
  } catch (error) {
    console.log(error)
  }
}

export const getUserbyPassport = async (no_passport) => {
  try {
    const response = await axios.get(`${url_devel}api/datauser`, {
      params: {
        no_passport
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    return error.message
  }
}
export const loginCamera = async (ipCamera, payload) => {
  try {
    const res = await axios({
      url: `http://${ipCamera}/cgi-bin/entry.cgi/system/login`,
      method: "PUT",
      data: payload
    })
    return res
  } catch (error) {
    console.log(error)
  }
}

export const getDataUserByPassportNumber = async (params) => {
  try {
    const res = await axios({
      method: "GET",
      url: `${url_devel}api/datauser/${params}`,
    })
    return res
  } catch (error) {
    console.log(error)
  }
}


export const deleteDataUserPlb = async (params) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `${url_devel}api/datauser/${params}`,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}
export const editDataUserPlb = async (data, params) => {
  try {
    const res = await axios({
      method: "PUT",
      url: `${url_devel}api/datauser/${params}`,
      data
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}

export const apiInsertLog = async (data) => {
  try {
    const res = await axios({
      method: "post",
      url: `${url_devel}api/face-reg`,
      data
    })
    return res;
  } catch (error) {
    throw error
  }
}

export const apiDeleteLog = async (data) => {
  try {
    const res = await axios({
      method: "delete",
      url: `${url_devel}api/face-reg`,
      data
    })
    return res;
  } catch (error) {
    throw error
  }
}

export const simpanPelintas = async (data) => {
  try {
    const res = await axios({
      method: "post",
      url: `${url_devel}api/simpan-pelintas`,
      data
    })
    return res;
  } catch (error) {
    throw error
  }
}

export const getSimpanPelintas = async (data) => {
  try {
    const res = await axios({
      method: "get",
      url: `${url_devel}api/simpan-pelintas`,
      params: data
    })
    return res;
  } catch (error) {
    throw error
  }
}



export const apiInsertIP = async (data) => {
  console.log("Form_submitted", data)
  try {
    const res = await axios({
      method: "post",
      url: `${url_devel}api/ipconfig`,
      data
    })
    return res;
  } catch (error) {
    throw error;
  }
}

export const apiGetIp = async (params) => {
  try {
    const res = await axios.get(`${url_devel}api/ipconfig/${params}`);
    return res;
  } catch (error) {
    console.log(error)
  }
}

export const apiGetAllIp = async (params) => {
  try {
    const res = await axios.get(`${url_devel}api/ip-kamera/${params}`);
    return res;
  } catch (error) {
    console.log(error)
  }
}

// export const apiGetAllIpFilter = async (params) => {
//   console.log("params", params)
//   try {
//     const res = await axios.get(`${url_devel}api/ipconfig`, {
//       params
//     });
//     return res;
//   } catch (error) {
//     console.log(error)
//   }
// }

export const apiGetAllIpFilter = async (config) => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/ipconfig', config);
    return res;
  } catch (error) {
    console.log(error)
  }
};


export const apiEditIp = async (data, params) => {
  try {
    const res = await axios({
      method: "put",
      url: `${url_devel}api/ipconfig/${params}`,
      data
    });
    return res;
  } catch (error) {
    console.log(error)
  }
}

export const apiDeleteIp = async (params) => {
  try {
    const res = await axios({
      method: "delete",
      url: `${url_devel}api/ipconfig/${params}`
    });
    return res;
  } catch (error) {
    console.log(error)
  }
}

export const getDataLogApi = async (filterParams) => {
  try {
    const response = await axios.get(`${url_devel}api/face-reg`, {
      params: filterParams,
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const getAllNegaraData = async (params, page) => {
  try {
    const res = await axios({
      method: "get",
      url: `${url_devel}api/country`,
      headers: {
        'Content-Type': 'application/json'
      },
      params: { ...params, page }
    })
    return res;
  } catch (error) {
    console.log(error)
  }
}
export const InsertNegara = async (payload) => {
  try {
    const res = await axios({
      method: "post",
      url: `${url_devel}api/country`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    })
    return res;
  } catch (error) {
    console.log(error)
  }
}

export const UpdateNegara = async (id, payload) => {
  try {
    const res = await axios({
      method: "PUT",
      url: `${url_devel}api/country/${id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    })
    return res;
  } catch (error) {
    console.log(error)
  }
}
export const DeleteNegara = async (id) => {
  try {
    const res = await axios({
      method: "delete",
      url: `${url_devel}api/country/${id}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return res;
  } catch (error) {
    console.log(error)
  }
}


export const GetDataCheckCekal = async (params) => {
  try {
    const res = await axios.post(`${url_devel}api/cek-cekal`, params);
    return res;
  } catch (error) {
    console.log(error.response, 'ApakahErrorDisini')
    throw error
  }
}

export const checkCountData = async (date) => {
  try {
    const res = await axios({
      method: "GET",
      url: `${url_devel}api/totaluser`,
      params: date
    })
    return res
  } catch (error) {
    console.log(error)
  }
}

export const getAllTpiData = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: `${url_devel}api/tpi-data`,
      params: {
        alamat_tpi: "JAYAPURA"
      }
    })
    return res
  } catch (error) {
    console.log(error)
  }
}

export const getAllJabatanData = async (params, page) => {
  try {
    const res = await axios({
      method: "get",
      url: `${url_devel}api/jabatan`,
      headers: {
        'Content-Type': 'application/json'
      },
      params: { ...params, page }
    })
    return res;
  } catch (error) {
    console.log(error)
  }
}
export const InsertJabatan = async (payload) => {
  try {
    const res = await axios({
      method: "post",
      url: `${url_devel}api/jabatan`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    })
    return res;
  } catch (error) {
    console.log(error)
  }
}

export const UpdateJabatan = async (id, payload) => {
  try {
    const res = await axios({
      method: "PUT",
      url: `${url_devel}api/jabatan/${id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    })
    return res;
  } catch (error) {
    console.log(error)
  }
}
export const DeleteJabatan = async (id) => {
  try {
    const res = await axios({
      method: "delete",
      url: `${url_devel}api/jabatan/${id}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return res;
  } catch (error) {
    console.log(error)
  }
}

export const getAllSimpanPelintasApi = async (params) => {
  try {
    const res = await axios({
      url: `${url_devel}api/log-simpan-pelintas`,
      params,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return res
  } catch (error) {
    console.error(error)
  }

}

export const checkCountDataFaceReg = async (date) => {
  try {
    const res = await axios({
      method: "GET",
      url: `${url_devel}api/total-userFacereg`,
      params: date
    })
    return res
  } catch (error) {
    console.log(error)
  }
}