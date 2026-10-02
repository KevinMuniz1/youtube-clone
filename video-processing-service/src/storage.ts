import { Storage } from "@google-cloud/storage";
import fs from 'fs';
import ffmpeg from "fluent-ffmpeg";


const storage = new Storage();

const rawVideoBucket = "km-yt-clone-raw-videos";
const processedVideoBucket = "km-yt-clone-processed-videos";

const localRawVideoPath = "./localRawVideos";
const localProcessedVideoPath = "./localProcessedVideos"

export function setupDirectories() {
    ensureDirectoryExistence(localRawVideoPath)
    ensureDirectoryExistence(localProcessedVideoPath)

}

export function convertVideo(videoName: string, processedVideoName: string){
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${videoName}`)
            .outputOptions("-vf","scale=-1:360")
            .on("end", function (){
                console.log("Processing Video");
                resolve()
        })
        .on("error", function(err: any){
            console.log("Proccesing error");
            reject(err);
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`)
    });
}

function ensureDirectoryExistence(path: string){

    if (!fs.existsSync(path)){
        fs.mkdirSync(path, {recursive: true})
        console.log(`Path created at ${path}`)
    }

};

export async function downloadRawVideo(fileName: string){

    await storage.bucket(rawVideoBucket)
    .file(fileName)
    .download({
        destination: `${localRawVideoPath}/${fileName}`
    });

    console.log(`gs://${rawVideoBucket}/${fileName} downloaded to ${localRawVideoPath}/${fileName}`);
}

export async function uploadProcessedVideo(fileName: string){

    const bucket = storage.bucket(processedVideoBucket)

    await storage.bucket(processedVideoBucket)
    .upload(`${localProcessedVideoPath}/${fileName}`, {
        destination: fileName
    })

    console.log(`${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucket}/${fileName}`)

    //await bucket.file(fileName).makePublic()
}

export function deleteRawVideo(fileName: string){

    return deleteFile(`${localRawVideoPath}/${fileName}`)
}

export function deleteProcessedVideo(fileName: string){

    return deleteFile(`${localProcessedVideoPath}/${fileName}`)

}

function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve,reject) => {

        if(fs.existsSync(filePath)){
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Failed to delete file at ${filePath}`, err)
                    reject(err)
                } else{
                    console.log(`File deleted at ${filePath}`);
                    resolve();
                }
            });
        } else {
            console.log(`File not found at ${filePath}, skipping delete`);
            resolve();
        }
    });
}