import express from "express";
export const app = new express();
import { getImagesData } from "./Scrape/ImagesData.js";

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get("/get-images", getImagesData);