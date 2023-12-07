import axios from "axios";
import { url_dev } from "./env";

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
