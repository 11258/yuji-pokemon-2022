import { useFetch } from "#app";
import { VITE_SERVER_ORIGIN } from "~/utils/env";

export default async () => {
  console.log(`VITE_SERVER_ORIGIN - ${VITE_SERVER_ORIGIN}`)
  const response = useFetch(`${VITE_SERVER_ORIGIN}api/trainers`);
  return response;
};
