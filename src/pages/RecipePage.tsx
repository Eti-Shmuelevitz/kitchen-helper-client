import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../api/api';
import { useAuth } from '../context/AuthContext';
import type { RecipeDetail } from '../types';
import './RecipePage.css';

function RecipePage() {

const{id}=useParams();
const {isManager}=useAuth();
const{ data: recipe, isPending, error}=useQuery({
  queryKey:  ['recipe', id],
  queryFn :()=> apiRequest<RecipeDetail>(`/recipes/${id}`),
})

if(isPending)
    return <p>טוען...</p>
if(error)
    return <p>{error.message}</p>
  return (
    <div className="recipe-page">
      <Link to="/recipes" className="recipe-back">→ חזרה למתכונים</Link>

      <div className="recipe-header">
        <h1 className="recipe-title">{recipe.name}</h1>
        {recipe.description && <p className="recipe-description">{recipe.description}</p>}
        <p className="recipe-meta">{recipe.categoryLabel} · {recipe.kosherLabel} · {recipe.prepMinutes} דקות ·{' '}
          {recipe.difficultyLabel} · {recipe.servings} מנות </p>
        {isManager && <Link to={`/recipes/${recipe.id}/edit`} className="recipe-edit">עריכה</Link>}
      </div>

      <div className="recipe-body">
        <section className="recipe-section">
          <h2>מצרכים:</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.ingredientId}>
                {ingredient.toTaste
                  ? `${ingredient.name}, לפי הטעם`
                  : `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
              </li>
            ))}
          </ul>
        </section>

        <section className="recipe-section">
          <h2>אופן ההכנה:</h2>
          <ol className="steps-list">
            {recipe.steps.map((step) => (
              <li key={step.order}>{step.text}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

export default RecipePage;