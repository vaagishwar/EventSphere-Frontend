import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ErrorState, LoadingSkeleton } from "../../components/AsyncState";
import { Button, Card, Field, PageHeader, inputClass } from "../../components/ui";
import { fetchUsers } from "../../features/admin/adminSlice";

const UsersManagementPage = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Users management"
        description="The frontend is ready for user actions, but the backend does not expose user-management routes yet."
      />
      {status === "loading" ? <LoadingSkeleton rows={3} /> : null}
      <ErrorState message={error || "User management API is not available yet."} />
      <Card className="mt-5">
        <h2 className="text-lg font-semibold">Admin user creation</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Public registration intentionally rejects `admin`. This form is disabled until a secure backend admin creation endpoint is added.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Field label="Name" id="admin-name">
            <input id="admin-name" className={inputClass} disabled placeholder="Admin name" />
          </Field>
          <Field label="Email" id="admin-email">
            <input id="admin-email" className={inputClass} disabled placeholder="admin@example.com" />
          </Field>
          <div className="flex items-end">
            <Button type="button" disabled className="w-full">Create admin</Button>
          </div>
        </div>
      </Card>
      <Card className="mt-5">
        <h2 className="text-lg font-semibold">Planned user actions</h2>
        <div className="mt-4 grid gap-3 text-sm text-slate-400 md:grid-cols-3">
          <p>User Deleted</p>
          <p>User Updated</p>
          <p>User Blocked</p>
        </div>
      </Card>
    </>
  );
};

export default UsersManagementPage;
