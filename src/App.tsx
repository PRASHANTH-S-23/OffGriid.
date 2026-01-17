import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
      retry: 1, // Reduce retry attempts
    },
  },
});

const App = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 1: after first paint
    const raf = requestAnimationFrame(() => setStage(1));

    // Stage 2: after idle (with fallback)
    const idle = 'requestIdleCallback' in window 
      ? requestIdleCallback(() => setStage(2), { timeout: 2000 })
      : setTimeout(() => setStage(2), 100);

    return () => {
      cancelAnimationFrame(raf);
      if ('cancelIdleCallback' in window && typeof idle === 'number') {
        cancelIdleCallback(idle);
      } else {
        clearTimeout(idle as number);
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index stage={stage} />} />
          {stage >= 2 && <Route path="*" element={<NotFound />} />}
        </Routes>

        {stage >= 2 && (
          <TooltipProvider>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        )}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;