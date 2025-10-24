import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';

// --- Configuração da API do Google Gemini ---

// Carrega a chave de API do ambiente. É crucial para a segurança que a chave não esteja no código-fonte.
const API_KEY = process.env.GOOGLE_API_KEY;

// Validação inicial: garante que a chave de API foi configurada antes de continuar.
if (!API_KEY) {
  throw new Error('Google API key is not set in environment variables');
}

// Inicializa o cliente da Google AI com a chave de API.
const genAI = new GoogleGenAI(API_KEY);

// --- Handler para Requisições POST ---

/**
 * Processa requisições POST para classificar texto usando a API do Google Gemini.
 * @param {NextRequest} req - O objeto da requisição, contendo o texto a ser classificado.
 * @returns {NextResponse} - Uma resposta JSON com a classificação do texto ou uma mensagem de erro.
 */
export async function POST(req: NextRequest) {
  try {
    // Extrai o texto do corpo da requisição JSON.
    const { text } = await req.json();

    // Validação de entrada: verifica se o texto é válido e não está vazio.
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texto inválido fornecido.' }, { status: 400 });
    }

    // --- Configurações de Segurança (Safety Settings) ---
    // Estas configurações instruem o modelo Gemini a bloquear conteúdo potencialmente prejudicial.
    // São aplicadas na inicialização do modelo para garantir que todas as interações sigam estas diretrizes.
    const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    // --- Engenharia de Prompt ---
    // O prompt é a instrução detalhada para a IA. Ele define:
    // 1. O papel da IA ("especialista em análise de texto").
    // 2. As categorias de classificação desejadas (Sentimento, Tonalidade, Intenção).
    // 3. O formato de saída obrigatório (JSON válido).
    // 4. O texto a ser analisado.
    const prompt = `Você é um especialista em análise de texto. Classifique o seguinte texto em três categorias:\n\n1. **Sentimento:** Positivo, Negativo ou Neutro.\n2. **Tonalidade:** Formal ou Informal.\n3. **Intenção:** Profissional, Pessoal, Transacional ou Informativo.\n\nResponda apenas com um objeto JSON válido contendo as chaves "sentimento", "tonalidade" e "intencao".\n\nTexto a ser analisado: '${text}'`;

    // Faz a chamada à API do Gemini com o prompt.
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings
    });
    let content = result.candidates[0].content.parts[0].text; // O conteúdo bruto da resposta da IA.

    // --- Pós-processamento da Resposta da IA ---
    // A IA pode ocasionalmente incluir marcadores de bloco de código Markdown (```json) na resposta.
    // Este bloco remove esses marcadores para garantir que o JSON seja parsável.
    content = content.trim();
    if (content.startsWith('```json') && content.endsWith('```')) {
      content = content.substring(7, content.length - 3).trim();
    }

    // Tenta fazer o parse do texto da resposta para um objeto JSON.
    const classification = JSON.parse(content);

    // Retorna a classificação em formato JSON para o frontend.
    return NextResponse.json(classification);

  } catch (error) {
    // --- Tratamento de Erros ---
    console.error('Erro na API route:', error);
    
    // Se o erro for de parsing, indica que a IA não retornou um JSON válido.
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Falha ao processar a resposta da IA. O formato retornado não é um JSON válido.' }, { status: 500 });
    }
    // Para outros erros internos, retorna uma mensagem genérica.
    return NextResponse.json({ error: 'Erro interno do servidor ao classificar o texto.' }, { status: 500 });
  }
}
