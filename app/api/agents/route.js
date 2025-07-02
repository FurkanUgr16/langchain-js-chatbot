import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export async function GET() {
    try {
        const model = new ChatGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
        model: "gemini-2.5-flash",
        temperature: 0.7
    })

    const messages = [
        new SystemMessage("You are a helpful assistant"),
        new HumanMessage("Merhaba"),
    ]

    const response = await model.invoke(messages)

    console.log(response.content)

    return NextResponse.json(response.content)

    } catch (error) {
        console.error("Api Hatası", error)
        //return NextResponse.json({error: "Bir şeyler ters gitti"}, {status: 500})
    }

}