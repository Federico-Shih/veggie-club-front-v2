export function getImageUrl(imageId: string) {
  return `${process.env.NEXT_PUBLIC_IMAGE_HOST}/${imageId}?alt=media`;
}
