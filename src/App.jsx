import { AppRoutes } from './routes/Routes';

import './index.css';
import './App.css';

export default function App() {
  return (
    <>
      <div className="app-background" />

      {/* resto do app */}
      <AppRoutes />
    </>
  );
}