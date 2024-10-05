import useSWR from 'swr';

const fetcher = (url: string, data: any) => 
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());

export function useShippingFee(districtId: number | null, wardCode: string | null, weight: number) {
  const { data, error, isValidating } = useSWR(
    districtId && wardCode && weight ? ['/api/ghn/calculate-fee', { to_district_id: districtId, to_ward_code: wardCode, weight }] : null,
    ([url, data]) => fetcher(url, data),
    { 
      revalidateOnFocus: false, 
      revalidateOnReconnect: false,
      shouldRetryOnError: false
    }
  );
  
  return {
    shippingFee: data?.fee,
    isLoading: Boolean(districtId && wardCode && weight) && !error && !data && isValidating,
    isError: error,
  };
}