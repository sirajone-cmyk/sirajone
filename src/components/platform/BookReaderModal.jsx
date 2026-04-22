import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Lock,
  Sparkles,
  Unlock,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

const SUBSCRIPTION_TIER = {
  free: 0,
  basic: 1,
  premium: 2,
};

function normalizeTier(value) {
  const tier = String(value || '').trim().toLowerCase();
  if (tier === 'premium') return 'premium';
  if (tier === 'basic') return 'basic';
  return 'free';
}

function resolveUserTier(currentUser) {
  const explicit = normalizeTier(currentUser?.subscriptionTier);
  if (explicit !== 'free') return explicit;
  const role = String(currentUser?.role || '').toLowerCase();
  if (role === 'admin' || role === 'teacher' || role === 'counselor') return 'premium';
  return 'free';
}

function splitTextIntoPages(text) {
  const clean = String(text || '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (!clean) return [];

  const explicitBreaks = clean.includes('\n---\n') ? clean.split('\n---\n') : [];
  const sourceChunks = explicitBreaks.length
    ? explicitBreaks
    : clean
        .split(/\n{2,}/)
        .map((chunk) => chunk.trim())
        .filter(Boolean);

  const pages = [];
  let bucket = '';
  sourceChunks.forEach((chunk) => {
    const candidate = bucket ? `${bucket}\n\n${chunk}` : chunk;
    if (candidate.length > 950 && bucket) {
      pages.push(bucket);
      bucket = chunk;
      return;
    }
    bucket = candidate;
  });
  if (bucket) pages.push(bucket);
  return pages;
}

function decodeTextDataUrl(dataUrl) {
  if (!String(dataUrl || '').startsWith('data:text/')) return '';
  const commaIdx = dataUrl.indexOf(',');
  if (commaIdx < 0) return '';
  const meta = dataUrl.slice(0, commaIdx).toLowerCase();
  const payload = dataUrl.slice(commaIdx + 1);
  try {
    if (meta.includes(';base64')) {
      return atob(payload);
    }
    return decodeURIComponent(payload);
  } catch {
    return '';
  }
}

function hasPdfLikeSource(book) {
  const fileName = String(book?.fileName || '').trim().toLowerCase();
  const fileUrl = String(book?.fileUrl || '').trim().toLowerCase();
  const dataUrl = String(book?.fileDataUrl || '').trim().toLowerCase();
  return (
    fileName.endsWith('.pdf') ||
    fileUrl.endsWith('.pdf') ||
    dataUrl.startsWith('data:application/pdf')
  );
}

function inferPdfPageCountFromDataUrl(dataUrl) {
  const raw = String(dataUrl || '');
  if (!raw.startsWith('data:application/pdf')) return 0;
  const commaIdx = raw.indexOf(',');
  if (commaIdx < 0) return 0;
  const meta = raw.slice(0, commaIdx).toLowerCase();
  if (!meta.includes(';base64')) return 0;

  try {
    const decoded = atob(raw.slice(commaIdx + 1));
    // Heuristic: count /Type /Page entries, excluding /Pages container nodes.
    const matches = decoded.match(/\/Type\s*\/Page(?!s)\b/g);
    return matches && matches.length ? matches.length : 0;
  } catch {
    return 0;
  }
}

function resolveProtectedSource(book) {
  const dataUrl = String(book?.fileDataUrl || '').trim();
  if (dataUrl) return dataUrl;
  const fileUrl = String(book?.fileUrl || '').trim();
  if (fileUrl) return fileUrl;
  return '';
}

function estimatePageCountFromBook(book) {
  const descWords = String(book?.description || '')
    .split(/\s+/)
    .filter(Boolean).length;
  const seed = descWords || 90;
  return Math.max(12, Math.min(360, Math.round(seed * 1.6)));
}

function buildBookPages(book, options = {}) {
  const { allowTeaserFallback = true } = options;
  if (!book) return [];
  if (Array.isArray(book.readerPages) && book.readerPages.length) {
    return book.readerPages
      .map((page) => String(page || '').trim())
      .filter(Boolean)
      .map((content, index) => ({ id: `stored_${index}`, content }));
  }

  const uploadedText = decodeTextDataUrl(book.fileDataUrl || '');
  if (uploadedText) {
    return splitTextIntoPages(uploadedText).map((content, index) => ({
      id: `upload_${index}`,
      content,
    }));
  }

  if (!allowTeaserFallback) return [];

  const teaserParagraphs = [
    book.description || '',
    `Category: ${book.mainCategory || 'General'}${book.subcategory ? ` · ${book.subcategory}` : ''}`,
    'This title is delivered through the protected SirajOne reader. Subscription unlocks complete reading access.',
  ]
    .map((entry) => String(entry || '').trim())
    .filter(Boolean);

  if (!teaserParagraphs.length) return [];

  const composed = [
    `${book.title || 'Untitled'}${book.author ? `\nBy ${book.author}` : ''}\n\n${teaserParagraphs[0] || ''}`,
    teaserParagraphs[1] || teaserParagraphs[0] || '',
    teaserParagraphs[2] || teaserParagraphs[0] || '',
  ];

  return composed
    .map((content, index) => ({ id: `teaser_${index}`, content: String(content || '').trim() }))
    .filter((page) => page.content);
}

function readerStatusTone(canAccessFull) {
  return canAccessFull
    ? 'border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.12)] text-[#d7ffe9]'
    : 'border-[rgba(250,204,21,0.35)] bg-[rgba(250,204,21,0.12)] text-[#fef08a]';
}

function tierLabel(tier) {
  if (tier === 'premium') return 'Premium';
  if (tier === 'basic') return 'Basic';
  return 'Free';
}

export function BookReaderModal({ open, book, onClose, currentUser }) {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [direction, setDirection] = useState(1);
  const [isTurning, setIsTurning] = useState(false);
  const touchStartXRef = useRef(null);
  const turnTimerRef = useRef(null);

  const userTier = useMemo(() => resolveUserTier(currentUser), [currentUser]);
  const requiredTier = useMemo(() => normalizeTier(book?.requiredTier), [book?.requiredTier]);
  const canAccessFull = SUBSCRIPTION_TIER[userTier] >= SUBSCRIPTION_TIER[requiredTier];
  const hasStructuredPages = useMemo(
    () => Array.isArray(book?.readerPages) && book.readerPages.length > 0,
    [book?.readerPages]
  );
  const hasTextSource = useMemo(
    () => Boolean(decodeTextDataUrl(book?.fileDataUrl || '')),
    [book?.fileDataUrl]
  );
  const hasPdfSource = useMemo(() => hasPdfLikeSource(book), [book]);
  const protectedSource = useMemo(() => resolveProtectedSource(book), [book]);
  const inferredPdfPageCount = useMemo(() => inferPdfPageCountFromDataUrl(book?.fileDataUrl), [book?.fileDataUrl]);
  const declaredPdfPageCount = useMemo(() => Math.max(0, Number(book?.pageCount) || 0), [book?.pageCount]);
  const estimatedPdfPageCount = useMemo(() => estimatePageCountFromBook(book), [book]);
  const embeddedPageCount = Math.max(
    1,
    declaredPdfPageCount || inferredPdfPageCount || estimatedPdfPageCount
  );
  const shouldUseEmbeddedSource =
    canAccessFull && hasPdfSource && !hasStructuredPages && !hasTextSource && Boolean(protectedSource);
  const pages = useMemo(
    () =>
      buildBookPages(book, {
        allowTeaserFallback: !shouldUseEmbeddedSource,
      }),
    [book, shouldUseEmbeddedSource]
  );
  const previewLimit = useMemo(() => Math.max(1, Number(book?.previewPageCount) || 3), [book?.previewPageCount]);

  const hasNextLockedPage = !canAccessFull && pages.length > previewLimit;
  const maxPage = shouldUseEmbeddedSource
    ? embeddedPageCount
    : canAccessFull
    ? Math.max(1, pages.length)
    : Math.max(1, Math.min(pages.length, previewLimit + (hasNextLockedPage ? 1 : 0)));
  const isPaywallPage = !canAccessFull && hasNextLockedPage && page > previewLimit;
  const contentPageIndex = Math.min(page, Math.max(1, pages.length)) - 1;
  const activePage = pages[contentPageIndex] || null;
  const hasAnySource = Boolean(book?.fileName || book?.fileDataUrl || book?.fileUrl || book?.description);

  useEffect(() => {
    if (!open) return undefined;
    setPage(1);
    setLoadError('');
    setDirection(1);
    setIsLoading(true);
    const timer = window.setTimeout(() => setIsLoading(false), 180);
    return () => window.clearTimeout(timer);
  }, [open, book?.id]);

  useEffect(() => {
    return () => {
      if (turnTimerRef.current) window.clearTimeout(turnTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [maxPage, page]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, page, maxPage]);

  function goPrev() {
    if (page <= 1) return;
    setDirection(-1);
    setIsTurning(true);
    if (turnTimerRef.current) window.clearTimeout(turnTimerRef.current);
    turnTimerRef.current = window.setTimeout(() => setIsTurning(false), 220);
    setPage((prev) => Math.max(1, prev - 1));
  }

  function goNext() {
    if (page >= maxPage) return;
    setDirection(1);
    setIsTurning(true);
    if (turnTimerRef.current) window.clearTimeout(turnTimerRef.current);
    turnTimerRef.current = window.setTimeout(() => setIsTurning(false), 220);
    setPage((prev) => Math.min(maxPage, prev + 1));
  }

  useEffect(() => {
    if (!shouldUseEmbeddedSource || !open) return undefined;
    setIsLoading(true);
    const timer = window.setTimeout(() => setIsLoading(false), 140);
    return () => window.clearTimeout(timer);
  }, [page, shouldUseEmbeddedSource, open]);

  function onTouchStart(event) {
    touchStartXRef.current = event.changedTouches?.[0]?.clientX || null;
  }

  function onTouchEnd(event) {
    if (touchStartXRef.current === null) return;
    const end = event.changedTouches?.[0]?.clientX || 0;
    const delta = end - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(delta) < 48) return;
    if (delta < 0) goNext();
    if (delta > 0) goPrev();
  }

  const modalTitle = book?.title ? `Read: ${book.title}` : 'Book Reader';

  return (
    <Modal open={open} onClose={onClose} title={modalTitle} className="w-[min(1120px,100%)] max-h-[92vh]">
      {!book ? null : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-lg md:text-xl font-semibold text-white">{book.title}</p>
              <p className="text-sm text-[rgba(219,242,230,0.7)]">
                {book.subcategory || 'General'}
                {book.author ? ` · ${book.author}` : ''}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold ${readerStatusTone(canAccessFull)}`}>
                {canAccessFull ? <Unlock size={13} /> : <Lock size={13} />}
                Your Plan: {tierLabel(userTier)}
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(34,197,94,0.24)] bg-[rgba(34,197,94,0.08)] px-2.5 py-1.5 text-xs font-semibold text-[#c8f8df]">
                <BookOpen size={13} />
                Requires: {tierLabel(requiredTier)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[rgba(34,197,94,0.18)] bg-[rgba(17,26,21,0.8)] px-3 py-2">
            <div className="text-xs text-[rgba(219,242,230,0.72)]">
              {shouldUseEmbeddedSource
                ? 'Immersive document reading mode'
                : 'Distraction-free reading mode'}
            </div>
            <div className="inline-flex items-center gap-2">
              <Button type="button" size="sm" variant="ghost" onClick={goPrev} disabled={page <= 1}>
                <ChevronLeft size={14} />
                Prev
              </Button>
              <span className="min-w-[84px] text-center rounded-lg border border-[rgba(34,197,94,0.2)] bg-[rgba(10,15,13,0.65)] px-2 py-1 text-xs text-[#c8f8df]">
                Page {page}/{maxPage}
              </span>
              <Button type="button" size="sm" variant="ghost" onClick={goNext} disabled={page >= maxPage}>
                Next
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(6,13,9,0.95)] p-8">
              <p className="inline-flex items-center gap-2 text-sm text-[#c8f8df]">
                <Loader2 size={16} className="animate-spin" />
                Preparing reading experience...
              </p>
            </div>
          ) : shouldUseEmbeddedSource ? (
            <div className="relative rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[linear-gradient(140deg,rgba(8,28,19,0.96),rgba(7,18,14,0.98))] overflow-hidden">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-[rgba(10,15,13,0.65)] to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[rgba(10,15,13,0.65)] to-transparent" />
              <div className="h-[72vh] min-h-[460px] md:min-h-[600px] w-full">
                <iframe
                  key={`pdf_${book?.id || 'book'}_${page}`}
                  title={`${book.title || 'Book'} full reader`}
                  src={`${protectedSource}#page=${page}&toolbar=0&navpanes=0&scrollbar=0&view=FitH&pagemode=none`}
                  className="h-full w-full border-0 bg-[rgba(6,13,9,0.96)]"
                />
              </div>
              <div className="border-t border-[rgba(34,197,94,0.16)] bg-[rgba(6,13,9,0.55)] px-4 py-2">
                <p className="text-xs text-[rgba(219,242,230,0.62)]">
                  Tip: Use arrows, swipe, or Prev/Next to turn pages.
                </p>
              </div>
            </div>
          ) : !pages.length ? (
            <div className="rounded-2xl border border-[rgba(248,113,113,0.3)] bg-[rgba(127,29,29,0.14)] p-4">
              <p className="inline-flex items-center gap-2 text-sm text-[#fecaca] font-semibold">
                <AlertCircle size={16} />
                This title has no readable pages yet.
              </p>
              <p className="mt-2 text-sm text-[rgba(219,242,230,0.72)]">
                Ask admin to upload structured reader content or a plain text source.
              </p>
              {hasAnySource ? (
                <p className="mt-2 text-xs text-[rgba(254,202,202,0.88)]">
                  Source exists but cannot be rendered in protected reader mode yet.
                </p>
              ) : null}
            </div>
          ) : (
            <div
              className="relative rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[linear-gradient(140deg,rgba(8,28,19,0.96),rgba(7,18,14,0.98))] overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div className="h-[60vh] md:h-[68vh] overflow-y-auto overscroll-contain p-4 md:p-6">
                <div
                  key={`${activePage?.id || 'empty'}_${page}`}
                  className={`mx-auto h-full max-w-3xl rounded-2xl border border-[rgba(34,197,94,0.22)] bg-[rgba(14,24,19,0.82)] p-5 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.45)] ${direction > 0 ? 'animate-fade-up' : 'animate-fade-down'}`}
                  style={{
                    transition: 'transform 220ms ease, opacity 220ms ease',
                    transform: isTurning
                      ? `perspective(1400px) rotateY(${direction > 0 ? '-' : ''}8deg) scale(0.995)`
                      : 'perspective(1400px) rotateY(0deg) scale(1)',
                    transformOrigin: direction > 0 ? 'left center' : 'right center',
                  }}
                >
                  <div className="mb-5 flex items-center justify-between gap-2 border-b border-[rgba(34,197,94,0.2)] pb-3">
                    <p className="text-sm font-semibold tracking-[0.08em] text-[rgba(134,239,172,0.8)] uppercase">Chapter View</p>
                    <p className="text-xs text-[rgba(219,242,230,0.62)]">Progress {Math.round((page / maxPage) * 100)}%</p>
                  </div>

                  {!isPaywallPage ? (
                    <article className="space-y-4 text-[rgba(232,255,244,0.92)]">
                      {String(activePage?.content || '')
                        .split(/\n{2,}/)
                        .map((paragraph, index) => (
                          <p key={`${activePage?.id || 'p'}_${index}`} className="text-base md:text-lg leading-8 md:leading-9">
                            {paragraph}
                          </p>
                        ))}
                    </article>
                  ) : (
                    <div className="relative h-full min-h-[360px]">
                      <div className="pointer-events-none select-none opacity-25 blur-[3px]">
                        {String(activePage?.content || pages[previewLimit]?.content || '')
                          .split(/\n{2,}/)
                          .slice(0, 3)
                          .map((paragraph, index) => (
                            <p key={`locked_${index}`} className="text-base md:text-lg leading-8 md:leading-9">
                              {paragraph}
                            </p>
                          ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full max-w-lg rounded-2xl border border-[rgba(250,204,21,0.36)] bg-[rgba(33,24,8,0.86)] p-5 md:p-6 text-center shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
                          <p className="inline-flex items-center gap-2 text-[#fde68a] text-sm font-semibold uppercase tracking-[0.08em]">
                            <Sparkles size={15} />
                            Preview complete
                          </p>
                          <h4 className="mt-2 text-2xl md:text-3xl font-bold text-white">Unlock the full book</h4>
                          <p className="mt-2 text-[rgba(255,251,235,0.88)] leading-7">
                            You reached the free preview. Subscribe to continue reading this title and unlock full library access.
                          </p>
                          <div className="mt-4 grid gap-2 md:grid-cols-2">
                            <div className="rounded-xl border border-[rgba(217,119,6,0.35)] bg-[rgba(217,119,6,0.12)] p-3 text-left">
                              <p className="text-sm font-semibold text-[#fbbf24]">Basic</p>
                              <p className="mt-1 text-xs text-[rgba(255,251,235,0.85)]">
                                Selected books and guided resources.
                              </p>
                            </div>
                            <div className="rounded-xl border border-[rgba(34,197,94,0.38)] bg-[rgba(34,197,94,0.14)] p-3 text-left">
                              <p className="text-sm font-semibold text-[#86efac]">Premium</p>
                              <p className="mt-1 text-xs text-[rgba(255,251,235,0.85)]">
                                Full digital library and premium content.
                              </p>
                            </div>
                          </div>
                          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                            <Button type="button" variant="primary" size="sm" href="#enroll">
                              Subscribe to Continue Reading
                            </Button>
                            <Button type="button" variant="ghost" size="sm" href="#contact">
                              Upgrade to Premium
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {loadError ? <p className="text-xs text-[#fecaca]">{loadError}</p> : null}

          {book.description ? (
            <div className="rounded-xl border border-[rgba(34,197,94,0.16)] bg-[rgba(17,26,21,0.6)] p-3">
              <p className="text-xs uppercase tracking-[0.08em] text-[rgba(219,242,230,0.5)]">Description</p>
              <p className="mt-1 text-sm text-[rgba(219,242,230,0.84)] leading-6">{book.description}</p>
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              <BookOpen size={14} />
              Close Reader
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}


