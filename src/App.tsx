import { BrowserRouter } from 'react-router-dom';
import RoutesWrapper from './routes/Routes';

console.error = () => { };

function App() {
  return (
    <BrowserRouter>
      <RoutesWrapper />
    </BrowserRouter>
  );
}

export default App;
