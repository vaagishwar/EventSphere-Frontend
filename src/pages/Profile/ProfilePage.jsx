import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ErrorState } from "../../components/AsyncState";
import { Button, Card, Field, PageHeader, inputClass } from "../../components/ui";
import { setUser } from "../../features/auth/authSlice";
import { updateProfile } from "../../features/profile/profileSlice";
import { successToast } from "../../lib/toast";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { status, error } = useSelector((state) => state.profile);
  const [form, setForm] = useState({
    name: user?.name || "",
  });

  useEffect(() => {
    if (user) {
      setForm({ name: user.name });
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(updateProfile(form));
    if (updateProfile.fulfilled.match(result)) {
      dispatch(setUser(result.payload));
      successToast("Profile updated successfully");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title="Profile"
        description="Manage your account details and personal information."
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <Field label="Name" id="profile-name">
              <input id="profile-name" className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Email" id="profile-email">
              <input id="profile-email" className={inputClass} type="email" value={user?.email || ""} disabled />
            </Field>
            <Button type="submit" disabled={status === "loading"}>{status === "loading" ? "Updating..." : "Update Profile"}</Button>
          </form>
        </Card>
        {error ? <ErrorState message={error} /> : null}
      </div>
    </>
  );
};

export default ProfilePage;
