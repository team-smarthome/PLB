import axios from "axios";
import { url_dev, url_devel } from "./env";

const baseUrl = "http://192.168.2.100:8000/api"
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
      `http://${url}:8000/api/datauser`,
      body,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function apiGetDataLogRegister(params) {
  try {
    const response = await axios({
      method: "GET",
      url: `${baseUrl}/datauser`,
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
    const response = await axios.get(`http://${url}:8000/api/users`, {
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

export const getAllPetugas = async (params, page) => {
  try {
    const res = await axios({
      method: "get",
      url: `${baseUrl}/users`,
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

export const InsertPetugas = async (payload) => {
  try {
    const res = await axios({
      method: "post",
      url: `${baseUrl}/register`,
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
      url: `${baseUrl}/users/${id}`,
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
      url: `${baseUrl}/users/${id}`,
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
      url: `${baseUrl}/datauser/${params}`,
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
      url: `${baseUrl}/datauser/${params}`,
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
      url: `${baseUrl}/datauser/${params}`,
      data
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}
