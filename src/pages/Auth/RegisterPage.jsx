import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { registerUser } from "../../features/auth/authSlice";
import { Button, Card, Field, inputClass } from "../../components/ui";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { actionStatus, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const loading = actionStatus === "loading";

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(registerUser(form)).unwrap();
      navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
    } catch {
      // Handled by thunk and axios interceptors
    }
  };

  return (
    <section className="mx-auto grid min-h-screen w-full max-w-md place-items-center px-5 py-10">
      <Card className="w-full">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/75">Join EventSphere</p>
        <h1 className="mt-3 text-3xl font-semibold">Create account</h1>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <Field label="Name" id="name">
            <input id="name" className={inputClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Email" id="email">
            <input id="email" className={inputClass} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Password" id="password">
            <input id="password" className={inputClass} type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </Field>
          <Field label="Role" id="role">
            <select id="role" className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="user">User</option>
              <option value="organizer">Organizer</option>
            </select>
          </Field>
          {error ? <p className="text-sm text-red-200">{error}</p> : null}
          <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</Button>
        </form>
        <p className="mt-5 text-sm text-slate-400">
          Already registered? <Link className="text-cyan-200 hover:text-cyan-100" to="/login">Sign in</Link>
        </p>
      </Card>
    </section>
  );
};

export default RegisterPage;
