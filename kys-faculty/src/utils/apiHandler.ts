export const extractData = (response: any) => {
  return response?.data?.data ?? null;
};
