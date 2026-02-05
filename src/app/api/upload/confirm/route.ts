import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, DOCUMENTS_BUCKET, isSupabaseConfigured } from '@/lib/supabase/client';
import type { UploadConfirmRequest, UploadConfirmResponse } from '@/lib/upload/types';
import type { DomainType } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: UploadConfirmRequest = await request.json();
    const { projectId, files, mode, category, categoryCode } = body;

    // Validate request
    if (!projectId || !files || files.length === 0) {
      return NextResponse.json(
        { error: 'projectId and files are required' },
        { status: 400 }
      );
    }

    const documents: UploadConfirmResponse['documents'] = [];
    const errors: UploadConfirmResponse['errors'] = [];

    // Check if Supabase is configured
    const useSupabase = isSupabaseConfigured();
    const supabase = useSupabase ? getSupabaseAdmin() : null;

    for (const file of files) {
      try {
        // Verify file exists in storage (if using Supabase)
        if (useSupabase && supabase) {
          const { data: fileData, error: fileError } = await supabase.storage
            .from(DOCUMENTS_BUCKET)
            .list(projectId, {
              search: file.path.split('/').pop(),
            });

          if (fileError || !fileData?.length) {
            errors.push({
              path: file.path,
              error: 'File not found in storage',
            });
            continue;
          }
        }

        // Classify document
        let classifiedCategory = category;
        let classifiedCode = categoryCode;
        let classifiedDomain: DomainType | undefined;

        if (mode === 'ai') {
          const classification = classifyDocument(file.fileName);
          classifiedCategory = classification.category;
          classifiedCode = classification.code;
          classifiedDomain = classification.domain;
        } else if (mode === 'manual' && category) {
          classifiedDomain = getDomainFromCategory(categoryCode || '');
        }

        // Generate document ID
        const documentId = `doc-${projectId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

        documents.push({
          path: file.path,
          documentId,
          category: classifiedCategory,
          categoryCode: classifiedCode,
          domain: classifiedDomain,
        });

      } catch (err) {
        errors.push({
          path: file.path,
          error: err instanceof Error ? err.message : 'Processing failed',
        });
      }
    }

    const response: UploadConfirmResponse = {
      success: errors.length === 0,
      documents,
      errors,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[Confirm API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Simple rule-based document classification
 * In production, this would call an AI service (OpenAI, Anthropic, etc.)
 */
function classifyDocument(fileName: string): { category: string; code: string; domain: DomainType } {
  const lowerName = fileName.toLowerCase();

  // Tax documents
  if (lowerName.includes('liasse') || lowerName.includes('2050') || lowerName.includes('2059')) {
    return { category: 'CIT (IS)', code: '02.1', domain: 'TAX' };
  }
  if (lowerName.includes('ca3') || lowerName.includes('tva')) {
    return { category: 'VAT (TVA)', code: '02.2', domain: 'TAX' };
  }
  if (lowerName.includes('cet') || lowerName.includes('taxe') || lowerName.includes('cfe')) {
    return { category: 'Autres Taxes', code: '02.3', domain: 'TAX' };
  }
  if (lowerName.includes('fiscal') || lowerName.includes('impot') || lowerName.includes('credit')) {
    return { category: 'CIT (IS)', code: '02.1', domain: 'TAX' };
  }

  // Corporate documents
  if (lowerName.includes('statut') || lowerName.includes('kbis')) {
    return { category: 'Constitution & Kbis', code: '01.1', domain: 'Corporate' };
  }
  if (lowerName.includes('pacte') || lowerName.includes('actionnaire')) {
    return { category: 'Actionnariat', code: '01.2', domain: 'Corporate' };
  }
  if (lowerName.includes('pv') || lowerName.includes('assemblee') || lowerName.includes('conseil')) {
    return { category: 'Vie Sociale', code: '01.3', domain: 'Corporate' };
  }
  if (lowerName.includes('contrat') && !lowerName.includes('travail')) {
    return { category: 'Contrats Materiels', code: '01.4', domain: 'Corporate' };
  }

  // Social documents
  if (lowerName.includes('contrat') && lowerName.includes('travail')) {
    return { category: 'Contrats Travail', code: '03.2', domain: 'Social' };
  }
  if (lowerName.includes('paie') || lowerName.includes('bulletin') || lowerName.includes('salaire')) {
    return { category: 'Paie', code: '03.3', domain: 'Social' };
  }
  if (lowerName.includes('urssaf') || lowerName.includes('cotisation') || lowerName.includes('social')) {
    return { category: 'Effectifs', code: '03.1', domain: 'Social' };
  }
  if (lowerName.includes('effectif') || lowerName.includes('registre')) {
    return { category: 'Effectifs', code: '03.1', domain: 'Social' };
  }

  // IP/IT documents
  if (lowerName.includes('marque') || lowerName.includes('inpi') || lowerName.includes('brevet')) {
    return { category: 'Propriete Intellectuelle', code: '04.1', domain: 'IP/IT' };
  }
  if (lowerName.includes('rgpd') || lowerName.includes('gdpr') || lowerName.includes('donnees')) {
    return { category: 'RGPD', code: '04.4', domain: 'IP/IT' };
  }
  if (lowerName.includes('licence') || lowerName.includes('software') || lowerName.includes('logiciel')) {
    return { category: 'IT', code: '04.3', domain: 'IP/IT' };
  }
  if (lowerName.includes('nom de domaine') || lowerName.includes('domain')) {
    return { category: 'Noms de Domaine', code: '04.2', domain: 'IP/IT' };
  }

  // Default to Corporate if cannot classify
  return { category: 'Documents Divers', code: '01.5', domain: 'Corporate' };
}

/**
 * Get domain from category code
 */
function getDomainFromCategory(code: string): DomainType | undefined {
  if (code.startsWith('01')) return 'Corporate';
  if (code.startsWith('02')) return 'TAX';
  if (code.startsWith('03')) return 'Social';
  if (code.startsWith('04')) return 'IP/IT';
  return undefined;
}
