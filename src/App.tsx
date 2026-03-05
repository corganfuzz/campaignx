import { Provider } from '@react-spectrum/s2';
import { useNavigate, useHref, type NavigateOptions, Routes, Route } from 'react-router';

// Configure the type of the `routerOptions` prop on all React Spectrum components.
declare module '@react-spectrum/s2' {
  interface RouterConfig {
    routerOptions: NavigateOptions
  }
}

function HomePage() {
  return <div>Welcome to CampaignX</div>;
}

function App() {
  let navigate = useNavigate();

  return (
    <Provider background="base" router={{ navigate, useHref }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Provider>
  );
}

export default App;
