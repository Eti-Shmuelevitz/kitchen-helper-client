import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiRequest } from '../api/api';
import type { Paged, RecipeCard } from '../types';
import RecipeItem from '../components/RecipeItem';
import './RecipesPage.css';

const kosherOptions = [
  { value: '', label: 'הכול' },
  { value: 'MEAT', label: 'בשרי' },
  { value: 'DAIRY', label: 'חלבי' },
  { value: 'PAREVE', label: 'פרווה' },
];

const sortOptions = [
  { value: 'name', label: 'לפי שם' },
  { value: 'prepMinutes', label: 'זמן הכנה קצר' },
  { value: 'createdAt', label: 'הכי חדשים' },
  { value: 'votes', label: 'הכי הרבה הצבעות' },
];

function RecipesPage() {
  const [cashrut, setCashrut] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');

  const params = new URLSearchParams();
  params.set('q', search);
  params.set('sort', sort);
  if (cashrut) {
    params.set('kosherType', cashrut);
  }

  const { data, isPending, error } = useQuery({
    queryKey: ['recipes', search, cashrut, sort],
    queryFn: () => apiRequest<Paged<RecipeCard>>(`/recipes?${params.toString()}`),
    placeholderData: keepPreviousData,
  });

  if (isPending) return <p>טוען...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <h1>מתכונים</h1>

      <input
        className="recipes-search"
        value={search}
        placeholder="חיפוש לפי שם..."
        onChange={(event) => setSearch(event.target.value)}
      />

     <div className="recipes-sort">
      <label>מיון</label>
      <select value={sort} onChange={(event) => setSort(event.target.value)}>
      {sortOptions.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
      ))}
     </select>
     </div>

      <div className="kosher-filters">
        {kosherOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={cashrut === option.value ? 'filter-chip selected' : 'filter-chip'}
            onClick={() => setCashrut(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="recipes-grid">
        {data.items.map((recipe) => (
          <RecipeItem key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default RecipesPage;