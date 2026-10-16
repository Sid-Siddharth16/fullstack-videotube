import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../api/api.helper";
import { userService } from "../../api/services/user.service";
import Button from "../../components/ui/Button";
import PasswordField from "../../components/ui/PasswordField";
import { ROUTES } from "../../constants/route.constant";
import formStyles from "../../styles/form.module.css";
import { PASSWORD_HINT, hasErrors } from "../../utils/validation.helper";
import {
  CHANGE_PASSWORD_INITIAL_VALUES,
  CHANGE_PASSWORD_SUCCESS_MESSAGE,
  toChangePasswordRequest,
  validateChangePassword,
  type ChangePasswordFormErrors,
  type ChangePasswordFormValues,
} from "./changePassword.helper";
import styles from "./ChangePassword.module.css";

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const [values, setValues] = useState<ChangePasswordFormValues>(CHANGE_PASSWORD_INITIAL_VALUES);
  const [errors, setErrors] = useState<ChangePasswordFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateChangePassword(values);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setIsSubmitting(true);

    try {
      await userService.changePassword(toChangePasswordRequest(values));
    } catch (error) {
      toast.error(getErrorMessage(error));
      setIsSubmitting(false);
      return;
    }

    // Replace so the browser Back button doesn't return to the submitted form
    toast.success(CHANGE_PASSWORD_SUCCESS_MESSAGE);
    navigate(ROUTES.PROFILE, { replace: true });
  };

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h1 className={styles.title}>Change password</h1>
        <p className={styles.subtitle}>Enter your current password, then choose a new one.</p>
      </header>

      <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
        <PasswordField
          label="Current password"
          name="currentPassword"
          autoComplete="current-password"
          value={values.currentPassword}
          onChange={handleChange}
          error={errors.currentPassword}
          autoFocus
        />
        <PasswordField
          label="New password"
          name="newPassword"
          autoComplete="new-password"
          value={values.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          hint={PASSWORD_HINT}
        />
        <PasswordField
          label="Confirm new password"
          name="confirmPassword"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => navigate(ROUTES.PROFILE)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isSubmitting ? "Updating…" : "Update password"}
          </Button>
        </div>
      </form>
    </section>
  );
}
