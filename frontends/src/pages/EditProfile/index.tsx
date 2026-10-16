import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../api/api.helper";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import PageLoader from "../../components/ui/PageLoader";
import { ROUTES } from "../../constants/route.constant";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { editProfile, selectUser } from "../../store/slices/auth.slice";
import formStyles from "../../styles/form.module.css";
import type { User } from "../../types/user.types";
import { hasErrors } from "../../utils/validation.helper";
import {
  EDIT_PROFILE_SUCCESS_MESSAGE,
  isProfileUnchanged,
  toEditProfileRequest,
  toEditProfileValues,
  validateEditProfile,
  type EditProfileFormErrors,
  type EditProfileFormValues,
} from "./editProfile.helper";
import styles from "./EditProfile.module.css";

function EditProfileForm({ user }: { user: User }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [values, setValues] = useState<EditProfileFormValues>(() => toEditProfileValues(user));
  const [errors, setErrors] = useState<EditProfileFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUnchanged = isProfileUnchanged(values, user);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateEditProfile(values);
    setErrors(validationErrors);
    if (hasErrors(validationErrors) || isUnchanged) return;

    setIsSubmitting(true);

    try {
      await dispatch(editProfile(toEditProfileRequest(values))).unwrap();
    } catch (error) {
      toast.error(getErrorMessage(error));
      setIsSubmitting(false);
      return;
    }

    // Replace so the browser Back button doesn't return to the submitted form
    toast.success(EDIT_PROFILE_SUCCESS_MESSAGE);
    navigate(ROUTES.PROFILE, { replace: true });
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
      <div className={formStyles.row}>
        <InputField
          label="Full name"
          name="fullName"
          autoComplete="name"
          value={values.fullName}
          onChange={handleChange}
          error={errors.fullName}
          autoFocus
        />
        <InputField
          label="Username"
          name="userName"
          autoComplete="username"
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
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />

      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => navigate(ROUTES.PROFILE)} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting} disabled={isUnchanged}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

export default function EditProfilePage() {
  const user = useAppSelector(selectUser);

  if (!user) return <PageLoader />;

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h1 className={styles.title}>Edit profile</h1>
        <p className={styles.subtitle}>Update your name, username and email.</p>
      </header>
      {/* Keyed by id so the form re-initialises if a different account syncs in from another tab */}
      <EditProfileForm key={user._id} user={user} />
    </section>
  );
}
