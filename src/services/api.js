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
    const response = await axios.get(`${url_devel}datauser`, {
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