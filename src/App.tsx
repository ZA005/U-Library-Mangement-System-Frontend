import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import RoutesWrapper from './routes/Routes'; // Import the routes configuration

function App() {
  return (
    <BrowserRouter> {/* Wrap your routes with BrowserRouter */}
      <RoutesWrapper /> {/* Renders all routes with authentication context */}
    </BrowserRouter>
  );
}

export default App;
