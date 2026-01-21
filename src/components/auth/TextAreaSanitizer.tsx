
import DOMPurify from 'dompurify';

interface TextAreaSanitizerProps {
  value: string;
  onChange: (sanitizedValue: string) => void;
  className?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

const TextAreaSanitizer = ({ 
  value, 
  onChange, 
  className = "", 
  placeholder = "",
  rows = 4,
  maxLength = 2000
}: TextAreaSanitizerProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    <textarea
      value={value}
      onChange={handleChange}
      className={className}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
    />
  );
};

export default TextAreaSanitizer;
