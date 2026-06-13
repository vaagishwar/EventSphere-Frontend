import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { forgotPassword } from "../../features/auth/authSlice";
import { Button, Card, Field, inputClass } from "../../components/ui";

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { actionStatus, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const loading = actionStatus === "loading";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(forgotPassword({ email }));
    if (forgotPassword.fulfilled.match(result)) {
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <section className="mx-auto grid min-h-screen w-full max-w-md place-items-center px-5 py-10">
      <Card className="w-full">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/75">Account recovery</p>
        <h1 className="mt-3 text-3xl font-semibold">Forgot password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Enter your account email and use the reset code sent by the backend mailer.
        </p>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <Field label="Email" id="forgot-email">
            <input
              id="forgot-email"
              className={inputClass}
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
          {error ? <p className="text-sm text-red-200">{error}</p> : null}
          <Button type="submit" disabled={loading}>{loading ? "Sending..." : "Send reset code"}</Button>
        </form>
        <Link className="mt-5 block text-sm text-cyan-200 hover:text-cyan-100" to="/login">Back to login</Link>
      </Card>
    </section>
  );
};

export default ForgotPasswordPage;
