// const currentOrigin = window.location.origin;
const currentOrigin = "http://192.168.2.100";
const url = new URL(currentOrigin);
export const ipAddressServer = url.hostname;

export const url_dev = `${currentOrigin}/PLB-API/public/`;
export const url_production = `${currentOrigin}/PLB-API/public/api/`;
export const url_devel = `${currentOrigin}/PLB-API/public/`;
export const url_socket = `${currentOrigin}`;

export const url_pg_sendbox =
    "https://sandbox.plink.co.id/PrismaGateway/events/voa/v1.0/payment";