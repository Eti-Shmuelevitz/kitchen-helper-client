import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../api/api';
import { useAuth } from '../context/AuthContext';
import type { Paged, RecipeCard } from '../types';
import RecipeWheel from '../components/RecipeWheel';
import './HomePage.css';

function HomePage() {
  const { currentUser } = useAuth();

  const { data } = useQuery({
    queryKey: ['recipes', 'home'],
    queryFn: () => apiRequest<Paged<RecipeCard>>('/recipes?pageSize=100'),
  });

  const recipes = data?.items ?? [];
  const count = (type: string) => recipes.filter((r) => r.kosherType === type).length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'בוקר טוב' : hour < 18 ? 'צהריים טובים' : 'ערב טוב';

  return (
    <div className="home">
      <div className="home-hero">
        <div>
          <p className="home-greeting">{greeting}, {currentUser?.name}</p>
          <h1 className="home-title">מה מבשלים היום?</h1>
          <p className="home-subtitle">כל המתכונים של הבית, במקום אחד.</p>
          <Link to="/recipes" className="home-pick">
            לכל המתכונים
          </Link>
        </div>
        <img className="home-pot" src="/pot.svg" alt="" />
      </div>

      <RecipeWheel />

      <div className="home-stats">
        <Link to="/recipes" className="stat">
          <span className="stat-number">{recipes.length}</span>
          <span className="stat-label">מתכונים בבית</span>
        </Link>
        <div className="stat kosher-MEAT">
          <span className="stat-number">{count('MEAT')}</span>
          <span className="stat-label">בשריים</span>
        </div>
        <div className="stat kosher-DAIRY">
          <span className="stat-number">{count('DAIRY')}</span>
          <span className="stat-label">חלביים</span>
        </div>
        <div className="stat kosher-PAREVE">
          <span className="stat-number">{count('PAREVE')}</span>
          <span className="stat-label">פרווה</span>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
