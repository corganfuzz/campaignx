import { TopNav } from './components/layout/TopNav'
import { Home } from './pages/Home'
import { BriefForm } from './pages/BriefForm'
import { LoadingPipeline } from './pages/LoadingPipeline'
import { Canvas } from './pages/Canvas'
import { useCampaign } from './hooks/useCampaign'
import type { Campaign } from './types'
import './App.css'

function App() {
  const {
    view,
    briefData,
    blueprints,
    pipelineSteps,
    progress,
    startNewCampaign,
    submitBrief,
    openPastCampaign,
    goHome,
  } = useCampaign()

  const handleOpenCampaign = (campaign: Campaign) => {
    if (campaign.blueprints.length > 0) {
      openPastCampaign(campaign.blueprints)
    } else {
      // Re-generate if no blueprints saved
      startNewCampaign()
    }
  }

  return (
    <div className="app">
      <TopNav
        view={view}
        onHome={goHome}
        onNewCampaign={() => startNewCampaign()}
      />

      <main className="app-main">
        {view === 'home' && (
          <Home
            onStartCampaign={startNewCampaign}
            onOpenCampaign={handleOpenCampaign}
          />
        )}

        {view === 'form' && (
          <BriefForm
            prefill={briefData}
            onSubmit={submitBrief}
            onBack={goHome}
          />
        )}

        {view === 'loading' && (
          <LoadingPipeline
            steps={pipelineSteps}
            progress={progress}
          />
        )}

        {view === 'canvas' && blueprints.length > 0 && (
          <Canvas
            blueprints={blueprints}
            onNewCampaign={() => startNewCampaign()}
            onBack={goHome}
          />
        )}
      </main>
    </div>
  )
}

export default App
