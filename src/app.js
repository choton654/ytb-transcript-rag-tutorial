
import fs from 'fs'
import { getYoutubeTranscript } from "./getYtbTranscript.js";
import express from 'express';
import { connectToAstraDb, initMongooseVideoModel } from './astradbMongoose.js';
import dotenv from "dotenv"
dotenv.config();

const app = express();
const port = 3000;

connectToAstraDb()
initMongooseVideoModel()

app.use(express.json());

app.get('/', async (req, res) => {
    // res.sendFile(__dirname + '/index.html');

    const transcriptTxt = await getYoutubeTranscript('https://www.youtube.com/watch?v=qN_2fnOPY-M')
    // console.log('---transcriptTxt---',transcriptTxt);
    // var wstream = fs.createWriteStream('merge.txt');
    // wstream.write(transcriptTxt);
    res.send(transcriptTxt)
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