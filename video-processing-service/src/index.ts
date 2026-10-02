import express from "express";

import {
    setupDirectories,
    convertVideo,
    deleteProcessedVideo,
    deleteRawVideo,
    downloadRawVideo,
    uploadProcessedVideo

} from './storage'

setupDirectories()

const app = express();
app.use(express.json());

app.post("/process-video", async (req,res) => {

    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8')
        data = JSON.parse(message);
        if (!data.name) {
            throw new Error("Invalid message payload received")
        }
    } catch(error) {
        console.log(error);
        return res.status(400).send("Bad Request: Missing filename")
    }

    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;

    await downloadRawVideo(inputFileName);

    try {
        await convertVideo(inputFileName, outputFileName)
    } catch (err) {
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]);
        return res.status(500).send(`Processing Failed`)
    }

    await uploadProcessedVideo(outputFileName);

    await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]);
    
    return res.status(200).send('Proccessing Finished Successfully')

});



const port = process.env.PORT || 3000
app.listen(port, () => {

    console.log(`Video processing service listening on http://localhost:${port}`);

});