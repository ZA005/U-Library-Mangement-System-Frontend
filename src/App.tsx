import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RoutesWrapper from "./routes/RoutesWrapper";

const queryClient = new QueryClient();

console.error = () => { };

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RoutesWrapper />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
