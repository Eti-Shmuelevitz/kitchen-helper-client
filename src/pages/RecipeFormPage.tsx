import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { RecipeCategory, KosherType, Difficulty, RecipeDetail } from '../types';
import './RecipeFormPage.css';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../api/api';

interface RecipeForm {
  name: string;
  description: string;
  category: RecipeCategory;
  kosherType: KosherType;
  difficulty: Difficulty;
  prepMinutes: number;
  servings: number;
  stepsText: string;
  ingredients: { name: string; quantity: number; unit: string }[];
}

const categoryOptions = [
  { value: 'MAIN', label: 'מנה עיקרית' },
  { value: 'SIDE', label: 'תוספת' },
  { value: 'SALAD', label: 'סלט' },
  { value: 'SOUP', label: 'מרק' },
  { value: 'DESSERT', label: 'קינוח' },
  { value: 'BAKED', label: 'מאפה' },
  { value: 'BREAKFAST', label: 'ארוחת בוקר' },
  { value: 'SHABBAT_HOLIDAY', label: 'מנה לשבת ולחג' },
];

const kosherOptions = [
  { value: 'MEAT', label: 'בשרי' },
  { value: 'DAIRY', label: 'חלבי' },
  { value: 'PAREVE', label: 'פרווה' },
];

const difficultyOptions = [
  { value: 'EASY', label: 'קל' },
  { value: 'MEDIUM', label: 'בינוני' },
  { value: 'HARD', label: 'מאתגר' },
];


function RecipeFormPage() {
    const {isManager}=useAuth();
    const { id } = useParams();

    const { data: recipe } = useQuery({
      queryKey: ['recipe', id],
      queryFn: () => apiRequest<RecipeDetail>(`/recipes/${id}`),
      enabled: !!id,
    });

      const {
    register,
    handleSubmit,
      control,
    formState: { errors },
  } = useForm<RecipeForm>({
    defaultValues: {
      category: 'MAIN',
      kosherType: 'PAREVE',
      difficulty: 'EASY',
      prepMinutes: 30,
      servings: 4,
      ingredients: [{ name: '', quantity: 1, unit: '' }],
    },
    values: recipe && {
      name: recipe.name,
      description: recipe.description ?? '',
      category: recipe.category,
      kosherType: recipe.kosherType,
      difficulty: recipe.difficulty,
      prepMinutes: recipe.prepMinutes,
      servings: recipe.servings,
      stepsText: recipe.steps.map((step) => step.text).join('\n'),
      ingredients: recipe.ingredients.map((ingredient) => ({
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      })),
    },
  });
   const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });
    const queryClient=useQueryClient();
    const navigate=useNavigate();
    const saveRecipe=useMutation({
        mutationFn: (recipe: object)=>   apiRequest<RecipeDetail>(id ? `/recipes/${id}` : '/recipes',{
            method: id ? 'PUT' : 'POST',
              body: JSON.stringify(recipe),
        }),
         onSuccess: (savedRecipe) => {
    queryClient.invalidateQueries({ queryKey: ['recipes'] });
    queryClient.invalidateQueries({ queryKey: ['recipe', id] });
    navigate(`/recipes/${savedRecipe.id}`);
  },
    })


  if (!isManager) {
    return <Navigate to="/recipes" replace />;
  }
   function onSubmit(data: RecipeForm) {
    const steps= data.stepsText.split("\n").map((line)=>line.trim())
    .filter((line)=>line !=='').map((line)=>({text:line}))
   
      const ingredients = data.ingredients.map((ingredient) => ({
    ...ingredient,
    unit: ingredient.unit || undefined,
  }));

  saveRecipe.mutate({ ...data, ingredients, steps });
}
 

  return (
    <div className="recipe-form-page">
      <h1>{id ? 'עריכת מתכון' : 'מתכון חדש'}</h1>
        <form className="recipe-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <label>שם המתכון</label>
          <input
            {...register('name', {
              required: 'צריך למלא שם',
              minLength: { value: 2, message: 'שם של 2 תווים לפחות' },
            })}
          />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>

        <div className="form-field">
          <label>תיאור</label>
          <textarea rows={3} {...register('description')} />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>קטגוריה</label>
            <select {...register('category')}>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>כשרות</label>
            <select {...register('kosherType')}>
              {kosherOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>רמת קושי</label>
            <select {...register('difficulty')}>
              {difficultyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>זמן הכנה, בדקות</label>
            <input
              type="number"
              {...register('prepMinutes', {
                valueAsNumber: true,
                required: 'צריך למלא זמן הכנה',
                min: { value: 1, message: 'לפחות דקה אחת' },
                max: { value: 1440, message: 'עד 1440 דקות' },
              })}
            />
            {errors.prepMinutes && <p className="form-error">{errors.prepMinutes.message}</p>}
          </div>

          <div className="form-field">
            <label>מספר מנות</label>
            <input
              type="number"
              {...register('servings', {
                valueAsNumber: true,
                required: 'צריך למלא מספר מנות',
                min: { value: 1, message: 'לפחות מנה אחת' },
                max: { value: 50, message: 'עד 50 מנות' },
              })}
            />
            {errors.servings && <p className="form-error">{errors.servings.message}</p>}
          </div>
        </div>
       <div className="form-field">
  <label>מצרכים</label>

  {fields.map((field, index) => (
    <div key={field.id} className="ingredient-row">
      <input
        placeholder="שם המצרך"
        {...register(`ingredients.${index}.name`, { required: 'צריך לכתוב שם' })}
      />
      <input
        type="number"
        step="any"
        placeholder="כמות"
        {...register(`ingredients.${index}.quantity`, { valueAsNumber: true, min: 0 })}
      />
      <input placeholder="יחידה" {...register(`ingredients.${index}.unit`)} />
      <button
        type="button"
        className="ingredient-remove"
        onClick={() => remove(index)}
        disabled={fields.length === 1}
      >
        מחיקה
      </button>
    </div>
  ))}

  {errors.ingredients && <p className="form-error">צריך לכתוב שם לכל מצרך</p>}

  <button
    type="button"
    className="ingredient-add"
    onClick={() => append({ name: '', quantity: 1, unit: '' })}
  >
    + הוספת מצרך
  </button>
  <p className="form-hint">כמות 0 פירושה "לפי הטעם"</p>
</div>
          <div className="form-field">
             <label>אופן ההכנה</label>
             <p className="form-hint">כל שורה היא שלב</p>
             <textarea
             rows={6}
             {...register('stepsText', { required: 'צריך לכתוב לפחות שלב אחד' })} />
            {errors.stepsText && <p className="form-error">{errors.stepsText.message}</p>}
        </div>
{saveRecipe.error && <p className="form-error">{saveRecipe.error.message}</p>}
        <button type="submit" className="form-submit">שמירה</button>
      </form>


    </div>
  );
}

export default RecipeFormPage;