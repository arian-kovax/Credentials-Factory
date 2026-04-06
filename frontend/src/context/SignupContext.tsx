import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

type SignupData = {
  username: string;
  email: string;
  phone: string;
  department: string;
  accessLevel: string;
  password: string;
  confirmPassword: string;
};

interface SignupContextValue {
  signupData: SignupData;
  updateSignupData: (values: Partial<SignupData>) => void;
  clearSignupData: () => void;
}

const SIGNUP_STORAGE_KEY = "signup_flow_data";

const defaultSignupData: SignupData = {
  username: "",
  email: "",
  phone: "",
  department: "",
  accessLevel: "",
  password: "",
  confirmPassword: "",
};

const SignupContext = createContext<SignupContextValue | undefined>(undefined);

function getStoredSignupData(): SignupData {
  const stored = sessionStorage.getItem(SIGNUP_STORAGE_KEY);

  if (!stored) {
    return defaultSignupData;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<SignupData>;
    return {
      ...defaultSignupData,
      ...parsed,
    };
  } catch {
    return defaultSignupData;
  }
}

interface SignupProviderProps {
  children: ReactNode;
}

export function SignupProvider({ children }: SignupProviderProps) {
  const [signupData, setSignupData] = useState<SignupData>(getStoredSignupData);

  const value = useMemo<SignupContextValue>(
    () => ({
      signupData,
      updateSignupData(values) {
        setSignupData((current) => {
          const nextData = { ...current, ...values };
          sessionStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify(nextData));
          return nextData;
        });
      },
      clearSignupData() {
        sessionStorage.removeItem(SIGNUP_STORAGE_KEY);
        setSignupData(defaultSignupData);
      },
    }),
    [signupData],
  );

  return (
    <SignupContext.Provider value={value}>{children}</SignupContext.Provider>
  );
}

export function useSignup() {
  const context = useContext(SignupContext);

  if (!context) {
    throw new Error("useSignup must be used within a SignupProvider.");
  }

  return context;
}
