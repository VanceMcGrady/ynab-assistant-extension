import { OpenAI } from 'openai';

export async function callOpenAI(prompt: string, apiKey: string) {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true, // Required for client-side usage
  });

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}
