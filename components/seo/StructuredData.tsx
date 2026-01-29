/**
 * StructuredData Component
 * 
 * Renders Schema.org structured data as JSON-LD script tag
 * Used for SEO to help search engines understand page content
 */

interface StructuredDataProps {
  data: Record<string, any> | Record<string, any>[];
}

export function StructuredData({ data }: StructuredDataProps) {
  // Handle both single schema and array of schemas
  const schemaData = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemaData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0),
          }}
        />
      ))}
    </>
  );
}
