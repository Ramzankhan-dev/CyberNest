const express = require("express");
const axios = require("axios");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const BASE_URL = "http://172.0.1.124:8080";

const USERNAME = "admin";
const PASSWORD = "admin123";

let sessionCookie = null;

// MD5 Hash Function (Browser same behavior)
function md5(text) {
    return crypto.createHash("md5").update(text).digest("hex").toUpperCase();
}

// LOGIN FUNCTION
async function login() {

    const hashedPassword = md5(PASSWORD);

    const response = await axios.post(
        `${BASE_URL}/rest/public/auth/login`,
        {
            login: USERNAME,
            password: hashedPassword
        },
        {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Origin": BASE_URL,
                "Referer": BASE_URL + "/"
            }
        }
    );

    const cookies = response.headers["set-cookie"];

    if (cookies && cookies.length > 0) {
        // Save all cookies
        sessionCookie = cookies.map(c => c.split(";")[0]).join("; ");
        console.log("✅ Login successful");
    } else {
        throw new Error("Login failed");
    }
}

// DEVICES API
app.post("/api/devices", async (req, res) => {

    try {

        if (!sessionCookie) {
            await login();
        }

        const response = await axios.post(
            `${BASE_URL}/rest/private/devices/search`,
            {
                page: 0,
                size: 10,
                criteria: {}
            },
            {
                headers: {
                    "Cookie": sessionCookie,
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "Origin": BASE_URL,
                    "Referer": BASE_URL + "/"
                }
            }
        );

        res.json(response.data);

    } catch (error) {

        console.log("ERROR:", error.response?.status);
        console.log("DATA:", error.response?.data);

        res.status(500).json({ error: "Headwind request failed" });
    }
});

app.listen(3000, () => {
    console.log("🚀 Proxy running on http://localhost:3000");
});