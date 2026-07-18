import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ThemeProvider, WindowSizeProvider } from "@/standard_ui/standard_ui";

import Home from './pages/home/Home';

import '@/standard_ui/standard_ui.css';

function App() 
{

    return (
        <ThemeProvider>
        <WindowSizeProvider>

            <Router>
                <Routes>

                    <Route
                        path = { "/home" }
                        element = { <Home /> }
                    />

                    {/* 
                    * Fallback route. 
                    */}
                    <Route path = "*" element = { <Home /> } />
                </Routes>
            </Router>

        </WindowSizeProvider>
        </ThemeProvider>
    );
}

export default App
