import axios from "axios";
import { url_dev, url_dev2, url_pg_sendbox } from "./env";

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

export async function apiValidationPassport(header, body) {
  const apiUrl = `${url_dev}api/visa/application/passport-validation`;

  const headers = header;

  const requestBody = body;

  try {
    const response = await axios.post(apiUrl, requestBody, { headers });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function apiCheckStatus(header, body) {
  const apiUrl = `${url_dev}CheckStatus.php`;

  const headers = header;

  const requestBody = body;

  try {
    const response = await axios.post(apiUrl, requestBody, { headers });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function apiSimpanPermohonan(header, body) {
  const apiUrl = `${url_dev}api/visa/application`;

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
  const apiUrl = `${url_dev}ApplicationBank.php`;
  const headers = header;
  const requestBody = body;

  try {
    const response = await axios.post(apiUrl, requestBody, { headers });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function apiUpdatePayment(header, body) {
  const apiUrl = `${url_dev}api/bri/update-payment`;

  const headers = header;

  const requestBody = body;

  try {
    const response = await axios.post(apiUrl, requestBody, { headers });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function apiPGToken(header, body) {
  const apiUrl = `${url_pg_sendbox}`;

  const headers = header;

  const requestBody = body;

  try {
    const response = await axios.post(apiUrl, requestBody, { headers });
    return response;
  } catch (error) {
    throw error;
  }
}
