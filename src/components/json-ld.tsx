export function JsonLd({ locale }: { locale: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": locale === 'zh' ? "陳泰銘" : "Tai Ming Chen",
    "url": "https://ming-portfolio.pages.dev",
    "image": "https://ming-portfolio.pages.dev/image.png",
    "description": locale === 'zh' 
      ? "陳泰銘的個人作品集。目前就讀彰化師範大學資工系，擔任 GDG on Campus Lead。"
      : "Personal portfolio of Tai Ming Chen, a Computer Science student and GDG on Campus Lead at NCUE.",
    "jobTitle": locale === 'zh' ? "彰師資工學生 & GDG on Campus Lead" : "Student at NCUE CS & GDG on Campus Lead",
    "worksFor": {
      "@type": "Organization",
      "name": locale === 'zh' ? "國立彰化師範大學" : "National Changhua University of Education"
    },
    "sameAs": [
      "https://github.com/Ming874"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
