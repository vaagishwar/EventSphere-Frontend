import { useDispatch, useSelector } from "react-redux";

import { ErrorState } from "../../components/AsyncState";
import { Button, Card, PageHeader } from "../../components/ui";
import { generateReport } from "../../features/reports/reportsSlice";

const ReportsPage = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.reports);

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Reports"
        description="Report UI is present with graceful fallback until dashboard/report APIs are added to the backend."
        actions={<Button type="button" disabled={status === "loading"} onClick={() => dispatch(generateReport())}>Generate report</Button>}
      />
      <ErrorState message={error || "Report API is not available yet."} />
      <Card className="mt-5">
        <h2 className="text-lg font-semibold">Export-ready placeholders</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Once backend report endpoints exist, this page can download sales, bookings, event approval, and user activity reports.
        </p>
      </Card>
    </>
  );
};

export default ReportsPage;
