import { useState } from 'react';
import type { ComponentProps } from 'react';

// שדה סיסמה עם כפתור "הצגה" / "הסתרה".
// מקבל את כל מה שתיבת קלט רגילה מקבלת, כולל register של הטופס.
function PasswordInput(props: ComponentProps<'input'>) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="password-wrapper">
      <input {...props} type={isVisible ? 'text' : 'password'} />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? 'הסתרה' : 'הצגה'}
      </button>
    </div>
  );
}

export default PasswordInput;
