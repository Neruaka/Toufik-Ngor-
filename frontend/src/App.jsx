import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ItemCreate from "./pages/ItemCreate";
import ItemDetail from "./pages/ItemDetail";
import ItemEdit from "./pages/ItemEdit";

// components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <main style={{ padding: "20px" }}>
                <Routes>
                    {/* routes publiques */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* routes protégées */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />
                    <Route path="/items/new" element={
                        <ProtectedRoute>
                            <ItemCreate />
                        </ProtectedRoute>
                    } />
                    <Route path="/items/:id" element={
                        <ProtectedRoute>
                            <ItemDetail />
                        </ProtectedRoute>
                    } />
                    <Route path="/items/:id/edit" element={
                        <ProtectedRoute>
                            <ItemEdit />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;