import { notify } from "../lib/notifications";

export const reportService = {
  async generate() {
    notify.dashboard.reportGenerationFailed();
    throw new Error("Report generation API is not available yet.");
  },

  async download() {
    notify.reports.exportFailed();
    throw new Error("Report download API is not available yet.");
  },
};
