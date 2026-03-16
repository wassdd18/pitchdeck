import { createContext, useCallback, useContext, useState } from 'react';

const RegistrationContext = createContext(null);

const INITIAL = {
  firstName:       '',
  lastName:        '',
  email:           '',
  confirmEmail:    '',
  password:        '',
  confirmPassword: '',
  dateOfBirth:     null,
  language:        'English',
  location:        '',
  profileImage:    null,
  hobbies:         [],
};

export function RegistrationProvider({ children }) {
  const [data, setData] = useState(INITIAL);

  const updateData = useCallback((updates) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetData = useCallback(() => setData(INITIAL), []);

  return (
    <RegistrationContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export const useRegistration = () => {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error('useRegistration must be used within <RegistrationProvider>');
  return ctx;
};