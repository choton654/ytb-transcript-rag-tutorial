import mongoose from "mongoose";
import { driver, createAstraUri }  from "stargate-mongoose";

export const connectToAstraDb = async () => {
  const uri = createAstraUri(
    process.env.ASTRA_DB_API_ENDPOINT,
    process.env.ASTRA_DB_APPLICATION_TOKEN,
  );

  mongoose.set("autoCreate", true);
  mongoose.setDriver(driver);

  await mongoose.connect(uri, {
    isAstra: true,
  });
  console.log('astradb connected')
};


export const initMongooseVideoModel = async () => {
	// await mongoose.connection.dropCollection("videos");
	const Video = mongoose.model(
	  "Video",
	  new mongoose.Schema(
		{
		  title: String,
		  description: String,
		  url: String,
		  author: String,
		  thumbnail: String,
		  author_thumbnail: String,
		//   transcript: String,
		  $vector: {
			type: [Number],
			validate: (vector) => vector && vector.length === 384,
		  },
		},
		{
		  collectionOptions: {
			vector: {
			  size: 384, // size must be same as inserted vector size
			  function: "cosine",
			},
		  },
		},
	  ),
	);
	await Video.init();
};