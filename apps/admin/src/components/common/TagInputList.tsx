import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust to your import paths
import { Field, FieldError, FieldLabel } from "@/components/ui/field"; // Adjust to your components
import { Input } from "@/components/ui/input"; // Adjust to your import paths

interface TagInputListProps {
  label: string;
  name: string;
  value: string[] | null | undefined;
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  isTouched?: boolean;
  isValid?: boolean;
  errors?: any[];
  placeholder?: string;
}

export function TagInputList({
  label,
  name,
  value,
  onChange,
  onBlur,
  isTouched,
  isValid,
  errors,
  placeholder = "Type and press Enter...",
}: TagInputListProps) {
  const items = value ?? [];
  const [inputValue, setInputValue] = useState("");
  const isInvalid = isTouched && !isValid;

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
      setInputValue("");
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const updated = items.filter((_, index) => index !== indexToRemove);
    onChange(updated);
  };

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>

      {/* Input & Add Button */}
      <div className="flex gap-2">
        <Input
          id={name}
          name={name}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          onBlur={onBlur}
          placeholder={placeholder}
          type="text"
        />
        <Button type="button" onClick={handleAdd} variant="outline">
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      {/* Items List */}
      {items.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-2">
          {items.map((item, index) => (
            <div
              key={item}
              className="flex items-center justify-between px-3 py-1.5 bg-muted/50 border rounded-md text-sm"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isInvalid && errors && <FieldError errors={errors} />}
    </Field>
  );
}
