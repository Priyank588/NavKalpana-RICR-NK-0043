import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const testGroqAPI = async () => {
  console.log('🧪 Testing Groq API Connection\n');
  
  // Check environment variable
  console.log('1️⃣ Checking environment variable:');
  console.log('   GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
  console.log('   GROQ_API_KEY length:', process.env.GROQ_API_KEY?.length || 0);
  
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.trim() === '' || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
    console.log('\n❌ GROQ_API_KEY is not configured in .env file');
    console.log('\n📋 Steps to fix:');
    console.log('   1. Go to: https://console.groq.com');
    console.log('   2. Sign up or login');
    console.log('   3. Go to "API Keys" section');
    console.log('   4. Create a new API key');
    console.log('   5. Copy the key (starts with gsk_...)');
    console.log('   6. Open backend/.env file');
    console.log('   7. Replace the line: GROQ_API_KEY=your_groq_api_key_here');
    console.log('   8. With: GROQ_API_KEY=gsk_your_actual_key_here');
    console.log('   9. Save the file');
    console.log('   10. Restart the backend server\n');
    process.exit(1);
  }
  
  console.log('   ✅ API key is configured');
  console.log('   Key starts with:', process.env.GROQ_API_KEY.substring(0, 10) + '...\n');
  
  console.log('2️⃣ Initializing Groq client...');
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
    console.log('   ✅ Client initialized successfully\n');
    
    console.log('3️⃣ Testing API with simple prompt...');
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Respond with a simple greeting."
        },
        {
          role: "user",
          content: "Say hello to FitAI!"
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 100,
    });
    
    const response = completion.choices[0]?.message?.content || '';
    console.log('   ✅ API Response received:');
    console.log('   ' + '─'.repeat(60));
    console.log('   ' + response);
    console.log('   ' + '─'.repeat(60) + '\n');
    
    console.log('4️⃣ Testing JSON response...');
    const jsonCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Always respond with valid JSON only, no markdown."
        },
        {
          role: "user",
          content: 'Generate a simple JSON object: {"status": "working", "message": "Groq API is connected!"}'
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      max_tokens: 100,
    });
    
    const jsonText = jsonCompletion.choices[0]?.message?.content || '';
    let cleanJson = jsonText.trim();
    cleanJson = cleanJson.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const parsed = JSON.parse(cleanJson);
    console.log('   ✅ JSON Response parsed successfully:');
    console.log('   ', JSON.stringify(parsed, null, 2) + '\n');
    
    console.log('🎉 SUCCESS! Groq API is working correctly!\n');
    console.log('✅ Your FitAI app will now use AI for:');
    console.log('   • Personalized workout generation');
    console.log('   • Customized diet plans');
    console.log('   • Intelligent chatbot responses');
    console.log('   • Plans that respect injuries and allergies\n');
    
    console.log('💡 Next steps:');
    console.log('   1. Restart your backend server if it\'s running');
    console.log('   2. Generate a new workout plan');
    console.log('   3. Generate a new diet plan');
    console.log('   4. Ask the AI chatbot a question\n');
    
  } catch (error) {
    console.log('\n❌ ERROR: Failed to connect to Groq API');
    console.log('   Error message:', error.message);
    
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      console.log('\n💡 Your API key appears to be invalid.');
      console.log('   1. Go to: https://console.groq.com');
      console.log('   2. Check if your API key is correct');
      console.log('   3. Create a new API key if needed');
      console.log('   4. Update backend/.env with the new key');
      console.log('   5. Make sure there are no extra spaces');
    } else if (error.message.includes('429') || error.message.includes('rate limit')) {
      console.log('\n💡 Rate limit exceeded.');
      console.log('   You may have hit the free tier limit.');
      console.log('   Wait a moment and try again.');
    } else {
      console.log('\n💡 Unexpected error. Check:');
      console.log('   1. Internet connection');
      console.log('   2. API key is correct (no extra spaces)');
      console.log('   3. Groq API service status');
    }
    
    process.exit(1);
  }
};

testGroqAPI();
