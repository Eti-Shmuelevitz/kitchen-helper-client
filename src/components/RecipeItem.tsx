import { Link } from 'react-router-dom';
import type { RecipeCard } from '../types';
import './RecipeItem.css';


interface RecipeItemProps {
  recipe: RecipeCard;
}
function RecipeItem({ recipe }: RecipeItemProps) {
  return (
    <Link to={`/recipes/${recipe.id}`} className={`recipe-item kosher-${recipe.kosherType}`}>
      <span className="kosher-badge">{recipe.kosherLabel}</span>
      <h3 className="recipe-item-title">{recipe.name}</h3>
      <p className="recipe-item-info">{recipe.categoryLabel} · {recipe.kosherLabel}</p>
      <p className="recipe-item-info">{recipe.prepMinutes} דקות · {recipe.difficultyLabel}</p>
    </Link>
  );
}

export default RecipeItem;