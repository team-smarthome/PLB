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
