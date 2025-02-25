import axios from "axios";

const TOKEN = process.env.NEXT_PUBLIC_TOKEN || "b838e522ef05c58cd2c71b3e29fc1393a900631fd8155f95be9eaf9d929460a8eb2145e2a9ea8243746bcbbcfe40b3b7f21293f6771ff0bdb594e2d046bc9132735bb81a2ea5d3e3982ceeee2ea514f0b1548067b6c35adad7f3a68293ab94f2d8db1efd2e0e432d30914545ea487f5aeda749ef8601f9ce38eee9e7a1f1fca6";
const API = axios.create({
    baseURL: "http://localhost:1337/api/",
    timeout: 1000000,
    headers: {
        Authorization: `Bearer ${TOKEN}`,
    },
});

export default API;
