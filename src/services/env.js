const currentOrigin = window.location.origin;
console.log(currentOrigin, "urlsaatiniBoy");

export const url_dev = `${currentOrigin}/api/`;
export const url_production = `${currentOrigin}/api/`;
export const url_devel = `${currentOrigin}/api/`;

export const url_pg_sendbox =
  "https://sandbox.plink.co.id/PrismaGateway/events/voa/v1.0/payment";
