import { useEffect } from "react";

// Alternative PageMeta.jsx for projects
export const PageMeta = ({
  title,
  description = "Bill Sync - Professional Billing & Payment Management Platform. Streamline your billing process with our comprehensive solution.",
  keywords = "billing, payment management, invoicing, financial management, business tools",
  ogImage = "/images/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
}) => {
  // Default title if none provided
  const defaultTitle =
    "Bill Sync - Professional Billing & Payment Management Platform";
  const pageTitle = title || defaultTitle;

  useEffect(() => {
    // Update basic meta tags
    document.title = pageTitle;

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", description);

    // Update or create meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute("content", keywords);

    // Update or create Open Graph meta tags
    const ogTags = {
      "og:title": pageTitle,
      "og:description": description,
      "og:image": ogImage,
      "og:type": ogType,
      "og:site_name": "Bill Sync",
      "og:locale": "en_US",
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute("property", property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", content);
    });

    // Update or create Twitter meta tags
    const twitterTags = {
      "twitter:card": twitterCard,
      "twitter:title": pageTitle,
      "twitter:description": description,
      "twitter:image": ogImage,
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute("name", name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", content);
    });

    // Cleanup function
    return () => {
      // Remove meta tags when component unmounts
      const metaTags = document.querySelectorAll(
        'meta[property^="og:"], meta[name^="twitter:"]'
      );
      metaTags.forEach((tag) => tag.remove());
    };
  }, [pageTitle, description, keywords, ogImage, ogType, twitterCard]);

  return null;
};
