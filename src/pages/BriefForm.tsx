import { useState } from 'react'
import { REGIONS } from '../data/mockData'
import type { BriefFormData } from '../types'
import './BriefForm.css'

interface BriefFormProps {
  prefill: BriefFormData | null
  onSubmit: (data: BriefFormData) => void
  onBack: () => void
}

export const BriefForm = ({ prefill, onSubmit, onBack }: BriefFormProps) => {
  const [products, setProducts] = useState<string[]>(prefill?.products ?? ['', ''])
  const [region, setRegion] = useState(prefill?.region ?? 'brazil')
  const [audience, setAudience] = useState(prefill?.audience ?? '')
  const [message, setMessage] = useState(prefill?.message ?? '')
  const [language, setLanguage] = useState(prefill?.language ?? 'pt-BR')
  const [briefFile, setBriefFile] = useState<File | null>(null)

  const handleBriefFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBriefFile(file)
    const text = await file.text()
    try {
      let parsed: Partial<BriefFormData> = {}
      if (file.name.endsWith('.json')) {
        parsed = JSON.parse(text)
      } else {
        // Basic YAML key: value parser (no library needed for simple flat YAML)
        parsed = Object.fromEntries(
          text.split('\n')
            .filter(l => l.includes(':'))
            .map(l => {
              const [k, ...v] = l.split(':')
              return [k.trim(), v.join(':').trim()]
            })
        ) as Partial<BriefFormData>
      }
      if (parsed.products) setProducts(Array.isArray(parsed.products) ? parsed.products : [parsed.products as unknown as string])
      if (parsed.region) setRegion(parsed.region)
      if (parsed.audience) setAudience(parsed.audience)
      if (parsed.message) setMessage(parsed.message)
      if (parsed.language) setLanguage(parsed.language)
    } catch {
      alert('Could not parse file. Please check the format.')
    }
  }

  const selectedRegion = REGIONS.find((r) => r.key === region)

  const handleRegionChange = (key: string) => {
    setRegion(key)
    const r = REGIONS.find((r) => r.key === key)
    if (r) setLanguage(r.langCode)
  }

  const addProduct = () => setProducts((p) => [...p, ''])
  const removeProduct = (i: number) => setProducts((p) => p.filter((_, idx) => idx !== i))
  const updateProduct = (i: number, val: string) =>
    setProducts((p) => p.map((v, idx) => (idx === i ? val : v)))

  const canSubmit = products.filter((p) => p.trim()).length >= 2 && audience.trim() && message.trim()

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit({
      products: products.filter((p) => p.trim()),
      region,
      audience,
      message,
      language,
    })
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <button className="form-back" onClick={onBack}>
            ← Back
          </button>
          <h2 className="form-title">📋 Campaign Brief</h2>
          <p className="form-sub">Fill in the details below to generate your campaign assets</p>
        </div>

        {/* Products */}
        <div className="form-section">
          <label className="form-label">
            Products <span className="form-required">min. 2</span>
          </label>
          <div className="form-products">
            {products.map((p, i) => (
              <div key={i} className="form-product-row">
                <input
                  className="form-input"
                  placeholder={`Product ${i + 1} (e.g. Dove Shampoo)`}
                  value={p}
                  onChange={(e) => updateProduct(i, e.target.value)}
                />
                {products.length > 2 && (
                  <button className="form-remove-btn" onClick={() => removeProduct(i)}>
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button className="form-add-btn" onClick={addProduct}>
              + Add product
            </button>
          </div>
        </div>

        {/* Region */}
        <div className="form-section">
          <label className="form-label">Target Region / Market</label>
          <div className="form-region-grid">
            {REGIONS.map((r) => (
              <button
                key={r.key}
                className={`form-region-btn ${region === r.key ? 'selected' : ''}`}
                onClick={() => handleRegionChange(r.key)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audience */}
        <div className="form-section">
          <label className="form-label">Target Audience</label>
          <input
            className="form-input"
            placeholder="e.g. Women aged 25-40, urban professionals"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />
        </div>

        {/* Message */}
        <div className="form-section">
          <label className="form-label">Campaign Message</label>
          <textarea
            className="form-textarea"
            placeholder="e.g. Feel fresh every day"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>

        {/* Language */}
        <div className="form-section">
          <label className="form-label">Language</label>
          <div className="form-lang-info">
            <span className="form-lang-badge">
              {selectedRegion?.label} — {selectedRegion?.lang}
            </span>
            <span className="form-lang-note">Auto-suggested based on region</span>
          </div>
        </div>

        {/* Brief File Upload */}
        <div className="form-section">
          <label className="form-label">
            Import Brief File <span className="form-optional">optional — JSON or YAML</span>
          </label>
          <div
            className={`form-dropzone ${briefFile ? 'loaded' : ''}`}
            onClick={() => document.getElementById('brief-file-input')?.click()}
          >
            <input
              id="brief-file-input"
              type="file"
              accept=".json,.yaml,.yml"
              style={{ display: 'none' }}
              onChange={handleBriefFileUpload}
            />
            {briefFile ? (
              <>
                <div className="form-dropzone-icon">✅</div>
                <div className="form-dropzone-text">{briefFile.name}</div>
                <div className="form-dropzone-sub">Brief loaded — form fields pre-filled</div>
              </>
            ) : (
              <>
                <div className="form-dropzone-icon">📄</div>
                <div className="form-dropzone-text">Upload brief.json or brief.yaml</div>
                <div className="form-dropzone-sub">Auto-fills all fields below</div>
              </>
            )}
          </div>
        </div>

        {/* Brand Asset Upload */}
        <div className="form-section">
          <label className="form-label">
            Existing Brand Assets <span className="form-optional">optional</span>
          </label>
          <div className="form-dropzone">
            <div className="form-dropzone-icon">📎</div>
            <div className="form-dropzone-text">Drop images here or click to upload</div>
            <div className="form-dropzone-sub">If skipped, AI will generate all images</div>
          </div>
        </div>

        {/* Submit */}
        <button
          className={`form-submit ${canSubmit ? '' : 'disabled'}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          🚀 Generate Campaign Assets
        </button>

        {!canSubmit && (
          <p className="form-hint">Add at least 2 products, an audience, and a message to continue</p>
        )}
      </div>
    </div>
  )
}
