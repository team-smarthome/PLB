// const currentOrigin = window.location.origin;
// const url = new URL(currentOrigin);
// export const ipAddressServer = url.hostname;

// export const url_dev = `${currentOrigin}/PLB-API/public/`;
// export const url_production = `${currentOrigin}/PLB-API/public/api/`;
// export const url_devel = `${currentOrigin}/PLB-API/public/`;
// export const url_socket = `${currentOrigin}`;

//=========================================================LOKAL=========================================================

const currentOrigin = "http://127.0.0.1:8000";
const url = new URL(currentOrigin);
export const ipAddressServer = url.hostname;

export const url_dev = `${currentOrigin}/`;
export const url_production = `${currentOrigin}/api/`;
export const url_devel = `${currentOrigin}/`;
export const url_socket = `127.0.0.1`;
