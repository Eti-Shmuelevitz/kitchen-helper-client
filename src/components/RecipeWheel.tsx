import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../api/api';
import type { Paged, RecipeCard } from '../types';
import RecipeItem from './RecipeItem';
import './RecipeWheel.css';

const colors = ['#4ab3f4', '#ff4d5e', '#fbc531', '#4688f1', '#ee8fbb', '#00d2d3', '#4bc4d2', '#f59e1b', '#904e82'];

const kosherOptions = [
  { value: '', label: 'הכול' },
  { value: 'MEAT', label: 'בשרי' },
  { value: 'DAIRY', label: 'חלבי' },
  { value: 'PAREVE', label: 'פרווה' },
];

function RecipeWheel() {
  const [kosher, setKosher] = useState('');
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<RecipeCard | null>(null);

  const params = new URLSearchParams({ pageSize: '100' });
  if (kosher) params.set('kosherType', kosher);

  // מביאים את כל המתכונים שמתאימים לסינון, ומערבבים אותם
  const { data, refetch } = useQuery({
    queryKey: ['wheel', kosher],
    queryFn: async () => {
      const result = await apiRequest<Paged<RecipeCard>>(`/recipes?${params.toString()}`);
      return result.items.sort(() => Math.random() - 0.5);
    },
  });

  // על הגלגל יש עד תשעה מתכונים, כדי שהשמות ייכנסו בפלחים
  const recipes = (data ?? []).slice(0, 9);

  function shuffle() {
    setWinner(null);
    refetch();
  }
  const slice = 360 / Math.max(recipes.length, 1);

  const background = `conic-gradient(${recipes
    .map((_, i) => `${colors[i % colors.length]} ${i * slice}deg ${(i + 1) * slice}deg`)
    .join(', ')})`;

  function spin() {
    if (recipes.length === 0 || spinning) return;
    const index = Math.floor(Math.random() * recipes.length);
    const target = 360 - (index * slice + slice / 2);
    const turns = rotation - (rotation % 360) + 360 * 5 + target;
    setWinner(null);
    setSpinning(true);
    setRotation(turns);
    setTimeout(() => {
      setSpinning(false);
      setWinner(recipes[index]);
    }, 4200);
  }

  return (
    <div className="wheel-box">
      <h2 className="wheel-title">לא יודעים מה לבשל? סובבו את הגלגל</h2>

      <div className="wheel-filters">
        {kosherOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={kosher === option.value ? 'filter-chip selected' : 'filter-chip'}
            onClick={() => setKosher(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {recipes.length === 0 ? (
        <p className="wheel-empty">אין מתכונים שמתאימים לסינון</p>
      ) : (
        <div className="wheel-area">
          <svg className="wheel-pointer" viewBox="0 0 40 52" aria-hidden="true">
            <path d="M20 52 C20 52 2 30 2 19 A18 18 0 0 1 38 19 C38 30 20 52 20 52 Z" />
            <circle cx="20" cy="19" r="7" fill="#ffffff" />
          </svg>
          <div className="wheel" style={{ background, transform: `rotate(${rotation}deg)` }}>
            {recipes.map((recipe, i) => (
              <span
                key={recipe.id}
                className="wheel-label"
                style={{ transform: `rotate(${i * slice + slice / 2 - 90}deg) translateX(100px)` }}
              >
                {recipe.name}
              </span>
            ))}
          </div>
          <button type="button" className="wheel-button" onClick={spin} disabled={spinning}>
            <span className="wheel-button-icon">↻</span>
            {spinning ? '...' : 'סובבו'}
          </button>
        </div>
      )}

      {recipes.length > 0 && (
        <button type="button" className="wheel-shuffle" onClick={shuffle} disabled={spinning}>
          🔀 מתכונים אחרים על הגלגל
        </button>
      )}

      {winner && (
        <div className="wheel-winner">
          <p>היום מבשלים:</p>
          <RecipeItem recipe={winner} />
        </div>
      )}
    </div>
  );
}

export default RecipeWheel;
