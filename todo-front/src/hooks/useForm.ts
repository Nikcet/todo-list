import { useState, useCallback } from 'react';

export const useForm = <T extends Record<string, any>>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);

  const handleChange = useCallback((field: keyof T) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const reset = useCallback(() => {
    setFormData(initialState);
  }, [initialState]);

  const setField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  return {
    formData,
    handleChange,
    reset,
    setField,
    setFormData
  };
}; 