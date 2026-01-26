import { Metadata } from 'next';
import Link from 'next/link';
import { Locale } from '@/types';
import { getAllResources } from '@/lib/sanity/queries';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { FileText, Calendar, HardDrive } from 'lucide-react';
import { DownloadButton } from '@/components/ui/DownloadButton';

interface ResourcesPageProps {
  params: {
    locale: Locale;
  };
}

// Get translations
async function getTranslations(locale: Locale) {
  const translations = await import(`@/public/locales/${locale}.json`);
  return translations.default;
}

export async function generateMetadata({
  params: { locale },
}: ResourcesPageProps): Promise<Metadata> {
  const t = await getTranslations(locale);

  return {
    title: t.resources.title,
    description: t.resources.subtitle,
    alternates: {
      canonical: `/${locale}/resources`,
      languages: {
        fr: '/fr/resources',
        en: '/en/resources',
      },
    },
  };
}

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Format date
function formatDate(dateString: string, locale: Locale): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function ResourcesPage({
  params: { locale },
}: ResourcesPageProps) {
  const t = await getTranslations(locale);
  const resources = await getAllResources();

  // Group resources by category
  const categories = [
    'productSpecs',
    'compliance',
    'guides',
    'certificates',
    'other',
  ];

  const resourcesByCategory = categories.reduce((acc, category) => {
    acc[category] = resources.filter((r: any) => r.category === category);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t.resources.title}
            </h1>
            <p className="text-xl md:text-2xl text-light max-w-3xl">
              {t.resources.subtitle}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {categories.map((category) => {
            const categoryResources = resourcesByCategory[category];
            if (!categoryResources || categoryResources.length === 0) return null;

            return (
              <div key={category} className="mb-16">
                <ScrollReveal animation="fade">
                  <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">
                    {t.resources.categories[category]}
                  </h2>
                </ScrollReveal>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryResources.map((resource: any, index: number) => (
                    <ScrollReveal
                      key={resource._id}
                      animation="slide-up"
                      delay={index * 0.1}
                    >
                      <div className="bg-light rounded-xl p-6 hover:shadow-xl transition-shadow h-full border border-neutral flex flex-col">
                        {/* File Icon */}
                        <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4">
                          <FileText className="w-8 h-8 text-white" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-primary mb-3">
                          {resource.title[locale] || resource.title.en}
                        </h3>

                        {/* Description */}
                        {resource.description && (
                          <p className="text-foreground text-sm mb-4 flex-grow">
                            {resource.description[locale] || resource.description.en}
                          </p>
                        )}

                        {/* Metadata */}
                        <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                          {resource.file?.asset?.size && (
                            <div className="flex items-center gap-2">
                              <HardDrive className="w-4 h-4" />
                              <span>
                                {t.resources.metadata.size}:{' '}
                                {formatFileSize(resource.file.asset.size)}
                              </span>
                            </div>
                          )}
                          {resource.file?.asset?.extension && (
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <span>
                                {t.resources.metadata.format}:{' '}
                                {resource.file.asset.extension.toUpperCase()}
                              </span>
                            </div>
                          )}
                          {resource._updatedAt && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {t.resources.metadata.updated}:{' '}
                                {formatDate(resource._updatedAt, locale)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Related Products */}
                        {resource.relatedProducts && resource.relatedProducts.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">
                              Related Products:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {resource.relatedProducts.map((product: any) => (
                                <Link
                                  key={product._id}
                                  href={`/${locale}/products/${product.slug[locale].current}`}
                                  className="text-xs bg-white px-2 py-1 rounded border border-neutral hover:border-primary transition-colors"
                                >
                                  {product.name[locale] || product.name.en}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Download Button */}
                        {resource.file?.asset?.url && (
                          <DownloadButton
                            resourceId={resource._id}
                            resourceTitle={resource.title[locale] || resource.title.en}
                            resourceCategory={resource.category}
                            fileFormat={resource.file.asset.extension}
                            downloadUrl={`/api/resources/${resource._id}/download`}
                            buttonText={t.common.download}
                          />
                        )}
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            );
          })}

          {/* No Resources Message */}
          {resources.length === 0 && (
            <ScrollReveal animation="fade">
              <div className="text-center py-20">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground">{t.resources.noResults}</p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>
    </main>
  );
}
