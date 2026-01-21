import { apiClient } from "./api";

export interface DemoResetResponse {
  ok: boolean;
  deleted: {
    patients: number;
    appointments: number;
    auditLogs?: number;
  };
  seeded: {
    patients: number;
    appointments: number;
  };
}

export interface DemoLoadResponse {
  ok: boolean;
  seeded: {
    patients: number;
    appointments: number;
  };
}

export const resetDemoData = async (reseed: boolean): Promise<DemoResetResponse> => {
  const { data } = await apiClient.post<DemoResetResponse>(
    `/demo/reset?reseed=${reseed ? "true" : "false"}`
  );
  return data;
};

export const loadSampleData = async (): Promise<DemoLoadResponse> => {
  const { data } = await apiClient.post<DemoLoadResponse>("/demo/load-sample");
  return data;
};
