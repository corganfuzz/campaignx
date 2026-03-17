import MagicWand from '@spectrum-icons/workflow/MagicWand'
import type { LoadingPipelineProps } from '../types'
import { AI_COMMENTARY } from '../data/mockData'
import './LoadingPipeline.css'





export const LoadingPipeline = ({ steps, progress }: LoadingPipelineProps) => {
  const runningStep = steps.findIndex((s) => s.status === 'running')
  const commentary = AI_COMMENTARY[runningStep] ?? AI_COMMENTARY[AI_COMMENTARY.length - 1]

  return (
    <div className="pipeline-page">
      <div className="pipeline-container">
        <div className="pipeline-header">
          <div className="pipeline-spinner" />
          <h2 className="pipeline-title">Generating Campaign Assets</h2>
          <p className="pipeline-sub">AI is working across your brand knowledge base and Bedrock models</p>
        </div>

        {/* Progress bar */}
        <div className="pipeline-progress-wrap">
          <div className="pipeline-progress-bar">
            <div
              className="pipeline-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="pipeline-progress-pct">{progress}%</span>
        </div>

        {/* Steps */}
        <div className="pipeline-steps">
          {steps.map((step) => (
            <div key={step.id} className={`pipeline-step ${step.status}`}>
              <div className="pipeline-step-icon">
                {step.status === 'done' && '✓'}
                {step.status === 'running' && <span className="mini-spinner" />}
                {step.status === 'pending' && '○'}
              </div>
              <span className="pipeline-step-label">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Live commentary */}
        {runningStep >= 0 && (
          <div className="pipeline-commentary">
            <span className="commentary-icon" style={{ display: 'flex', alignItems: 'center' }}><MagicWand size="S" /></span>
            <span className="commentary-text">"{commentary}"</span>
          </div>
        )}
      </div>
    </div>
  )
}
