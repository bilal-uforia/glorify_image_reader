import express from "express";
import cors from "cors";
import { getImagesData } from "./Scrape/ImagesData.js";

export const app = new express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Glorify Images!')
});

app.post('/get-images', getImagesData);

// app.get("/get-images", getImagesData);