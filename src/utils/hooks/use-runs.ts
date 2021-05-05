import useSWR from "swr";
import { Run, Response } from "src/api";
import { objectToQueryParams } from "src/utils/string";

export function useRuns(query?) {
  const queryParams = objectToQueryParams(query);
  const { data, error, mutate: mutateRuns } = useSWR<Response<Run[]>>(
    `/rest/runs/q?${queryParams}`
  );

  return {
    runs: data,
    isLoading: !error && !data,
    isError: error,
    mutateRuns,
  };
}

export function useRun(id: string) {
  const { data, error, mutate: mutateRun } = useSWR<Run>(
    `/rest/runs/${id}`
  );

  return {
    run: data,
    isLoading: !error && !data,
    isError: error,
    mutateRun,
  };
}
