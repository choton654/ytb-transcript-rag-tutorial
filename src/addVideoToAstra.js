import mongoose from "mongoose";

import { getYoutubeTranscript }  from './getYtbTranscript.js'
import { generateEmbedings }  from "./generateEmbedings.js";
import { getYoutubeVideoInfo }  from "./getYoutubeVideoInfo.js";

export const addVideoToAstra = async (url) => {
	try {
		
		const Video = mongoose.model("Video");
  
		const videoUrl = url
		console.log(`videoUrl`, videoUrl)
		const existingVideo = await Video.findOne({ url: videoUrl });
  
		if (existingVideo) {
		  console.log("Video already exists in the database");
		  
		  return {
			addedToAstra: false,
			...existingVideo.toJSON()
		}
		} else {
		  let transcript = await getYoutubeTranscript(videoUrl)
		  let vector = await generateEmbedings(transcript)
		  let videoInfo = await getYoutubeVideoInfo(videoUrl)
		  let addedVideo = await Video.create({
			  ...videoInfo,
			  url: videoUrl,
			//   transcript,
			  $vector: vector
		  })
		  console.log("Video inserted into the database");
		  return {
				addedToAstra: true,
				...addedVideo.toJSON()
			}
		}
		
	  } catch (e) {
		console.error(e);
	  }
};
