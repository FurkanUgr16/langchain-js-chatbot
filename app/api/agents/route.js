import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/dist/output_parsers";

export async function GET() {
    try {
        const model = new ChatGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
        model: "gemini-2.5-flash",
        temperature: 0.7
    })

    const prompt = ChatPromptTemplate.fromTemplate("Bir {konu} hakkında kısa bir blog yazısı yaz.")
    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    const response = await chain.invoke({konu: "Yapay zeka"});

    console.log(response)

    return NextResponse.json(response)

    } catch (error) {
        console.error("Api Hatası", error)
        //return NextResponse.json({error: "Bir şeyler ters gitti"}, {status: 500})
    }

}