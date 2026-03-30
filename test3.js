import fs from 'fs';
fetch('https://integrate.api.nvidia.com/v1/embeddings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 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'
  },
  body: JSON.stringify({
    model: 'nvidia/llama-3.2-nemoretriever-300m-embed-v1',
    input: ['hello world'],
    input_type: 'query',
    encoding_format: 'float'
  })
})
.then(r => r.json())
.then(d => {
  console.log('Response:', d);
});
