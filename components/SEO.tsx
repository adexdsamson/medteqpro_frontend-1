import Head from "next/head";
import React from "react";

export type SEOWrapperProps = {
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  robots?: string; // e.g. "index, follow" or "noindex, nofollow"
  ogImage?: string;
  ogImageAlt?: string;
  structuredData?: Record<string, unknown>;
};

export const SEOWrapper: React.FC<SEOWrapperProps> = ({
  title,
  description,
  keywords,
  canonical,
  robots,
  ogImage,
  ogImageAlt,
  structuredData,
}) => {
  const jsonLd = structuredData ? JSON.stringify(structuredData) : undefined;

  return (
    <Head>
      <title>{title}</title>
      {description ? (
        <meta name="description" content={description} />
      ) : null}
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      {robots ? <meta name="robots" content={robots} /> : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      {description ? (
        <meta property="og:description" content={description} />
      ) : null}
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      {ogImageAlt ? <meta property="og:image:alt" content={ogImageAlt} /> : null}
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description ? (
        <meta name="twitter:description" content={description} />
      ) : null}
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}

      {/* Structured Data */}
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      ) : null}
    </Head>
  );
};

export default SEOWrapper;