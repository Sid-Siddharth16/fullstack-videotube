import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../api/api.helper";
import AuthCard from "../../components/AuthCard";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import PasswordField from "../../components/ui/PasswordField";
import { ROUTES } from "../../constants/route.constant";
import { useAppDispatch } from "../../store/hooks";
import { login } from "../../store/slices/auth.slice";
import formStyles from "../../styles/form.module.css";
import { hasErrors } from "../../utils/validation.helper";
import {
  LOGIN_INITIAL_VALUES,
  toLoginRequest,
  validateLogin,
  type LoginFormErrors,
  type LoginFormValues,
} from "./login.helper";

export default function LoginPage() {
  const dispatch = useAppDispatch();

  const [values, setValues] = useState<LoginFormValues>(LOGIN_INITIAL_VALUES);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateLogin(values);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setIsSubmitting(true);
    try {
      await dispatch(login(toLoginRequest(values))).unwrap();
    } catch (error) {
      toast.error(getErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue to your account."
      footer={
        <>
          Don't have an account? <Link to={ROUTES.REGISTER}>Create one</Link>
        </>
      }
    >
      <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
        <InputField
          label="Email or username"
          name="identifier"
          autoComplete="username"
          placeholder="you@example.com"
          value={values.identifier}
          onChange={handleChange}
          error={errors.identifier}
          autoFocus
        />
        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Button type="submit" fullWidth isLoading={isSubmitting} className={formStyles.submit}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}
