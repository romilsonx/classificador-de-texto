import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Esta será a nossa rota da API para classificação
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texto inválido fornecido.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY; // Usando GEMINI_API_KEY
    console.log('Valor da GEMINI_API_KEY lido no servidor:', apiKey ? 'Chave carregada (parcialmente visível)' : 'Chave não carregada');

    if (!apiKey) {
      console.error('Chave da API do Gemini não encontrada.');
      return NextResponse.json({ error: 'A chave da API do Gemini não foi configurada no servidor.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const prompt = `Você é um especialista em análise de texto. Classifique o seguinte texto em três categorias:

1. **Sentimento:** Positivo, Negativo ou Neutro.
2. **Tonalidade:** Formal ou Informal.
3. **Intenção:** Profissional, Pessoal, Transacional ou Informativo.

Responda apenas com um objeto JSON válido contendo as chaves "sentimento", "tonalidade" e "intencao".

Texto a ser analisado: '${text}'`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();
      console.log('Raw content from Gemini:', content);

      if (!content) {
        throw new Error('A API do Gemini retornou uma resposta vazia.');
      }

      let jsonString = content.trim(); // Aplica trim() aqui
      // Remove os marcadores de bloco de código Markdown se existirem
      if (jsonString.startsWith('```json') && jsonString.endsWith('```')) {
        jsonString = jsonString.substring(7, jsonString.length - 3).trim();
      }
      console.log('Processed jsonString:', jsonString);

      const classification = JSON.parse(jsonString);
      return NextResponse.json(classification);

    } catch (apiError) {
      console.error('Erro na chamada da API do Gemini:', apiError);
      return NextResponse.json({ error: 'Falha ao comunicar com a API do Gemini.' }, { status: 502 });
    }

  } catch (error) {
    console.error('Erro na API route:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
