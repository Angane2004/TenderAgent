# Local LLM Setup Guide (No API Keys Required!)

## Why Local LLM?

✅ **Free** - No API costs
✅ **Private** - Data stays on your machine  
✅ **Fast** - No network latency
✅ **Unlimited** - No rate limits or quotas

## Quick Start (5 minutes)

### Step 1: Install Ollama

**Windows:**
Download from https://ollama.ai/download and run the installer.

**Mac:**
```bash
curl https://ollama.ai/install.sh | sh
```

**Linux:**
```bash
curl https://ollama.ai/install.sh | sh
```

### Step 2: Download a Model

After installation, open a terminal and run:

```bash
# Recommended: Llama 2 (7B - Good balance of speed and quality)
ollama pull llama2

# OR other options:
ollama pull mistral      # Faster, good for quick tasks
ollama pull codellama    # Best for code-related tasks
ollama pull phi          # Smallest, fastest (3B)
ollama pull neural-chat  # Good conversational model
```

### Step 3: Verify Installation

```bash
# Check if Ollama is running
ollama list

# Test with a simple prompt
ollama run llama2 "Hello, how are you?"
```

You should see a response! Ollama is now ready.

### Step 4: Configure TenderAI

Add to your `.env.local`:

```env
NEXT_PUBLIC_OLLAMA_URL=http://localhost:11434
NEXT_PUBLIC_OLLAMA_MODEL=llama2
AI_PROVIDER=local
```

### Step 5: Start Your App

```bash
npm run dev
```

That's it! Your AI agents now run locally with **zero API costs**.

## Model Recommendations

| Model | Size | Best For | Speed |
|-------|------|----------|-------|
| **llama2** | 7B | General purpose, balanced | ⭐⭐⭐ |
| **mistral** | 7B | Fast responses, good quality | ⭐⭐⭐⭐ |
| **codellama** | 7B | Code generation, technical | ⭐⭐⭐ |
| **phi** | 3B | Ultra-fast, basic tasks | ⭐⭐⭐⭐⭐ |
| **neural-chat** | 7B | Conversational, friendly | ⭐⭐⭐ |

## Advanced: GPU Acceleration

If you have an NVIDIA GPU, Ollama automatically uses it! This makes models 10x faster.

Check GPU usage:
```bash
nvidia-smi  # See GPU activity while running models
```

## Troubleshooting

### Ollama not found?

Make sure Ollama is running:
```bash
# Windows: Check if Ollama.exe is running in Task Manager
# Mac/Linux:
ps aux | grep ollama
```

Restart Ollama:
```bash
ollama serve
```

### Model too slow?

Try a smaller model:
```bash
ollama pull phi  # Much faster, still capable
```

### Out of memory?

Use quantized versions (automatically used by Ollama) or reduce `num_predict` in the code.

## Alternative: LM Studio

Don't want to use Ollama? Try LM Studio (https://lmstudio.ai):

1. Download LM Studio
2. Download any GGUF model
3. Start local server (usually http://localhost:1234)
4. Update `.env.local`:
   ```env
   NEXT_PUBLIC_OLLAMA_URL=http://localhost:1234
   ```

## Cost Comparison

| Provider | Monthly Cost (1000 RFPs) |
|----------|-------------------------|
| **Local LLM (Ollama)** | **₹0 (FREE!)** |
| OpenAI GPT-4 | ₹30,000 - ₹50,000 |
| Anthropic Claude | ₹35,000 - ₹60,000 |
| Google Gemini | ₹10,000 - ₹30,000 |

## Features Enabled

With local LLM, all AI features work:

✅ RFP analysis and extraction
✅ Product matching recommendations
✅ Win probability calculation
✅ Pricing strategy suggestions
✅ Scope of supply generation
✅ Technical compliance checking

## Performance Tips

1. **First run is slow** - Model loads into memory (~4-7GB)
2. **Subsequent calls are fast** - Model stays in RAM
3. **Use GPU if available** - 10x faster than CPU
4. **Smaller models for simple tasks** - Use phi for quick extractions
5. **Batch processing** - Process multiple RFPs together

## Production Deployment

For production (Vercel, Netlify, etc.), you have two options:

### Option 1: Self-hosted Ollama server
- Deploy Ollama on a VPS with GPU
- Point `NEXT_PUBLIC_OLLAMA_URL` to your server
- Cost: ~$30-50/month for GPU VPS

### Option 2: Hybrid approach
- Use local LLM for development
- Switch to cloud API for production
- Update `AI_PROVIDER` in production env

## Hackathon Note

Using local LLM shows:
✅ **Innovation** - Cutting-edge local AI
✅ **Cost-effectiveness** - Zero API costs
✅ **Privacy** - Data never leaves your machine
✅ **Scalability** - No rate limits

Perfect for hackathon demos and production MVP!
