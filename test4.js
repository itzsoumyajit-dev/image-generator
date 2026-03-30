fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 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'
  },
  body: JSON.stringify({
    model: 'google/gemma-2-2b-it',
    messages: [{role: 'user', content: 'test'}],
    max_tokens: 10
  })
})
.then(r => r.json())
.then(d => console.log('Response:', d.choices ? 'Success' : d));
