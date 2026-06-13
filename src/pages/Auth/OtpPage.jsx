import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { sendVerificationOtp, verifyOtp } from "../../features/auth/authSlice";
import { Button, Card, Field, inputClass } from "../../components/ui";

const OtpPage = () => {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pendingEmail, actionStatus, error } = useSelector((state) => state.auth);
  const email = useMemo(() => params.get("email") || pendingEmail || "", [params, pendingEmail]);
  const [form, setForm] = useState({ email, otp: "" });
  const loading = actionStatus === "loading";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(verifyOtp(form));
    if (verifyOtp.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <section className="mx-auto grid min-h-screen w-full max-w-md place-items-center px-5 py-10">
      <Card className="w-full">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/75">Email verification</p>
        <h1 className="mt-3 text-3xl font-semibold">Verify OTP</h1>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <Field label="Email" id="email">
            <input id="email" className={inputClass} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Six digit code" id="otp">
            <input id="otp" className={inputClass} required pattern="\d{6}" value={form.otp} onChange={(e) => setForm({ ...form, otp: e.target.value })} />
          </Field>
          {error ? <p className="text-sm text-red-200">{error}</p> : null}
          <Button type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify account"}</Button>
          <Button type="button" variant="secondary" disabled={loading || !form.email} onClick={() => dispatch(sendVerificationOtp({ email: form.email }))}>
            Resend code
          </Button>
        </form>
        <Link className="mt-5 block text-sm text-cyan-200 hover:text-cyan-100" to="/login">Back to login</Link>
      </Card>
    </section>
  );
};

export default OtpPage;
