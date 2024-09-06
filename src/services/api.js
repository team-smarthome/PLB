import axios from "axios";
import { url_dev } from "./env";

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
      url: "http://192.168.2.143:8000/api/datauser",
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