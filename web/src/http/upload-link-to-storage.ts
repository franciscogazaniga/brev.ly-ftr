import axios from "axios";

interface uploadLinkToStorageParams {
  originalLink: string;
  customSlug: string;
}

export async function uploadLinkToStorage(
  { originalLink, customSlug }: uploadLinkToStorageParams,
  ) {
  const data = {
    originalLink,
    customSlug
  }

  const response = await  axios.post<{ shortenedLink: string, linkId: string }>(
    "http://localhost:3333/links",
    data);

  console.log("Response:", response);
  console.log("Shortened link created with slug: ", response.data.shortenedLink);
  return { shortenedLink: response.data.shortenedLink, linkId: response.data.linkId };
}