import { AppRoutes } from './routes/Routes';
import { Toaster } from "react-hot-toast";
import './index.css';
import './App.css';

export default function App() {
  return (
    <>
      <div className="app-background" />

      {/* resto do app */}
      <div style={{ position: "relative", zIndex: 9999 }}>
        <Toaster position="top-right" reverseOrder={false} />
        <AppRoutes />
      </div>
      
    </>
  );
}