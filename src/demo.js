import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { HNSWLib } from "langchain/vectorstores/hnswlib";
// import { RetrievalQAChain } from "langchain/chains";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { PromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
// import { OpenAI } from "langchain/llms/openai";
import * as dotenv from "dotenv";
dotenv.config();

const loader = new PDFLoader("src/documents/bhagavad_gita.pdf");

const docs = await loader.load();

// splitter function
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 20,
});

// created chunks from pdf
const splittedDocs = await splitter.splitDocuments(docs);

// const embeddings = new OpenAIEmbeddings();
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", // 768 dimensions
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
});
// const vectorStore = await HNSWLib.fromDocuments(
//   splittedDocs,
//   embeddings
// );

const vectorStore = await MemoryVectorStore.fromDocuments(
  splittedDocs,
  embeddings
);

const prompt = PromptTemplate.fromTemplate(`What is karma`);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const combineDocsChain = await createStuffDocumentsChain({
  llm:model,
  prompt,
});

const vectorStoreRetriever = vectorStore.asRetriever();

// const model = new OpenAI({
//   modelName: 'gpt-3.5-turbo'
// });

// const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever);

const retrievalChain = await createRetrievalChain({
  combineDocsChain,
  retriever:vectorStoreRetriever,
});

const question = 'What is karma';

const answer = await retrievalChain.invoke()

// const answer = await chain.call({
//   query: question
// });
console.log({
  question,
  answer
});

const question1 = 'What is the budget allocated for railways?';
const answer1 = await chain.call({
  query: question1
});

console.log({
  question: question1,
  answer: answer1
});

// const question2 = 'what is PM Matsya Sampada Yojana?'
// const answer2 = await chain.call({
//   query: question2
// });
// console.log({
//   question: question2,
//   answer: answer2
// });




