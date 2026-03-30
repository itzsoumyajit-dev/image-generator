fetch('https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-3-medium', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer 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`
  },
  body: JSON.stringify({
    prompt: 'A cute cat',
  })
})
.then(async r => {
  const text = await r.text();
  console.log('Status:', r.status);
  try {
    const d = JSON.parse(text);
    console.log('Error:', JSON.stringify(d, null, 2));
  } catch(e) {}
})
