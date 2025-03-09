require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const ZUPER_API_URL = "https://us-west-1c.zuperpro.com/api";

app.get("/jobs", async (req, res) => {
    try {
        const response = await axios.get(
            `${ZUPER_API_URL}/jobs`,
            {
                headers: {
                    "accept": "application/json",
                    "x-api-key": `${process.env.ZUPER_API_KEY}`
                }
            }
        );
        
        // Return all jobs data
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.message,
            details: error.response?.data || "Unknown error",
        });
    }
});

app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
