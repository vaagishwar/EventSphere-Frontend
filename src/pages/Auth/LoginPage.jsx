import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { loginUser } from "../../features/auth/authSlice";
import { Button, Card, Field, inputClass } from "../../components/ui";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { actionStatus, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  const loading = actionStatus === "loading";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    }
  };

  return (
    <section className="mx-auto grid min-h-screen w-full max-w-md place-items-center px-5 py-10">
      <Card className="w-full">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/75">Welcome back</p>
        <h1 className="mt-3 text-3xl font-semibold">Sign in</h1>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <Field label="Email" id="email">
            <input id="email" className={inputClass} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Password" id="password">
            <input id="password" className={inputClass} type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </Field>
          {error ? <p className="text-sm text-red-200">{error}</p> : null}
          <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
        </form>
        <p className="mt-5 text-sm text-slate-400">
          Need an account? <Link className="text-cyan-200 hover:text-cyan-100" to="/register">Register</Link>
        </p>
        <Link className="mt-3 block text-sm text-cyan-200 hover:text-cyan-100" to="/forgot-password">
          Forgot password?
        </Link>
      </Card>
    </section>
  );
};

export default LoginPage;
