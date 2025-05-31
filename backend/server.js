import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;
const BASE_URL = "https://newsapi.org/v2/everything?q=";

app.use(cors());

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' blob:; connect-src 'self';"
  );
  next();
});

app.get('/news', async(req, res)=>{
    const query = req.query.q || "India";
    try{
        const response = await fetch(`${BASE_URL}${encodeURIComponent(query)}&apiKey=${API_KEY}`);
        const data = await response.json();
        res.json(data);
    }catch(error){
        res.status(500).json({error: 'Failed to fetch news'});
    }
});

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});