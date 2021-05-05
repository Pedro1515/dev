import useSWR from "swr";
import { Response, Feature } from "src/api";

export function useFeatures(runId: string) {
  const { data, error, mutate: mutateFeatures } = useSWR<Response<Feature[]>>(
    `/rest/runs/${runId}/features`
  );

  return {
    features: data,
    isLoading: !error && !data,
    isError: error,
    mutateFeatures,
  };
}
