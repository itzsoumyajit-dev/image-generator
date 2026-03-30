const NVIDIA_BASE_URL = '/api'
const MODEL = 'stabilityai/stable-diffusion-3-medium'

export async function generateImage(thought, style, apiKey) {
  const styleModifier = buildStyleModifier(style)
  const fullPrompt = `${styleModifier} ${thought}`.trim()

  const response = await fetch(`${NVIDIA_BASE_URL}/${MODEL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      prompt: fullPrompt,
    }),
  })

  // Check if it's JSON or plaintext error
  const resText = await response.text()
  let data
  try {
    data = JSON.parse(resText)
  } catch (e) {
    throw new Error(resText || `API error ${response.status}`)
  }

  if (!response.ok) {
    throw new Error(data?.detail || data?.error || `API error ${response.status}`)
  }

  // Expecting a base64 encoded image string in `image` field
  const base64Image = data?.image
  if (base64Image) {
    return `data:image/jpeg;base64,${base64Image}`
  }

  throw new Error('No image returned from the API')
}

function buildStyleModifier(style) {
  const styles = {
    precise: `Highly detailed, photorealistic, sharp focus, 8k resolution.`,
    creative: `Abstract, artistic, vibrant colors, dreamlike composition, digital art masterpiece.`,
    technical: `Blueprint style, schematic, technical drawing, crisp lines, geometric composition.`,
    concise: `Minimalist, clean geometry, negative space, vector art style, flat colors.`,
  }

  return styles[style] ?? styles.precise
}
