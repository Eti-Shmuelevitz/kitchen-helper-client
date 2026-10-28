import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import NotFoundPage from './pages/NotFoundPage';
import RecipeFormPage from './pages/RecipeFormPage';
import RecipePage from './pages/RecipePage';
import RecipesPage from './pages/RecipesPage';
import ShoppingPage from './pages/ShoppingPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
       <Route element={<Layout />}>
       <Route path="/" element={<HomePage />} />
       <Route path="/menu" element={<MenuPage/>}/>
       <Route path="/recipes" element={<RecipesPage />} />
       <Route path="/recipes/new" element={<RecipeFormPage />} />
       <Route path="/recipes/:id" element={<RecipePage />} />
       <Route path="/recipes/:id/edit" element={<RecipeFormPage />} />
       <Route path="/shopping" element={<ShoppingPage />} />
       <Route path="*" element={<NotFoundPage />} />
      </Route>
      </Route>
    </Routes>
  );
}

export default App;