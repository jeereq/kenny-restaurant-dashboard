import axios from "axios";

const TOKEN = process.env.NEXT_PUBLIC_TOKEN || "2d70f9b912e0f73e2d5c7131961af6054bd9e20917d4302222a1205c0c4e153fcc9c1da782bfcfdf6cf73d4329761077a6e2921ff7c2f1877102a4a81b4c04e68fb511de5125434e614fe242065d1756b8e4199ba687f2ae5d0cb05d740eaaaed18137b0af3befd37b8f49074d314f0d936d0ff7b767ecc502b835ee336905b3";
const API = axios.create({
    baseURL: "https://kenny-api-dashboard.onrender.com/api/",
    timeout: 1000000,
    headers: {
        Authorization: `Bearer ${TOKEN}`,
    },
});

export default API;
