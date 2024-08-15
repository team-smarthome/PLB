import { atom } from "jotai";

export const formData = atom({
    docNumber: "",
    formattedExpiryDate: "",
    fullName: "",
});
export const errorMessages = atom([]);