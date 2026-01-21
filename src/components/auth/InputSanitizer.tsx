
import DOMPurify from 'dompurify';

interface InputSanitizerProps {
  value: string;
  onChange: (sanitizedValue: string) => void;
  className?: string;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}

const InputSanitizer = ({ 
  value, 
  onChange, 
  className = "", 
  placeholder = "",
  type = "text",
  maxLength = 500
}: InputSanitizerProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Basic input sanitization
    const sanitized = DOMPurify.sanitize(rawValue, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    }).trim();
    
    // Length limiting
    const limited = sanitized.slice(0, maxLength);
    
    onChange(limited);
  };

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      className={className}
      placeholder={placeholder}
      maxLength={maxLength}
    />
  );
};

export default InputSanitizer;
