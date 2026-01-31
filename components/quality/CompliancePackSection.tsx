'use client';

import Link from 'next/link';
import { FileText, Download, Shield, Clock } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

export interface ComplianceDoc {
  label: string;
  note?: string;
}

interface CompliancePackSectionProps {
  title: string;
  subtitle: string;
  documents: ComplianceDoc[];
  ctaDownload: string;
  trustNote: string;
  locale: string;
}

export function CompliancePackSection({
  title,
  subtitle,
  documents,
  ctaDownload,
  trustNote,
  locale,
}: CompliancePackSectionProps) {
  return (
    <section className="py-20 bg-[#0A1410] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#4A9A62] rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#A89858] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal animation="fade">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)] rounded-xl mb-6">
              <FileText className="w-8 h-8 text-[#4A9A62]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#E8F5E9] mb-4">
              {title}
            </h2>
            <p className="text-xl text-[#C5D9C0] max-w-3xl mx-auto">
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {documents.map((doc, index) => (
              <ScrollReveal
                key={index}
                animation="slide-up"
                delay={index * 0.05}
              >
                <div className="bg-[#0F1814] rounded-xl p-6 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgba(74,154,98,0.2)]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)] rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-[#4A9A62]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#E8F5E9] mb-1">
                        {doc.label}
                      </h3>
                      {doc.note && (
                        <p className="text-sm text-[#80996F]">{doc.note}</p>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal animation="fade" delay={0.3}>
            <div className="text-center">
              <Link
                href={`/${locale}/contact?subject=compliance-pack`}
                className="inline-flex items-center justify-center gap-3 bg-[#4A9A62] hover:bg-[#5AAA72] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Download className="w-5 h-5" />
                {ctaDownload}
              </Link>
              
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-[#80996F]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#A89858]" />
                  <span>{trustNote.split(' • ')[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#A89858]" />
                  <span>{trustNote.split(' • ')[1]}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
