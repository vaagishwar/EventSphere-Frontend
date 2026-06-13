import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { resetPassword } from "../../features/auth/authSlice";
import { Button, Card, Field, inputClass } from "../../components/ui";

const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pendingEmail, actionStatus, error } = useSelector((state) => state.auth);
  const email = useMemo(() => params.get("email") || pendingEmail || "", [params, pendingEmail]);
  const [form, setForm] = useState({ email, otp: "", newPassword: "" });
  const loading = actionStatus === "loading";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(resetPassword(form));
    if (resetPassword.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <section className="mx-auto grid min-h-screen w-full max-w-md place-items-center px-5 py-10">
      <Card className="w-full">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/75">Account recovery</p>
        <h1 className="mt-3 text-3xl font-semibold">Reset password</h1>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <Field label="Email" id="reset-email">
            <input
              id="reset-email"
              className={inputClass}
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </Field>
          <Field label="Six digit code" id="reset-otp">
            <input
              id="reset-otp"
              className={inputClass}
              required
              pattern="\d{6}"
              value={form.otp}
              onChange={(event) => setForm({ ...form, otp: event.target.value })}
            />
          </Field>
          <Field label="New password" id="new-password">
            <input
              id="new-password"
              className={inputClass}
              type="password"
              minLength={8}
              required
              value={form.newPassword}
              onChange={(event) => setForm({ ...form, newPassword: event.target.value })}
            />
          </Field>
          {error ? <p className="text-sm text-red-200">{error}</p> : null}
          <Button type="submit" disabled={loading}>{loading ? "Resetting..." : "Reset password"}</Button>
        </form>
        <Link className="mt-5 block text-sm text-cyan-200 hover:text-cyan-100" to="/login">Back to login</Link>
      </Card>
    </section>
  );
};

export default ResetPasswordPage;
