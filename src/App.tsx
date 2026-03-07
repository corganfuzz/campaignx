import { Provider } from '@react-spectrum/s2'
import { TopNav } from './components/layout/TopNav'
import { Sidebar } from './components/layout/Sidebar'
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
    submitApproval,
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
    <Provider colorScheme="dark">
      <div className="app">
        <TopNav onHome={goHome} />

        <div className="app-layout">
          <Sidebar
            activeView={view}
            onNavigate={(v) => v === 'home' ? goHome() : null}
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
                submitApproval={submitApproval}
              />
            )}
          </main>
        </div>
      </div>
    </Provider>
  )
}

export default App
