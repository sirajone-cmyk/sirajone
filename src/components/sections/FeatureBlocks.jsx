import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  BookText,
  CalendarDays,
  CircleDollarSign,
  Download,
  FileText,
  Globe,
  Grid2X2,
  List,
  Mail,
  Mic,
  Phone,
  Search,
  Trophy,
  Upload,
} from 'lucide-react';
import { Section } from '../layout/Section';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { usePlatform } from '../../state/PlatformContext';
import { generateBookCoverDataUrl } from '../../utils/bookCover';
import { BookReaderModal } from '../platform/BookReaderModal';

const FUTURE_COURSES = [
  {
    title: "Qira'at",
    arabic: 'Al-Qiraat',
    level: 'Advanced',
    description:
      "Advanced study of the multiple modes of authentic Qur'an recitation for dedicated students.",
    teachers: ['Qari Abbas', 'Qari Aminuddin'],
    prices: { group: 'R 450/mo', private: 'R 700/mo' },
    tone: 'border-[rgba(239,68,68,0.34)]',
    available: true,
  },
  {
    title: 'Fiqh',
    arabic: 'Al-Fiqh',
    level: 'All Levels',
    description:
      'Practical Islamic law for everyday life: worship, transactions, and daily rulings.',
    tone: 'border-[rgba(59,130,246,0.34)]',
    available: false,
  },
  {
    title: 'Hadith Studies',
    arabic: 'Al-Hadith',
    level: 'Intermediate',
    description:
      'Study sayings and traditions of the Prophet with proper context and explanation.',
    tone: 'border-[rgba(14,165,233,0.34)]',
    available: false,
  },
  {
    title: 'Tafsir',
    arabic: 'Al-Tafsir',
    level: 'Intermediate',
    description:
      "Deep understanding of Qur'an verses, their meanings, context, and scholarly interpretation.",
    tone: 'border-[rgba(168,85,247,0.34)]',
    available: false,
  },
  {
    title: 'Cupping Course',
    arabic: 'Al-Hijamah',
    level: 'All Levels',
    description:
      'Learn the Sunnah practice of Hijamah with theory and practical training.',
    tone: 'border-[rgba(239,68,68,0.34)]',
    available: false,
  },
];

const TEACHER_TAGS = [
  'Tajwid',
  "Qira'at",
  'Arabic',
  "Qur'an Reading",
  'Fiqh',
  'Aqeedah',
  'Cupping Course',
];

const TEACHERS = [
  {
    name: 'Ustadh Hashim bin Hussain',
    role: 'Founder and Lead Teacher',
    meta: 'Teaching since 2008 Â· Brothers and Sisters',
    bio: "Qualified in Tajweed, Qur'an recitation, Fiqh, Arabic, Qaidah, and Qur'an studies.",
    tags: ['Tajwid', "Qur'an Reading", 'Fiqh', 'Arabic', 'Qaidah'],
    featured: true,
  },
  {
    name: 'Muallimah Anisa',
    role: 'Female Teacher',
    meta: 'Teaching since 2015',
    bio: "Teaches Tajweed, Qaidah, and Qur'an with a calm, structured approach.",
    tags: ['Tajwid', 'Qaidah', "Qur'an Reading"],
  },
  {
    name: 'Muallimah Safiya',
    role: 'Islamic Studies Teacher',
    meta: 'Teaching since 2018',
    bio: 'Teaches Islamic Studies, Tajweed, Tafsir, Fiqh, Aqeedah, Arabic, and Akhlaq.',
    tags: ['Islamic Studies', 'Tafsir', 'Fiqh', 'Aqeedah', 'Arabic'],
  },
  {
    name: 'Muallimah Hasina',
    role: "Qur'an Teacher",
    meta: 'Teaching since 2015',
    bio: "Teaches Tajweed, Qaidah, and Qur'an with consistent student support.",
    tags: ['Tajwid', 'Qaidah', "Qur'an Reading"],
  },
  {
    name: 'Muallimah Halimah',
    role: "Qur'an and Arabic Teacher",
    meta: 'Teaching since 2010',
    bio: "Teaches Qur'an, Arabic, and Aqeedah with focus on clarity and confidence.",
    tags: ["Qur'an Reading", 'Arabic', 'Aqeedah'],
  },
  {
    name: 'Muallimah Salma',
    role: "Qur'an Teacher",
    meta: 'Teaching since 2015',
    bio: "Teaches Tajweed, Qaidah, and Qur'an in a focused learning environment.",
    tags: ['Tajwid', 'Qaidah', "Qur'an Reading"],
  },
  {
    name: 'Muallim Muhammad Abdul Malik',
    role: 'Arabic Language Instructor',
    meta: 'Quranic Arabic and Tafsir',
    bio: "Teaches Tafsir and Qur'anic Arabic vocabulary with practical language support.",
    tags: ['Arabic', "Qur'anic Arabic", 'Tafsir'],
  },
  {
    name: 'Qari Abba',
    role: "Qira'at Teacher",
    meta: 'Teaching since 2019',
    bio: "Qualified in all seven styles of recitation of the Qur'an.",
    tags: ["Qira'at", 'Advanced Recitation', 'Tajwid'],
  },
  {
    name: 'Qari Aminuddin',
    role: "Qira'at Teacher",
    meta: 'Teaching since 2019',
    bio: "Qualified in all seven styles of recitation of the Qur'an.",
    tags: ["Qira'at", 'Advanced Recitation', 'Tajwid'],
  },
];

