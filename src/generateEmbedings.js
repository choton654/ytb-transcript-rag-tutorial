import { HfInference } from "@huggingface/inference";
import { pipeline } from '@xenova/transformers';
import {config} from 'dotenv';
config({path:'.env'})
const hf = new HfInference(process.env.HF_TOKEN);

// const myHeaders = new Headers();
// myHeaders.append("Content-Type", "application/json");


export const generateEmbedings = async (prompt) => {

    
//// create embeddings  with hugging face with access token ////

    // const output1 = await hf.featureExtraction({
    //     model: 'sentence-transformers/all-MiniLM-L6-v2',
    //     inputs: prompt,
    //   });
    //   return output1 


    
//// create embeddings locally with transformer model ////

    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    const output1 = await extractor(prompt, { pooling: 'mean', normalize: true });


      return output1 && Object.values(output1.data)
}



// fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.GOOGLE_API_KEY}`, {
    //     method: "POST",
    //     headers: myHeaders,
    //     body: JSON.stringify({
    //         "model": "models/text-embedding-004",
    //         "content": {
    //             "parts": [{
    //                 "text": prompt
    //             }],
    //             "task_type": "RETRIEVAL_DOCUMENT",
    //         },
    //     }),
    //     redirect: "follow"
    // })
    //     .then((response) => response.text())
    //     .then((result) => console.log('---res---',result))
    //     .catch((error) => console.error('---err---',error));