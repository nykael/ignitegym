import axios from "axios";

export const api = axios.create({
    baseURL: 'http://10.10.149.70:3333'
})