const MAIN_LIBRARY_CATEGORIES = [
  'Storybooks',
  'Dua Books',
  'Fiqh Books',
  'Qaidah Books',
  'Tajweed Books',
  'Others',
];

const DEFAULT_SUBCATEGORIES = {
  Storybooks: [
    'Scholars of Hadith',
    'Scholars of Tafsir',
    'Sahaba Series',
    'Life of the Prophet ï·º',
    'Pious People',
    'Other Islamic Stories',
  ],
  'Dua Books': ['Daily Duas', 'Morning and Evening', 'Masnoon Duas', 'General Dua Collections'],
  'Fiqh Books': ['Fiqh of Taharah', 'Fiqh of Salah', 'Fiqh of Ramadan', 'Fiqh of Fasting'],
  'Qaidah Books': ['Qaida Noorania', 'Basic Qaidah', 'Reading Foundations'],
  'Tajweed Books': ['Makharij', 'Sifaat', 'Tajweed Rules', 'Applied Tajweed'],
  Others: ['General'],
};

const DASHBOARD_SUMMARY = [
  { title: 'Tajwid Foundations', sub: 'Intermediate Program', icon: BookOpen },
  { title: '45%', sub: '18 of 40 lessons Progress', icon: Trophy },
  { title: '7 days', sub: 'Keep it going! Day Streak', icon: Trophy },
  { title: 'Tomorrow', sub: '10:00 AM Next Class', icon: Trophy },
];

const LESSON_PLAN = [
  {
    title: 'Lesson 19: Ikhfa Rules',
    details:
      "Today's new lesson: learn Ikhfa letters and apply them with Noon Sakinah and Tanween.",
  },
  {
    title: "Awal Muraja'ah: Lessons 10-15",
    details: 'Revise idgham with and without ghunnah. Focus on smooth transitions.',
  },
  {
    title: "Akhir Muraja'ah: Lessons 1-9",
    details: 'Full revision of Makharij groups and Sifat pairs.',
  },
];

const TOPIC_TRACKER = [
  {
    topic: 'Noon Sakinah and Tanween',
    status: 'Completed',
    tone: 'bg-[rgba(16,185,129,0.25)] text-[#bbf7d0]',
  },
  {
    topic: 'Meem Sakinah',
    status: 'Completed',
    tone: 'bg-[rgba(16,185,129,0.25)] text-[#bbf7d0]',
  },
  {
    topic: 'Madd Types',
    status: 'In Progress',
    tone: 'bg-[rgba(249,115,22,0.3)] text-[#fed7aa]',
  },
  { topic: 'Qalqalah', status: 'Pending', tone: 'bg-[rgba(51,65,85,0.6)] text-[#cbd5e1]' },
  { topic: 'Lam Rules', status: 'Pending', tone: 'bg-[rgba(51,65,85,0.6)] text-[#cbd5e1]' },
  { topic: 'Ra Rules', status: 'Pending', tone: 'bg-[rgba(51,65,85,0.6)] text-[#cbd5e1]' },
];

const FEEDBACK = [
  {
    date: '2 Apr 2026',
    note: 'Excellent progress on Idgham. Pay attention to Meem Mushaddadah shortening.',
  },
  {
    date: '30 Mar 2026',
    note: "Sabaq completed well. Awal Muraja'ah needs more work. Revise lessons 7-9 before next class.",
  },
  {
    date: '28 Mar 2026',
    note: 'Strong session today. Tajwid rules are being applied correctly. Keep up the consistency.',
  },
];

async function fileToDataUrl(file) {
  if (!file) return { fileName: '', dataUrl: '' };
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
  return {
    fileName: file.name,
    dataUrl,
  };
}

async function fileToText(file) {
  if (!file) return '';
  return file.text();
}

