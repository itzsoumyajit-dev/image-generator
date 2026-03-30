import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const key = process.env.VITE_NVIDIA_API_KEY

fetch('https://integrate.api.nvidia.com/v1/models', {
  headers: { 'Authorization': `Bearer ${key}` }
})
.then(r => r.json())
.then(d => {
  const models = d.data.map(m => m.id)
  console.log('Nemoretriever models:', models.filter(id => id.includes('nemoretriever')))
  console.log('Llama models:', models.filter(id => id.includes('llama') && id.includes('embed')))
})
.catch(e => console.error(e))
