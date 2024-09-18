
import fs from 'fs'
import { getYoutubeTranscript } from "./getYtbTranscript.js";
import express from 'express';
import { connectToAstraDb, initMongooseVideoModel } from './astradbMongoose.js';
import dotenv from "dotenv"
import { generateEmbedings } from './generateEmbedings.js';
import { addVideoToAstra } from './addVideoToAstra.js';
dotenv.config();

const app = express();
const port = 3000;

connectToAstraDb()
initMongooseVideoModel()

app.use(express.json());

app.get('/', async (req, res) => {
    // res.sendFile(__dirname + '/index.html');
    // https://www.youtube.com/watch?v=qN_2fnOPY-M
    // 'https://www.youtube.com/watch?v=aO1-6X_f74M'
    // const transcriptTxt = await getYoutubeTranscript('https://www.youtube.com/watch?v=QdDoFfkVkcw')
    // const embds = await generateEmbedings(transcriptTxt)
    const dbData =  await addVideoToAstra('https://www.youtube.com/watch?v=qN_2fnOPY-M')
    // console.log('---dbData---',embds);
    // var wstream = fs.createWriteStream('merge.txt');
    // wstream.write(transcriptTxt);
    res.status(200).json({dbData})
});

// app.post('/', async (req, res) => {
// 	const urlAddress = req.body.urlAddress;
// 	let messages = req.body.messages || [];
// 	console.log(`urlAddress: ${urlAddress}`)
// 	let video = await addVideoToAstra(urlAddress);
// 	messages = await addChatGPTresponse(video, messages)

// 	res.send({
// 		video,
// 		messages
// 	});

// });

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});




// import { YoutubeTranscript } from "youtube-transcript";
// YoutubeTranscript.fetchTranscript('https://www.youtube.com/watch?v=qN_2fnOPY-M').then(d => {
//     console.log(d);
// });