function splitReaderPages(rawText) {
  const clean = String(rawText || '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (!clean) return [];

  const chunks = clean.includes('\n---\n')
    ? clean.split('\n---\n')
    : clean
        .split(/\n{2,}/)
        .map((chunk) => chunk.trim())
        .filter(Boolean);

  const pages = [];
  let bucket = '';
  chunks.forEach((chunk) => {
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

const MAX_INLINE_BOOK_FILE_BYTES = 2 * 1024 * 1024;
const SUBSCRIPTION_TIERS = ['free', 'basic', 'premium'];

export function FeatureBlocksSection() {
  const { state, currentUser, isAdmin, upsertLibraryBook, deleteLibraryBook } = usePlatform();
  const [librarySearch, setLibrarySearch] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('Storybooks');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [libraryViewMode, setLibraryViewMode] = useState('list');
  const [editingBookId, setEditingBookId] = useState('');
  const [bookCoverFile, setBookCoverFile] = useState(null);
  const [bookUploadFile, setBookUploadFile] = useState(null);
  const [generatedCoverDataUrl, setGeneratedCoverDataUrl] = useState('');
  const [libraryNotice, setLibraryNotice] = useState('');
  const [readerBook, setReaderBook] = useState(null);
  const [bookForm, setBookForm] = useState({
    title: '',
    description: '',
    mainCategory: 'Storybooks',
    subcategory: '',
    author: '',
    fileUrl: '',
    visibility: 'public',
    publishStatus: 'published',
    requiredTier: 'free',
    pageCount: 120,
    previewPageCount: 3,
    readerSeedText: '',
  });

  const allBooks = state.libraryBooks || [];

  const subcategoryOptions = useMemo(() => {
    const defaults = DEFAULT_SUBCATEGORIES[selectedMainCategory] || [];
    const fromBooks = allBooks
      .filter((book) => book.mainCategory === selectedMainCategory)
      .map((book) => book.subcategory)
      .filter(Boolean);
    return Array.from(new Set([...defaults, ...fromBooks]));
  }, [allBooks, selectedMainCategory]);

  const visibleBooks = useMemo(() => {
    const q = librarySearch.trim().toLowerCase();
    return allBooks
      .filter((book) => book.mainCategory === selectedMainCategory)
      .filter((book) => selectedSubcategory === 'All' || book.subcategory === selectedSubcategory)
      .filter((book) => (isAdmin ? true : book.publishStatus === 'published' && book.visibility === 'public'))
      .filter((book) => {
        if (!q) return true;
        return (
          (book.title || '').toLowerCase().includes(q) ||
          (book.description || '').toLowerCase().includes(q) ||
          (book.author || '').toLowerCase().includes(q)
        );
      });
  }, [allBooks, selectedMainCategory, selectedSubcategory, isAdmin, librarySearch]);

  function beginEdit(book) {
    setEditingBookId(book.id);
    setBookCoverFile(null);
    setBookUploadFile(null);
    setGeneratedCoverDataUrl('');
    setLibraryNotice('');
    setBookForm({
      title: book.title || '',
      description: book.description || '',
      mainCategory: book.mainCategory || 'Storybooks',
      subcategory: book.subcategory || '',
      author: book.author || '',
      fileUrl: book.fileUrl || '',
      visibility: book.visibility || 'public',
      publishStatus: book.publishStatus || 'published',
      requiredTier: book.requiredTier || 'free',
      pageCount: Number(book.pageCount) || 120,
      previewPageCount: Number(book.previewPageCount) || 3,
      readerSeedText: Array.isArray(book.readerPages) ? book.readerPages.join('\n---\n') : '',
    });
  }

  function resetBookForm() {
    setEditingBookId('');
    setBookCoverFile(null);
    setBookUploadFile(null);
    setGeneratedCoverDataUrl('');
    setLibraryNotice('');
    setBookForm({
      title: '',
      description: '',
      mainCategory: selectedMainCategory,
      subcategory: '',
      author: '',
      fileUrl: '',
      visibility: 'public',
      publishStatus: 'published',
      requiredTier: 'free',
      pageCount: 120,
      previewPageCount: 3,
      readerSeedText: '',
    });
  }

  async function onSaveBook(event) {
    event.preventDefault();
    setLibraryNotice('');
    const coverPayload = await fileToDataUrl(bookCoverFile);
    const existing = editingBookId ? allBooks.find((book) => book.id === editingBookId) : null;
    const autoGeneratedCover =
      generatedCoverDataUrl ||
      generateBookCoverDataUrl({
        title: bookForm.title,
        mainCategory: bookForm.mainCategory,
        subcategory: bookForm.subcategory,
        description: bookForm.description,
        author: bookForm.author,
      });
    const finalCover = coverPayload.dataUrl || autoGeneratedCover || existing?.coverDataUrl || '';

    let nextFileDataUrl = existing?.fileDataUrl || '';
    let nextFileName = existing?.fileName || '';
    let nextReaderPages = Array.isArray(existing?.readerPages) ? existing.readerPages : [];
    const nextFileUrl = (bookForm.fileUrl || '').trim() || existing?.fileUrl || '';
    const seededPages = splitReaderPages(bookForm.readerSeedText);
    if (seededPages.length) {
      nextReaderPages = seededPages;
    }
    if (bookUploadFile) {
      nextFileName = bookUploadFile.name;
      if (bookUploadFile.size <= MAX_INLINE_BOOK_FILE_BYTES) {
        const filePayload = await fileToDataUrl(bookUploadFile);
        nextFileDataUrl = filePayload.dataUrl || '';
        const lower = (bookUploadFile.name || '').toLowerCase();
        if (lower.endsWith('.txt') || lower.endsWith('.md')) {
          const uploadedText = await fileToText(bookUploadFile);
          const uploadedPages = splitReaderPages(uploadedText);
          if (uploadedPages.length) {
            nextReaderPages = uploadedPages;
          }
        }
      } else {
        nextFileDataUrl = '';
        setLibraryNotice(
          'Book file is large. Metadata was saved safely; connect cloud storage later for full file delivery.'
        );
      }
    }

    const nextMainCategory = bookForm.mainCategory || 'Storybooks';
    const nextSubcategory = bookForm.subcategory || 'All';

    upsertLibraryBook({
      ...(existing || {}),
      id: editingBookId || undefined,
      ...bookForm,
      coverDataUrl: finalCover,
      coverFileName:
        coverPayload.fileName ||
        existing?.coverFileName ||
        (finalCover ? 'auto-generated-cover.svg' : ''),
      fileUrl: nextFileUrl,
      fileDataUrl: nextFileDataUrl,
      fileName: nextFileName,
      requiredTier: bookForm.requiredTier,
      pageCount: Number(bookForm.pageCount) || 120,
      previewPageCount: Number(bookForm.previewPageCount) || 3,
      readerPages: nextReaderPages,
    });

    setSelectedMainCategory(nextMainCategory);
    setSelectedSubcategory(nextSubcategory);
    setLibrarySearch('');

    resetBookForm();
  }

  function onGenerateCover() {
    const autoCover = generateBookCoverDataUrl({
      title: bookForm.title,
      mainCategory: bookForm.mainCategory,
      subcategory: bookForm.subcategory,
      description: bookForm.description,
      author: bookForm.author,
    });
    setGeneratedCoverDataUrl(autoCover);
  }

  function openBookReader(book) {
    setReaderBook(book);
  }

  function closeBookReader() {
    setReaderBook(null);
  }

  return (
    <>
      <Section id="enroll" variant="pattern" py="py-14 md:py-20">
        <div className="text-center mb-8">
          <p className="section-eyebrow text-[#facc15]">Coming Soon</p>
          <h2 className="section-title">Expanding Islamic Knowledge Beyond Tajwid</h2>
          <p className="section-subtitle">Comprehensive Islamic education paths launching soon.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {FUTURE_COURSES.map((course) => (
            <article
              key={course.title}
              className={`rounded-3xl border ${course.tone} bg-[rgba(17,26,21,0.86)] px-5 py-5`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-2xl md:text-3xl font-bold text-[#f0fdf4] leading-tight">
                  {course.title}
                </h3>
                <span className="rounded-full bg-[rgba(239,68,68,0.2)] px-2.5 py-1 text-xs font-semibold text-[#fecaca]">
                  {course.level}
                </span>
              </div>
              <p className="mt-1 text-sm text-[rgba(217,236,225,0.45)]">{course.arabic}</p>
              <p className="mt-3 text-[rgba(219,242,230,0.86)] leading-7">{course.description}</p>

              {course.prices ? (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-[rgba(217,236,225,0.35)] p-3 text-center">
                    <p className="text-xs text-[rgba(219,242,230,0.55)]">Group</p>
                    <p className="text-2xl font-bold text-white">
                      {course.prices.group.split('/')[0]}
                    </p>
                    <p className="text-xs text-[rgba(219,242,230,0.55)]">
                      /{course.prices.group.split('/')[1]}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[rgba(217,236,225,0.35)] p-3 text-center">
                    <p className="text-xs text-[rgba(219,242,230,0.55)]">Private</p>
                    <p className="text-2xl font-bold text-white">
                      {course.prices.private.split('/')[0]}
                    </p>
                    <p className="text-xs text-[rgba(219,242,230,0.55)]">
                      /{course.prices.private.split('/')[1]}
                    </p>
                  </div>
                </div>
              ) : null}

              {course.teachers ? (
                <div className="mt-4">
                  <p className="text-xs tracking-[0.11em] uppercase text-[rgba(219,242,230,0.52)] font-semibold">
                    Teachers
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {course.teachers.map((teacher) => (
                      <span
                        key={teacher}
                        className="inline-flex items-center gap-1 rounded-full border border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.1)] px-2.5 py-1 text-xs text-[#8ff2bf]"
                      >
                        <Search size={10} /> {teacher}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-5">
                {course.available ? (
                  <Button variant="primary" size="md" href="#contact" className="w-full justify-center">
                    Enroll Now <ArrowRight size={15} />
                  </Button>
                ) : (
                  <button
                    type="button"
                    className="w-full rounded-xl border border-[rgba(219,242,230,0.45)] bg-[rgba(255,255,255,0.02)] px-4 py-3 text-[#facc15] font-semibold"
                  >
                    <span className="inline-flex items-center gap-2">
                      <CircleDollarSign size={14} /> Coming Soon
                    </span>
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="teachers" variant="alt" py="py-14 md:py-20">
        <div className="text-center mb-8">
          <p className="section-eyebrow">Our Faculty</p>
          <h2 className="section-title">Our Teachers</h2>
          <p className="section-subtitle">
            Qualified, experienced, and dedicated to your Qur&apos;anic education.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {TEACHER_TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[rgba(34,197,94,0.24)] bg-[rgba(34,197,94,0.11)] px-3 py-1 text-sm text-[#b9f7d6]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEACHERS.map((teacher) => (
            <article
              key={teacher.name}
              className={`rounded-3xl border ${
                teacher.featured
                  ? 'md:col-span-2 border-[rgba(34,197,94,0.42)] bg-[rgba(13,39,26,0.7)]'
                  : 'border-[rgba(34,197,94,0.22)] bg-[rgba(17,26,21,0.82)]'
              } px-5 py-6`}
            >
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl border border-[rgba(34,197,94,0.24)] bg-[rgba(34,197,94,0.08)] flex items-center justify-center">
                  <BookOpen size={18} className="text-[#c2f6dd]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#f0fdf4]">{teacher.name}</h3>
                  <p className="text-[#49de9a] font-medium">{teacher.role}</p>
                  <p className="text-[rgba(219,242,230,0.46)] text-sm">{teacher.meta}</p>
                </div>
                {teacher.featured ? (
                  <span className="rounded-full bg-[rgba(251,191,36,0.2)] px-3 py-1 text-xs text-[#facc15]">
                    Founder
                  </span>
                ) : null}
              </div>

              <p className="mt-3 text-[rgba(219,242,230,0.82)] leading-7">{teacher.bio}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {teacher.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.2)] px-2.5 py-1 text-xs text-[#b9f7d6]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {teacher.featured ? (
                <div className="mt-4 flex flex-wrap gap-4 text-[rgba(219,242,230,0.8)]">
                  <span className="inline-flex items-center gap-2">
                    <Phone size={14} /> +27 67 634 0225
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Mail size={14} /> sirajone7@gmail.com
                  </span>
                </div>
              ) : null}
            </article>
          ))}
        </div>

        <article className="mt-6 rounded-3xl border border-[rgba(34,197,94,0.26)] bg-[rgba(17,26,21,0.84)] px-5 py-7 text-center">
          <h3 className="text-2xl md:text-4xl font-bold text-white">Book a Personal Lesson</h3>
          <p className="mt-2 text-[rgba(219,242,230,0.82)]">
            Contact Ustadh Hashim to be matched with the right teacher for your level, age,
            and goals.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              href="https://wa.me/27676340225"
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-[200px] justify-center"
            >
              WhatsApp Us <ArrowRight size={15} />
            </Button>
            <Button
              variant="secondary"
              size="md"
              href="mailto:sirajone7@gmail.com"
              className="min-w-[200px] justify-center"
            >
              Email Request
            </Button>
          </div>
        </article>
      </Section>

      <Section id="library" variant="pattern" py="py-14 md:py-20">
        <div className="text-center mb-8">
          <p className="section-eyebrow">Digital Collection</p>
          <h2 className="section-title">Islamic Library</h2>
          <p className="section-subtitle">Books, resources, and learning materials for students</p>
        </div>

        <div className="rounded-2xl border border-[rgba(219,242,230,0.28)] bg-[rgba(255,255,255,0.95)] px-4 py-3 flex items-center gap-2 max-w-4xl mx-auto">
          <Search size={16} className="text-[#6b7280]" />
          <input
            className="w-full bg-transparent text-[#111827] outline-none"
            placeholder="Search books..."
            value={librarySearch}
            onChange={(event) => setLibrarySearch(event.target.value)}
          />
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {MAIN_LIBRARY_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setSelectedMainCategory(category);
                setSelectedSubcategory('All');
              }}
              className={`rounded-full px-3 py-1 text-sm border ${
                selectedMainCategory === category
                  ? 'bg-[rgba(34,197,94,0.2)] border-[rgba(34,197,94,0.36)] text-[#d7ffe9]'
                  : 'bg-[rgba(17,26,21,0.76)] border-[rgba(34,197,94,0.16)] text-[rgba(219,242,230,0.82)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedSubcategory('All')}
            className={`rounded-full px-3 py-1 text-xs border ${
              selectedSubcategory === 'All'
                ? 'bg-[rgba(34,197,94,0.2)] border-[rgba(34,197,94,0.36)] text-[#d7ffe9]'
                : 'bg-[rgba(17,26,21,0.76)] border-[rgba(34,197,94,0.16)] text-[rgba(219,242,230,0.82)]'
            }`}
          >
            All
          </button>
          {subcategoryOptions.map((subcategory) => (
            <button
              key={subcategory}
              type="button"
              onClick={() => setSelectedSubcategory(subcategory)}
              className={`rounded-full px-3 py-1 text-xs border ${
                selectedSubcategory === subcategory
                  ? 'bg-[rgba(34,197,94,0.2)] border-[rgba(34,197,94,0.36)] text-[#d7ffe9]'
                  : 'bg-[rgba(17,26,21,0.76)] border-[rgba(34,197,94,0.16)] text-[rgba(219,242,230,0.82)]'
              }`}
            >
              {subcategory}
            </button>
          ))}
        </div>

        <div className="mt-8 max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-4xl md:text-6xl font-bold text-white inline-flex items-center gap-3">
              <BookText size={34} className="text-[#c8f8df]" /> {selectedMainCategory}
              <span className="text-xl text-[rgba(219,242,230,0.72)] font-normal">
                {visibleBooks.length} item{visibleBooks.length === 1 ? '' : 's'}
              </span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedSubcategory('All')}
                className={`rounded-2xl border px-5 py-2 text-lg font-semibold transition ${
                  selectedSubcategory === 'All'
                    ? 'border-[rgba(34,197,94,0.38)] bg-[rgba(34,197,94,0.24)] text-[#d7ffe9]'
                    : 'border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.8)] text-[rgba(219,242,230,0.84)]'
                }`}
              >
                All
              </button>
              <button
                type="button"
                aria-label="Grid view"
                onClick={() => setLibraryViewMode('grid')}
                className={`rounded-2xl border p-2.5 transition ${
                  libraryViewMode === 'grid'
                    ? 'border-[rgba(34,197,94,0.38)] bg-[rgba(34,197,94,0.18)] text-[#d7ffe9]'
                    : 'border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.8)] text-[rgba(219,242,230,0.74)]'
                }`}
              >
                <Grid2X2 size={20} />
              </button>
              <button
                type="button"
                aria-label="List view"
                onClick={() => setLibraryViewMode('list')}
                className={`rounded-2xl border p-2.5 transition ${
                  libraryViewMode === 'list'
                    ? 'border-[rgba(34,197,94,0.38)] bg-[rgba(34,197,94,0.18)] text-[#d7ffe9]'
                    : 'border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.8)] text-[rgba(219,242,230,0.74)]'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {visibleBooks.length === 0 ? (
            <article className="mt-4 rounded-3xl border border-[rgba(34,197,94,0.22)] bg-[rgba(17,26,21,0.84)] p-5">
              <p className="text-[rgba(219,242,230,0.84)] leading-7">
                No books available in this category yet.
              </p>
            </article>
          ) : (
            <div className={libraryViewMode === 'grid' ? 'mt-5 grid gap-4 md:grid-cols-2' : 'mt-5 space-y-5'}>
              {visibleBooks.map((book) => {
                const displayCover =
                  book.coverDataUrl ||
                  generateBookCoverDataUrl({
                    title: book.title,
                    mainCategory: book.mainCategory,
                    subcategory: book.subcategory,
                    description: book.description,
                    author: book.author,
                  });

                const inferredPages =
                  Number(book.pageCount) ||
                  Math.max(
                    24,
                    Math.min(
                      360,
                      Math.round(((book.description || '').split(/\s+/).filter(Boolean).length || 30) * 2.5)
                    )
                  );
                const fileExt =
                  (book.fileName || book.fileUrl || '')
                    .split('.')
                    .pop()
                    ?.split('?')[0]
                    ?.toUpperCase() || 'PDF';
                const language = book.language || 'English';
                const publishedYear =
                  book.publishedYear ||
                  (book.updatedAt ? new Date(book.updatedAt).getFullYear() : new Date().getFullYear());
                const hasReadableSource = Boolean(
                  (Array.isArray(book.readerPages) && book.readerPages.length) ||
                    book.fileDataUrl ||
                    book.fileUrl ||
                    book.description
                );

                if (libraryViewMode === 'grid') {
                  return (
                    <article
                      key={book.id}
                      className="rounded-3xl border border-[rgba(34,197,94,0.22)] bg-[rgba(17,26,21,0.84)] p-5"
                    >
                      <div className="flex items-start gap-3">
                        {displayCover ? (
                          <div className="w-24 aspect-[2/3] rounded-xl overflow-hidden border border-[rgba(34,197,94,0.24)] bg-[rgba(10,15,13,0.45)] flex-shrink-0">
                            <img
                              src={displayCover}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-24 aspect-[2/3] rounded-xl border border-[rgba(34,197,94,0.24)] bg-[rgba(34,197,94,0.1)] flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h4 className="text-2xl font-bold text-white">{book.title}</h4>
                          <p className="text-[rgba(219,242,230,0.62)]">
                            {book.subcategory || 'General'}
                            {book.author ? ` · ${book.author}` : ''}
                          </p>
                        </div>
                      </div>
                      {book.description ? (
                        <p className="mt-3 text-[rgba(219,242,230,0.84)] leading-7">{book.description}</p>
                      ) : null}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {hasReadableSource ? (
                          <button
                            type="button"
                            onClick={() => openBookReader(book)}
                            className="inline-flex items-center rounded-full border border-[rgba(34,197,94,0.26)] bg-[rgba(34,197,94,0.14)] px-3 py-1 text-xs text-[#d7ffe9]"
                          >
                            Read Book
                          </button>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-[rgba(148,163,184,0.35)] bg-[rgba(148,163,184,0.15)] px-3 py-1 text-xs text-[rgba(219,242,230,0.7)]">
                            {book.fileName
                              ? `Uploaded: ${book.fileName}`
                              : book.fileUrl
                              ? 'External file linked'
                              : 'File not uploaded'}
                          </span>
                        )}
                        {isAdmin ? (
                          <>
                            <button
                              type="button"
                              onClick={() => beginEdit(book)}
                              className="inline-flex items-center rounded-full border border-[rgba(56,189,248,0.35)] bg-[rgba(56,189,248,0.12)] px-3 py-1 text-xs text-[#bae6fd]"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteLibraryBook(book.id)}
                              className="inline-flex items-center rounded-full border border-[rgba(248,113,113,0.35)] bg-[rgba(248,113,113,0.12)] px-3 py-1 text-xs text-[#fecaca]"
                            >
                              Delete
                            </button>
                          </>
                        ) : null}
                      </div>
                    </article>
                  );
                }

                return (
                  <article
                    key={book.id}
                    className="rounded-[28px] border border-[rgba(34,197,94,0.24)] bg-[rgba(9,26,19,0.9)] px-4 py-4 md:px-6 md:py-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                  >
                    <div className="grid gap-4 md:grid-cols-[minmax(210px,320px)_1fr] md:gap-8">
                      <div className="rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(11,31,22,0.7)] p-3">
                        {displayCover ? (
                          <div className="w-full max-w-[320px] mx-auto aspect-[2/3] rounded-xl overflow-hidden border border-[rgba(219,242,230,0.2)]">
                            <img
                              src={displayCover}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-full max-w-[320px] mx-auto aspect-[2/3] rounded-xl border border-[rgba(34,197,94,0.24)] bg-[rgba(34,197,94,0.1)]" />
                        )}
                      </div>

                      <div className="flex flex-col">
                        <h4 className="text-4xl md:text-6xl font-bold text-white leading-tight">{book.title}</h4>
                        <p className="mt-1 text-2xl text-[rgba(219,242,230,0.78)]">
                          {(book.subcategory || 'General').toUpperCase()}
                          {book.author ? ` • ${book.author}` : ''}
                        </p>

                        <div className="mt-4">
                          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(34,197,94,0.26)] bg-[rgba(34,197,94,0.14)] px-4 py-1.5 text-lg font-semibold text-[#bfffe1]">
                            <BookText size={18} />
                            {book.mainCategory || selectedMainCategory}
                          </span>
                        </div>

                        {book.description ? (
                          <p className="mt-4 text-xl leading-9 text-[rgba(219,242,230,0.9)] max-w-4xl">
                            {book.description}
                          </p>
                        ) : null}

                        <div className="mt-5 border-t border-[rgba(219,242,230,0.14)] pt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                          <div className="inline-flex items-start gap-2 text-[rgba(219,242,230,0.86)]">
                            <FileText size={20} className="mt-0.5 text-[#c8f8df]" />
                            <div>
                              <p className="text-2xl md:text-3xl font-semibold leading-none">{inferredPages}</p>
                              <p className="text-sm text-[rgba(219,242,230,0.62)]">Pages</p>
                            </div>
                          </div>
                          <div className="inline-flex items-start gap-2 text-[rgba(219,242,230,0.86)]">
                            <Globe size={20} className="mt-0.5 text-[#c8f8df]" />
                            <div>
                              <p className="text-xl md:text-2xl font-semibold leading-none">{language}</p>
                              <p className="text-sm text-[rgba(219,242,230,0.62)]">Language</p>
                            </div>
                          </div>
                          <div className="inline-flex items-start gap-2 text-[rgba(219,242,230,0.86)]">
                            <Download size={20} className="mt-0.5 text-[#c8f8df]" />
                            <div>
                              <p className="text-xl md:text-2xl font-semibold leading-none">{fileExt}</p>
                              <p className="text-sm text-[rgba(219,242,230,0.62)]">Format</p>
                            </div>
                          </div>
                          <div className="inline-flex items-start gap-2 text-[rgba(219,242,230,0.86)]">
                            <CalendarDays size={20} className="mt-0.5 text-[#c8f8df]" />
                            <div>
                              <p className="text-xl md:text-2xl font-semibold leading-none">{publishedYear}</p>
                              <p className="text-sm text-[rgba(219,242,230,0.62)]">Published</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-2">
                          {hasReadableSource ? (
                            <button
                              type="button"
                              onClick={() => openBookReader(book)}
                              className="inline-flex items-center gap-2 rounded-2xl border border-[rgba(34,197,94,0.36)] bg-[rgba(34,197,94,0.24)] px-5 py-3 text-xl font-semibold text-[#e8fff4] transition hover:bg-[rgba(34,197,94,0.3)]"
                            >
                              <BookOpen size={20} />
                              Read Book
                            </button>
                          ) : (
                            <span className="inline-flex items-center rounded-2xl border border-[rgba(148,163,184,0.35)] bg-[rgba(148,163,184,0.15)] px-5 py-3 text-sm text-[rgba(219,242,230,0.75)]">
                              {book.fileName
                                ? `Uploaded: ${book.fileName}`
                                : book.fileUrl
                                ? 'External file linked'
                                : 'Book file not uploaded'}
                            </span>
                          )}

                          {isAdmin ? (
                            <>
                              <button
                                type="button"
                                onClick={() => beginEdit(book)}
                                className="inline-flex items-center rounded-2xl border border-[rgba(56,189,248,0.35)] bg-[rgba(56,189,248,0.12)] px-4 py-2 text-sm text-[#bae6fd]"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteLibraryBook(book.id)}
                                className="inline-flex items-center rounded-2xl border border-[rgba(248,113,113,0.35)] bg-[rgba(248,113,113,0.12)] px-4 py-2 text-sm text-[#fecaca]"
                              >
                                Delete
                              </button>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {isAdmin ? (
          <form
            onSubmit={onSaveBook}
            className="mt-8 max-w-5xl mx-auto rounded-3xl border border-[rgba(34,197,94,0.22)] bg-[rgba(17,26,21,0.84)] p-5"
          >
            <h4 className="text-xl font-bold text-white">
              {editingBookId ? 'Edit Library Book' : 'Upload Library Book'}
            </h4>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Input
                value={bookForm.title}
                onChange={(event) =>
                  setBookForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="Book title"
                required
              />
              <Input
                value={bookForm.author}
                onChange={(event) =>
                  setBookForm((prev) => ({ ...prev, author: event.target.value }))
                }
                placeholder="Author / teacher name (optional)"
              />
              <select
                className="input"
                value={bookForm.mainCategory}
                onChange={(event) =>
                  setBookForm((prev) => ({ ...prev, mainCategory: event.target.value }))
                }
              >
                {MAIN_LIBRARY_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Input
                value={bookForm.subcategory}
                onChange={(event) =>
                  setBookForm((prev) => ({ ...prev, subcategory: event.target.value }))
                }
                placeholder="Subcategory"
              />
              <select
                className="input"
                value={bookForm.visibility}
                onChange={(event) =>
                  setBookForm((prev) => ({ ...prev, visibility: event.target.value }))
                }
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <select
                className="input"
                value={bookForm.publishStatus}
                onChange={(event) =>
                  setBookForm((prev) => ({ ...prev, publishStatus: event.target.value }))
                }
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <select
                className="input"
                value={bookForm.requiredTier}
                onChange={(event) =>
                  setBookForm((prev) => ({ ...prev, requiredTier: event.target.value }))
                }
              >
                {SUBSCRIPTION_TIERS.map((tier) => (
                  <option key={tier} value={tier}>
                    Requires {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                min={1}
                max={2000}
                value={bookForm.pageCount}
                onChange={(event) =>
                  setBookForm((prev) => ({ ...prev, pageCount: event.target.value }))
                }
                placeholder="Book page count"
              />
              <Input
                type="number"
                min={1}
                max={10}
                value={bookForm.previewPageCount}
                onChange={(event) =>
                  setBookForm((prev) => ({ ...prev, previewPageCount: event.target.value }))
                }
                placeholder="Preview pages (default 3)"
              />
            </div>
            <textarea
              className="input mt-3 min-h-[90px]"
              value={bookForm.description}
              onChange={(event) =>
                setBookForm((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="Book description"
            />
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="input flex items-center gap-2 cursor-pointer">
                <Upload size={14} />
                <span>{bookCoverFile ? bookCoverFile.name : 'Upload cover image (optional)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => setBookCoverFile(event.target.files?.[0] || null)}
                />
              </label>
              <label className="input flex items-center gap-2 cursor-pointer">
                <Upload size={14} />
                <span>{bookUploadFile ? bookUploadFile.name : 'Upload book file'}</span>
                <input
                  type="file"
                  accept=".pdf,.epub,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(event) => setBookUploadFile(event.target.files?.[0] || null)}
                />
              </label>
            </div>
            <Input
              className="mt-3"
              value={bookForm.fileUrl}
              onChange={(event) =>
                setBookForm((prev) => ({ ...prev, fileUrl: event.target.value }))
              }
              placeholder="Or paste external book file URL (https://...)"
            />
            <p className="mt-2 text-xs text-[rgba(219,242,230,0.62)]">
              If both are provided, uploaded file is preferred inside the in-app reader.
            </p>
            <textarea
              className="input mt-3 min-h-[90px]"
              value={bookForm.readerSeedText}
              onChange={(event) =>
                setBookForm((prev) => ({ ...prev, readerSeedText: event.target.value }))
              }
              placeholder="Optional structured reader pages (use --- on a new line to split pages)"
            />
            <p className="mt-2 text-xs text-[rgba(219,242,230,0.62)]">
              Add reader pages directly for premium in-app reading. Text and markdown uploads are auto-split into pages.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={onGenerateCover}>
                Generate Cover from Book Info
              </Button>
              <p className="text-xs text-[rgba(219,242,230,0.62)]">
                If no cover is uploaded, the app will auto-generate one from title/category.
              </p>
            </div>
            {generatedCoverDataUrl ? (
              <div className="mt-3">
                <p className="text-xs text-[rgba(219,242,230,0.62)] mb-2">Generated cover preview</p>
                <div className="w-32 md:w-40 aspect-[2/3] rounded-lg overflow-hidden border border-[rgba(34,197,94,0.24)] bg-[rgba(10,15,13,0.45)]">
                  <img
                    src={generatedCoverDataUrl}
                    alt="Generated cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : null}
            {libraryNotice ? (
              <p className="mt-3 text-xs text-[#fde68a]">{libraryNotice}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="submit" variant="primary" size="sm">
                {editingBookId ? 'Update Book' : 'Save Book'}
              </Button>
              {editingBookId ? (
                <Button type="button" variant="ghost" size="sm" onClick={resetBookForm}>
                  Cancel Edit
                </Button>
              ) : null}
            </div>
          </form>
        ) : null}
      </Section>

      <BookReaderModal
        open={Boolean(readerBook)}
        book={readerBook}
        currentUser={currentUser}
        onClose={closeBookReader}
      />

      <Section id="dashboard" variant="alt" py="py-14 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white">As-salamu alaykum, Ahmad</h2>
          <p className="mt-2 text-[rgba(219,242,230,0.72)]">
            Here is your learning plan for today. Consistency is the key to success.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {DASHBOARD_SUMMARY.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4"
              >
                <item.icon size={16} className="text-[#3ce094]" />
                <p className="mt-2 text-2xl md:text-3xl font-bold text-white leading-tight">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-[rgba(219,242,230,0.62)]">{item.sub}</p>
              </article>
            ))}
          </div>

          <article className="mt-4 rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white">Overall Progress</p>
              <p className="text-[#48e59f] font-semibold">45%</p>
            </div>
            <div className="mt-2 h-3 rounded-full bg-[rgba(148,163,184,0.25)]">
              <div className="h-3 w-[45%] rounded-full bg-[#22c55e]" />
            </div>
            <p className="mt-2 text-sm text-[rgba(219,242,230,0.62)]">
              22 lessons remaining to complete Tajwid Foundations
            </p>
          </article>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <article className="rounded-3xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4">
              <h3 className="text-2xl md:text-3xl font-bold text-white inline-flex items-center gap-2">
                <BookOpen size={18} className="text-[#3ce094]" /> Today&apos;s Lesson Plan
              </h3>
              <div className="mt-3 space-y-3">
                {LESSON_PLAN.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[rgba(148,163,184,0.2)] bg-[rgba(31,41,55,0.35)] p-3"
                  >
                    <p className="text-white font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-[rgba(219,242,230,0.72)]">{item.details}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4">
              <h3 className="text-2xl md:text-3xl font-bold text-white inline-flex items-center gap-2">
                <Mic size={18} className="text-[#3ce094]" /> Tajwid Topics
              </h3>
              <div className="mt-3 space-y-2">
                {TOPIC_TRACKER.map((item) => (
                  <div
                    key={item.topic}
                    className={`rounded-xl px-3 py-2 flex items-center justify-between ${item.tone}`}
                  >
                    <span className="font-medium">{item.topic}</span>
                    <span className="text-sm">{item.status}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <article className="mt-5 rounded-3xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4">
            <h3 className="text-2xl md:text-3xl font-bold text-white">Teacher Feedback</h3>
            <div className="mt-3 space-y-3">
              {FEEDBACK.map((item) => (
                <div key={item.date} className="rounded-2xl border border-[rgba(226,232,240,0.35)] p-3">
                  <p className="text-sm text-[#3ce094] font-semibold">
                    {item.date} Â· Ustadh Hashim
                  </p>
                  <p className="mt-1 text-[rgba(219,242,230,0.86)]">{item.note}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </Section>
    </>
  );
}

