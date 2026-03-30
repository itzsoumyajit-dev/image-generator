import fs from 'fs';
fetch('https://integrate.api.nvidia.com/v1/models', { headers: { 'Authorization': 'Bearer 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'} })
.then(r => r.json())
.then(d => {
  const models = d.data.map(m => m.id);
  const matched = models.filter(id => id.includes('nemo') || id.includes('embed'));
  fs.writeFileSync('models.json', JSON.stringify(matched, null, 2));
});
