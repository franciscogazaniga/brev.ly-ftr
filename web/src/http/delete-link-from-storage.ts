import axios from "axios";

interface deleteLinkFromStorageParams {
  linkId: string;
}

export async function deleteLinkFromStorage(
  { linkId }: deleteLinkFromStorageParams,
  ) {
  const response = await axios.delete(`http://localhost:3333/links/${linkId}`);
  return { response: response.data };
}