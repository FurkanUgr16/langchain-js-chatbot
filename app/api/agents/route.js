import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";


export async function POST(req) {
    try {
        
        const {messages} = await req.json()

        if (!messages || messages.length === 0) {
            return new NextResponse(JSON.stringify({error: "Mesajlar bulunamadı"}), {status: 400, headers: {"Content-Type": "application/json"}})
        }

        const formattedMessages = [
            new SystemMessage(
                "Sen arkadaş canlısı türkçe yapay zeka asistanısın. Cevapların samimi anlaşılır ve arkadaşça olmalı kullanıcıya her zaman arkadaşıymışsın gibi davran"
            ),
            ...messages.map((message) => {
                if(message.sender === "user"){
                    return new HumanMessage(message.text)
                }else if( message.sender === "bot" && !message.isError){
                    return new AIMessage(message.text)
                }
                return null
            }).filter(Boolean)
        ];

        const model = new ChatGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_API_KEY,
            model: "gemini-2.5-flash",
            temperature: 0.7
        })

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const responseStream = await model.stream(formattedMessages)

                    for await (const chunk of responseStream){
                        if(chunk.content){
                            const encodedChunk = encoder.encode(chunk.content)
                            controller.enqueue(encodedChunk)
                        }
                    }
                } catch (error) {
                    console.error("Stream hatası", error)
                    controller.error(error)
                }finally{
                    controller.close()
                }
            }
        })

        
        return new Response(stream, {
            headers:{
                "Content-Type": "text/plain; charset=utf-8",
                "X-Content-Type-Options": "nosniff",
            }
        })
    } catch (error) {
        console.error("[CHAT_API_ERROR]", error)
        return new NextResponse(JSON.stringify({error: "Dahili sunucu hatası"}), 
        {
            status: 500,
            headers:{
                "Content-Type": "application/json"
            }
        })

    }
}

// export async function GET() {
//     try {
//         const model = new ChatGoogleGenerativeAI({
//         apiKey: process.env.GOOGLE_API_KEY,
//         model: "gemini-2.5-flash",
//         temperature: 0.7
//     })

//     const prompt = ChatPromptTemplate.fromTemplate("Bir {konu} hakkında kısa bir blog yazısı yaz.")
//     const chain = prompt.pipe(model).pipe(new StringOutputParser());

//     const response = await chain.invoke({konu: "Yapay zeka"});

//     console.log(response)

//     return NextResponse.json(response)

//     } catch (error) {
//         console.error("Api Hatası", error)
//         //return NextResponse.json({error: "Bir şeyler ters gitti"}, {status: 500})
//     }

// }