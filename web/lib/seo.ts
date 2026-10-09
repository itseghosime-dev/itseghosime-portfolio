import type { Metadata } from "next";

import type { ImageAsset } from "@/types/home";

import { absoluteUrl, SITE_NAME } from "./site";

type SocialImageLike = {
  alt?: string | null;
  height?: number | null;
  url?: string | null;
  width?: number | null;
};

type ShareReadyImage = SocialImageLike & {
  height: number;
  url: string;
  width: number;
};

type PageMetadataInput = {
  defaultImage?: SocialImageLike | null;
  description: string;
  image?: SocialImageLike | null;
  noIndex?: boolean;
  path: `/${string}` | "/";
  title: string;
};

export const DEFAULT_SOCIAL_IMAGE: ImageAsset = {
  alt: "ITSEGHOSIME — Frontend Developer and Software Engineer",
  height: 630,
  url: absoluteUrl("/opengraph-image"),
  width: 1200,
};

export function resolveSocialImage(
  image?: SocialImageLike | null,
  defaultImage?: SocialImageLike | null,
): ImageAsset {
  const isShareReady = (
    candidate?: SocialImageLike | null,
  ): candidate is ShareReadyImage =>
    Boolean(
      candidate?.url &&
      candidate.width &&
      candidate.height &&
      candidate.width >= 1200 &&
      candidate.height >= 630,
    );

  if (isShareReady(image)) {
    return {
      alt: image.alt || DEFAULT_SOCIAL_IMAGE.alt,
      height: image.height,
      url: image.url,
      width: image.width,
    };
  }
  if (isShareReady(defaultImage)) {
    return {
      alt: defaultImage.alt || DEFAULT_SOCIAL_IMAGE.alt,
      height: defaultImage.height,
      url: defaultImage.url,
      width: defaultImage.width,
    };
  }
  return DEFAULT_SOCIAL_IMAGE;
}

export function createPageMetadata({
  defaultImage,
  description,
  image,
  noIndex = false,
  path,
  title,
}: PageMetadataInput): Metadata {
  const socialImage = resolveSocialImage(image, defaultImage);
  const shouldIndex = !noIndex;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      images: [
        {
          alt: socialImage.alt,
          height: socialImage.height,
          url: socialImage.url,
          width: socialImage.width,
        },
      ],
      siteName: SITE_NAME,
      url: path,
    },
    robots: {
      follow: shouldIndex,
      index: shouldIndex,
      googleBot: { follow: shouldIndex, index: shouldIndex },
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage.url],
    },
  };
}
