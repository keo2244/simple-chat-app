const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'ຂໍໂທດ, ທ່ານສົ່ງຂໍ້ຄວາມຫຼາຍເກີນໄປ. ກະລຸນາລອງໃນ 15 ນາທີ.'
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'ກະລຸນາສົ່ງຂໍ້ຄວາມທີ່ຖືກຕ້ອງ',
        success: false
      });
    }

    // Create a conversational prompt in Lao
    const prompt = `ທ່ານແມ່ນ AI ຜູ້ຊ່ວຍທີ່ມີປະໂຍດ ແລະ ເປັນມິດ. ກະລຸນາຕອບເປັນພາສາລາວ. ໃຊ້ຄຳເວົ້າທີ່ສຸພາບແລະເປັນມິດ. ຫາກບໍ່ສາມາດຕອບໄດ້, ໃຫ້ອະທິບາຍດ້ວຍຄວາມສຸພາບ.
    
ຄຳຖາມ: ${message}

ຄຳຕອບ:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Handle different error types
    let errorMessage = 'ເກີດຂໍ້ຜິດພາດ, ກະລຸນາລອງໃໝ່ອີກຄັ້ງ';
    
    if (error.message?.includes('API key')) {
      errorMessage = 'ບັນຫາການຕັ້ງຄ່າ API key';
    } else if (error.message?.includes('quota')) {
      errorMessage = 'API ຖືກໃຊ້ເກີນຂີດຈຳກັດ, ກະລຸນາລອງໃນພາຍຫຼັງ';
    }

    res.status(500).json({
      error: errorMessage,
      success: false,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Simple Chat Backend',
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.GOOGLE_API_KEY
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'ບໍ່ພົບ endpoint ນີ້',
    success: false
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server ກຳລັງເຮັດວຽກຢູ່ port ${PORT}`);
  console.log(`🔑 Google API Key ຖືກຕັ້ງຄ່າ: ${process.env.GOOGLE_API_KEY ? '✅' : '❌'}`);
  console.log(`🌐 CORS enabled for: http://localhost:3000`);
});

module.exports = app;