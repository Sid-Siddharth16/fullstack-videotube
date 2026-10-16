import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../api/api.helper";
import AuthCard from "../../components/AuthCard";
import Button from "../../components/ui/Button";
import FileField from "../../components/ui/FileField";
import InputField from "../../components/ui/InputField";
import PasswordField from "../../components/ui/PasswordField";
import { ROUTES } from "../../constants/route.constant";
import { useAppDispatch } from "../../store/hooks";
import { login, register } from "../../store/slices/auth.slice";
import formStyles from "../../styles/form.module.css";
import { MAX_IMAGE_SIZE_MB, PASSWORD_HINT, hasErrors } from "../../utils/validation.helper";
import {
  REGISTER_INITIAL_VALUES,
  REGISTER_SUCCESS_NOTICE,
  toRegisterRequest,
  validateRegister,
  type RegisterFormErrors,
  type RegisterFormValues,
} from "./register.helper";

type FileFieldName = "avatar" | "coverImage";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [values, setValues] = useState<RegisterFormValues>(REGISTER_INITIAL_VALUES);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (name: FileFieldName) => (file: File | null) => {
    setValues((prev) => ({ ...prev, [name]: file }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateRegister(values);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    const payload = toRegisterRequest(values);
    setIsSubmitting(true);

    try {
      await dispatch(register(payload)).unwrap();
    } catch (error) {
      toast.error(getErrorMessage(error));
      setIsSubmitting(false);
      return;
    }

    // Account exists now; if auto sign-in fails, fall back to the login page
    try {
      await dispatch(login({ email: payload.email, password: payload.password })).unwrap();
    } catch {
      toast.success(REGISTER_SUCCESS_NOTICE);
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="It only takes a minute."
      footer={
        <>
          Already have an account? <Link to={ROUTES.LOGIN}>Sign in</Link>
        </>
      }
    >
      <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
        <div className={formStyles.row}>
          <InputField
            label="Full name"
            name="fullName"
            autoComplete="name"
            placeholder="Jane Doe"
            value={values.fullName}
            onChange={handleChange}
            error={errors.fullName}
            autoFocus
          />
          <InputField
            label="Username"
            name="userName"
            autoComplete="username"
            placeholder="janedoe"
            value={values.userName}
            onChange={handleChange}
            error={errors.userName}
          />
        </div>

        <InputField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />

        <div className={formStyles.row}>
          <PasswordField
            label="Password"
            name="password"
            autoComplete="new-password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            hint={PASSWORD_HINT}
          />
          <PasswordField
            label="Confirm password"
            name="confirmPassword"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
        </div>

        <div className={formStyles.row}>
          <FileField
            label="Avatar"
            file={values.avatar}
            onFileChange={handleFileChange("avatar")}
            error={errors.avatar}
            hint={`Required · max ${MAX_IMAGE_SIZE_MB} MB`}
          />
          <FileField
            label="Cover image"
            shape="banner"
            file={values.coverImage}
            onFileChange={handleFileChange("coverImage")}
            error={errors.coverImage}
            hint="Optional"
          />
        </div>

        <Button type="submit" fullWidth isLoading={isSubmitting} className={formStyles.submit}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}
