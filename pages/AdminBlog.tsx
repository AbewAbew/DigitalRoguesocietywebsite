import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Bold,
  CalendarDays,
  ExternalLink,
  FilePlus2,
  FileText,
  ImagePlus,
  Italic,
  Link2,
  List,
  Loader2,
  Lock,
  LogOut,
  Mail,
  PencilLine,
  Quote,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { AdminSession, BlogPost, BlogPostDraft } from '../types';
import {
  deleteBlogImage,
  deleteBlogPost,
  getSupabaseSetupMessage,
  isSupabaseConfigured,
  listAdminBlogPosts,
  saveBlogPost,
  slugifyBlogPost,
  uploadBlogImage,
} from '../lib/blogApi';
import {
  checkAdminAllowlist,
  clearAdminSession,
  restoreAdminSession,
  signInAdminWithEmail,
  signOutAdmin,
} from '../lib/supabaseAuth';

const adminDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const createEmptyDraft = (): BlogPostDraft => ({
  title: '',
  slug: '',
  excerpt: '',
  contentHtml: '',
  featureImageUrl: '',
  featureImagePath: '',
  authorName: 'Admin',
  publishedAt: new Date().toISOString().slice(0, 10),
  status: 'draft',
});

const toDraft = (post: BlogPost): BlogPostDraft => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  contentHtml: post.contentHtml,
  featureImageUrl: post.featureImageUrl,
  featureImagePath: post.featureImagePath,
  authorName: post.authorName,
  publishedAt: (post.publishedAt ?? post.createdAt).slice(0, 10),
  status: post.status,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

const getPlainText = (value: string): string =>
  value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

const insertPlainTextAtCursor = (text: string): void => {
  const normalizedText = text.replace(/\r\n/g, '\n');

  if (document.queryCommandSupported?.('insertText')) {
    const inserted = document.execCommand('insertText', false, normalizedText);
    if (inserted) {
      return;
    }
  }

  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return;
  }

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const fragment = document.createDocumentFragment();
  const lines = normalizedText.split('\n');

  lines.forEach((line, index) => {
    if (index > 0) {
      fragment.appendChild(document.createElement('br'));
    }

    fragment.appendChild(document.createTextNode(line));
  });

  const lastNode = fragment.lastChild;
  range.insertNode(fragment);

  if (lastNode) {
    range.setStartAfter(lastNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

const sortPosts = (posts: BlogPost[]): BlogPost[] =>
  [...posts].sort(
    (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );

const formatAdminDate = (value: string | null): string =>
  value ? adminDateFormatter.format(new Date(value)) : 'Unscheduled';

const toolbarButtonClass =
  'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white';

const statusClassMap = {
  draft: 'bg-white/5 text-slate-300',
  published: 'bg-blue-500/15 text-blue-100',
};

const AdminBlogEditor: React.FC<{
  session: AdminSession;
  onSignOut: () => Promise<void>;
}> = ({ session, onSignOut }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [draft, setDraft] = useState<BlogPostDraft>(() => createEmptyDraft());
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [slugDirty, setSlugDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabaseReady = isSupabaseConfigured();
  const saveLabel = draft.status === 'published' ? 'Save Changes' : 'Save Draft';

  const stats = useMemo(() => {
    const published = posts.filter((post) => post.status === 'published').length;
    return {
      total: posts.length,
      published,
      drafts: posts.length - published,
    };
  }, [posts]);

  const syncEditorHtml = (html: string) => {
    window.requestAnimationFrame(() => {
      if (editorRef.current && editorRef.current.innerHTML !== html) {
        editorRef.current.innerHTML = html;
      }
    });
  };

  const applyDraft = (nextDraft: BlogPostDraft, nextSelectedId: string | null, nextSlugDirty: boolean) => {
    setDraft(nextDraft);
    setSelectedPostId(nextSelectedId);
    setSlugDirty(nextSlugDirty);
    syncEditorHtml(nextDraft.contentHtml);
  };

  const startNewDraft = () => {
    setError(null);
    setNotice('New draft ready.');
    applyDraft(createEmptyDraft(), null, false);
  };

  const loadPosts = async (withSpinner = true) => {
    if (!supabaseReady) {
      setIsLoading(false);
      setIsRefreshing(false);
      setPosts([]);
      return;
    }

    if (withSpinner) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const nextPosts = await listAdminBlogPosts(session.accessToken);
      setPosts(nextPosts);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load posts from Supabase.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const openPost = (post: BlogPost) => {
    setError(null);
    setNotice(`Editing "${post.title}".`);
    applyDraft(toDraft(post), post.id, true);
  };

  const syncDraftContent = () => {
    setDraft((current) => ({
      ...current,
      contentHtml: editorRef.current?.innerHTML ?? '',
    }));
  };

  const runEditorCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncDraftContent();
  };

  const handleInsertLink = () => {
    const nextUrl = window.prompt('Enter the full URL for this link.');
    if (nextUrl) {
      runEditorCommand('createLink', nextUrl);
    }
  };

  const handlePlainTextPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();

    const plainText = event.clipboardData.getData('text/plain');

    editorRef.current?.focus();
    insertPlainTextAtCursor(plainText);
    syncDraftContent();
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextTitle = event.target.value;
    setDraft((current) => ({
      ...current,
      title: nextTitle,
      slug: slugDirty ? current.slug : slugifyBlogPost(nextTitle),
    }));
  };

  const handleSlugChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSlugDirty(true);
    setDraft((current) => ({
      ...current,
      slug: slugifyBlogPost(event.target.value),
    }));
  };

  const handleImageSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError(null);
    setNotice(null);
    setIsUploading(true);
    const previousImagePath = draft.featureImagePath;

    try {
      const uploaded = await uploadBlogImage(
        file,
        draft.slug || draft.title || file.name,
        session.accessToken,
      );
      setDraft((current) => ({
        ...current,
        featureImageUrl: uploaded.url,
        featureImagePath: uploaded.path,
      }));
      setNotice('Feature image uploaded to Supabase Storage.');

      if (previousImagePath && previousImagePath !== uploaded.path) {
        try {
          await deleteBlogImage(previousImagePath, session.accessToken);
        } catch {
          // Ignore stale image cleanup failures.
        }
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Feature image upload failed.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleSave = async () => {
    await handlePersist(draft.status);
  };

  const handlePublish = async () => {
    await handlePersist('published');
  };

  const handleUnpublish = async () => {
    await handlePersist('draft');
  };

  const handlePersist = async (nextStatus: 'draft' | 'published') => {
    const nextTitle = draft.title.trim();
    const nextSlug = slugifyBlogPost(draft.slug || draft.title);
    const nextHtml = editorRef.current?.innerHTML ?? draft.contentHtml;
    const nextBodyText = getPlainText(nextHtml);

    if (!nextTitle) {
      setError('Add a post title before saving.');
      return;
    }

    if (!nextSlug) {
      setError('Add a valid slug before saving.');
      return;
    }

    if (!nextBodyText) {
      setError('Write some content before saving.');
      return;
    }

    setError(null);
    setNotice(null);
    setIsSaving(true);

    try {
      const savedPost = await saveBlogPost(
        {
          ...draft,
          title: nextTitle,
          slug: nextSlug,
          contentHtml: nextHtml,
          publishedAt: draft.publishedAt || new Date().toISOString().slice(0, 10),
          status: nextStatus,
        },
        session.accessToken,
      );

      setPosts((current) => sortPosts([savedPost, ...current.filter((post) => post.id !== savedPost.id)]));
      applyDraft(toDraft(savedPost), savedPost.id, true);
      setNotice(
        nextStatus === 'published'
          ? savedPost.status === 'published' && draft.status === 'published'
            ? 'Published post updated.'
            : 'Post published to Supabase.'
          : draft.status === 'published'
            ? 'Post moved back to draft.'
            : 'Draft saved to Supabase.',
      );
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Saving the post failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!draft.id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${draft.title}"? This will also remove its feature image if one exists.`);
    if (!confirmed) {
      return;
    }

    setError(null);
    setNotice(null);
    setIsDeleting(true);

    try {
      await deleteBlogPost(
        { id: draft.id, featureImagePath: draft.featureImagePath },
        session.accessToken,
      );
      setPosts((current) => current.filter((post) => post.id !== draft.id));
      startNewDraft();
      setNotice('Post deleted.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Deleting the post failed.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#081120] px-4 py-5 text-white md:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1680px]">
        <div className="mb-5 rounded-[30px] border border-white/10 bg-[#101b32]/90 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-7">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-blue-300">
                CMS Admin
              </p>
              <h1 className="text-3xl font-bold text-white md:text-4xl">Blog Publisher</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                Create, edit, publish, and delete blog posts stored in Supabase. The layout follows the dark admin treatment from your reference image, but fits the current site stack.
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Signed in as <span className="text-slate-200">{session.user.email}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/insights"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
              >
                <ArrowLeft size={16} />
                Back to Site
              </Link>
              <button
                type="button"
                onClick={startNewDraft}
                className="inline-flex items-center gap-2 rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-sm font-medium text-blue-100 transition hover:bg-blue-500/15"
              >
                <FilePlus2 size={16} />
                New Draft
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!supabaseReady || isSaving || isDeleting || isUploading}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-900/50 disabled:text-blue-200/60"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saveLabel}
              </button>
              {draft.status !== 'published' && (
                <button
                  type="button"
                  onClick={() => void handlePublish()}
                  disabled={!supabaseReady || isSaving || isDeleting || isUploading}
                  className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ShieldCheck size={16} />
                  Publish
                </button>
              )}
              <button
                type="button"
                onClick={() => void onSignOut()}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {!supabaseReady && (
          <div className="mb-5 rounded-[26px] border border-amber-300/20 bg-amber-400/10 p-5 text-sm text-amber-50">
            <p className="font-semibold text-amber-100">Supabase is not configured yet.</p>
            <p className="mt-2 text-amber-50/85">{getSupabaseSetupMessage()}</p>
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-[24px] border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </div>
        )}

        {!error && notice && (
          <div className="mb-5 rounded-[24px] border border-blue-400/15 bg-blue-500/10 p-4 text-sm text-blue-100">
            {notice}
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
          <aside className="rounded-[30px] border border-white/10 bg-[#101b32]/90 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Recent Posts</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Library</h2>
              </div>
              <button
                type="button"
                onClick={() => void loadPosts(false)}
                disabled={!supabaseReady || isLoading || isRefreshing}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Refresh posts"
              >
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">All</p>
                <p className="mt-2 text-2xl font-semibold text-white">{stats.total}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Live</p>
                <p className="mt-2 text-2xl font-semibold text-blue-100">{stats.published}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Draft</p>
                <p className="mt-2 text-2xl font-semibold text-slate-200">{stats.drafts}</p>
              </div>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                  <Loader2 size={18} className="animate-spin" />
                  Loading posts...
                </div>
              ) : posts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm leading-relaxed text-slate-400">
                  No posts yet. Create your first draft to populate the list.
                </div>
              ) : (
                posts.map((post) => {
                  const isActive = post.id === selectedPostId;
                  const preview = post.excerpt || getPlainText(post.contentHtml) || 'No summary yet.';

                  return (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => openPost(post)}
                      className={`w-full rounded-[24px] border p-4 text-left transition ${
                        isActive
                          ? 'border-blue-400/30 bg-blue-500/10 shadow-[0_20px_60px_rgba(20,60,160,0.18)]'
                          : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${
                            statusClassMap[post.status]
                          }`}
                        >
                          {post.status}
                        </span>
                        <span className="text-xs text-slate-500">{formatAdminDate(post.updatedAt)}</span>
                      </div>
                      <h3 className="line-clamp-2 text-base font-semibold text-white">{post.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">{preview}</p>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <section className="rounded-[30px] border border-white/10 bg-[#101b32]/90 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">
                  {draft.id ? 'Edit Post' : 'Create New Post'}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {draft.id ? 'Update your article' : 'Write your next article'}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${
                    statusClassMap[draft.status]
                  }`}
                >
                  {draft.status}
                </span>
                {draft.updatedAt && <span>Updated {formatAdminDate(draft.updatedAt)}</span>}
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-4 md:p-5">
              <input
                value={draft.title}
                onChange={handleTitleChange}
                placeholder="Enter post title..."
                className="mb-5 w-full border-none bg-transparent text-4xl font-semibold text-white outline-none placeholder:text-slate-500 md:text-5xl"
              />

              <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-[#0b1427]/80 p-2">
                <button type="button" onClick={() => runEditorCommand('bold')} className={toolbarButtonClass} aria-label="Bold">
                  <Bold size={16} />
                </button>
                <button type="button" onClick={() => runEditorCommand('italic')} className={toolbarButtonClass} aria-label="Italic">
                  <Italic size={16} />
                </button>
                <button type="button" onClick={handleInsertLink} className={toolbarButtonClass} aria-label="Insert link">
                  <Link2 size={16} />
                </button>
                <button type="button" onClick={() => runEditorCommand('insertUnorderedList')} className={toolbarButtonClass} aria-label="Bullet list">
                  <List size={16} />
                </button>
                <button type="button" onClick={() => runEditorCommand('formatBlock', 'blockquote')} className={toolbarButtonClass} aria-label="Blockquote">
                  <Quote size={16} />
                </button>
              </div>

              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={syncDraftContent}
                onPaste={handlePlainTextPaste}
                data-placeholder="Write your story..."
                className="rich-editor min-h-[520px] rounded-[24px] border border-white/10 bg-[#0b1427]/80 px-5 py-4 text-base leading-8 text-slate-100 outline-none"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <PencilLine size={16} />
                Browser-native rich text editor with bold, italic, links, lists, and quotes.
              </div>
              <div>{getPlainText(draft.contentHtml).length} characters</div>
            </div>
          </section>

          <aside className="rounded-[30px] border border-white/10 bg-[#101b32]/90 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Publishing Details</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Meta</h2>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
                  Slug
                </span>
                <input
                  value={draft.slug}
                  onChange={handleSlugChange}
                  placeholder="post-url-slug"
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1427]/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/40"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
                  Excerpt
                </span>
                <textarea
                  value={draft.excerpt}
                  onChange={(event) => setDraft((current) => ({ ...current, excerpt: event.target.value }))}
                  rows={4}
                  placeholder="A short summary..."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-[#0b1427]/80 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/40"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
                  Published By
                </span>
                <input
                  value={draft.authorName}
                  onChange={(event) => setDraft((current) => ({ ...current, authorName: event.target.value }))}
                  placeholder="Admin"
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1427]/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/40"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
                  <CalendarDays size={14} />
                  Published Date
                </span>
                <input
                  type="date"
                  value={draft.publishedAt}
                  onChange={(event) => setDraft((current) => ({ ...current, publishedAt: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1427]/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400/40"
                />
              </label>

              <div className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
                  Status
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1427]/80 px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${
                      statusClassMap[draft.status]
                    }`}
                  >
                    {draft.status}
                  </span>
                  {draft.status === 'published' ? (
                    <button
                      type="button"
                      onClick={() => void handleUnpublish()}
                      disabled={isSaving || isDeleting || isUploading}
                      className="text-sm font-medium text-amber-200 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Move to draft
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handlePublish()}
                      disabled={isSaving || isDeleting || isUploading}
                      className="text-sm font-medium text-emerald-200 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Publish now
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Feature Image</p>
                {draft.featureImageUrl && (
                  <button
                    type="button"
                    onClick={() => setDraft((current) => ({ ...current, featureImageUrl: '', featureImagePath: '' }))}
                    className="text-xs text-red-200 transition hover:text-red-100"
                  >
                    Remove
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={!supabaseReady || isUploading}
                className="group flex w-full flex-col items-center justify-center rounded-[26px] border border-dashed border-white/12 bg-[#0b1427]/80 px-5 py-8 text-center transition hover:border-blue-400/30 hover:bg-blue-500/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {draft.featureImageUrl ? (
                  <img src={draft.featureImageUrl} alt="Feature preview" className="mb-4 h-44 w-full rounded-2xl object-cover" />
                ) : (
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/[0.04] text-slate-400 transition group-hover:text-white">
                    <ImagePlus size={28} />
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                  {draft.featureImageUrl ? 'Replace image' : 'Upload image'}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Images are stored in the Supabase bucket configured by VITE_SUPABASE_BLOG_BUCKET.
                </p>
              </button>
            </div>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
              <div className="flex items-center gap-2 text-white">
                <FileText size={16} />
                Current preview
              </div>
              <p className="mt-3 font-semibold text-white">{draft.title || 'Untitled post'}</p>
              <p className="mt-2 leading-6 text-slate-400">
                {draft.excerpt || getPlainText(draft.contentHtml) || 'No excerpt yet.'}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>{draft.authorName || 'Admin'}</span>
                <span>{formatAdminDate(draft.publishedAt)}</span>
              </div>
            </div>

            {draft.status === 'published' && draft.slug && (
              <Link
                to={`/insights/${draft.slug}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-200 transition hover:text-white"
              >
                Open public article
                <ExternalLink size={15} />
              </Link>
            )}

            {draft.id && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || isSaving}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-100 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Delete Post
              </button>
            )}
          </aside>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(event) => void handleImageSelection(event)}
        />
      </div>
    </motion.div>
  );
};

const AdminBlog: React.FC = () => {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isAdminAllowed, setIsAdminAllowed] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  const supabaseReady = isSupabaseConfigured();

  const hydrateAdminAccess = async (nextSession: AdminSession) => {
    const allowed = await checkAdminAllowlist(nextSession.accessToken, nextSession.user.email);
    setSession(nextSession);
    setIsAdminAllowed(allowed);

    if (allowed) {
      setAuthError(null);
      return;
    }

    setAuthError(
      `Signed in as ${nextSession.user.email}, but this account is not allowlisted for blog admin access.`,
    );
  };

  useEffect(() => {
    const restore = async () => {
      if (!supabaseReady) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const restoredSession = await restoreAdminSession();

        if (restoredSession) {
          await hydrateAdminAccess(restoredSession);
        }
      } catch (restoreError) {
        clearAdminSession();
        setAuthError(
          restoreError instanceof Error ? restoreError.message : 'Admin session restore failed.',
        );
      } finally {
        setIsBootstrapping(false);
      }
    };

    void restore();
  }, [supabaseReady]);

  const handleSignOut = async () => {
    const activeAccessToken = session?.accessToken;

    setSession(null);
    setIsAdminAllowed(false);
    setPassword('');
    setAuthError(null);
    setAuthNotice('Signed out.');

    if (!activeAccessToken) {
      clearAdminSession();
      return;
    }

    try {
      await signOutAdmin(activeAccessToken);
    } catch {
      clearAdminSession();
    }
  };

  const handleAuthSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setAuthError('Enter the admin email address.');
      return;
    }

    if (!password) {
      setAuthError('Enter a password.');
      return;
    }

    if (password.length < 8) {
      setAuthError('Use at least 8 characters for the admin password.');
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);
    setAuthNotice(null);

    try {
      const nextSession = await signInAdminWithEmail(email.trim(), password);
      await hydrateAdminAccess(nextSession);
      setAuthNotice(`Signed in as ${nextSession.user.email}.`);
      setPassword('');
    } catch (submitError) {
      setAuthError(submitError instanceof Error ? submitError.message : 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (session && isAdminAllowed) {
    return <AdminBlogEditor session={session} onSignOut={handleSignOut} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#081120] px-4 py-8 text-white md:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-[30px] border border-white/10 bg-[#101b32]/90 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-blue-300">
            Secured Admin
          </p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">Blog Admin Access</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
            This route now requires Supabase email authentication. Public article reading stays open, but the CMS is restricted to allowlisted admin emails only.
          </p>
        </div>

        {!supabaseReady && (
          <div className="rounded-[26px] border border-amber-300/20 bg-amber-400/10 p-5 text-sm text-amber-50">
            {getSupabaseSetupMessage()}
          </div>
        )}

        {supabaseReady && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[30px] border border-white/10 bg-[#101b32]/90 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.25)] backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/12 text-blue-200">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Email Auth Required</h2>
                  <p className="text-sm text-slate-400">
                    Use the admin email address you will allowlist in Supabase.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-7 text-slate-300">
                <p>
                  Self-service sign-up is intentionally disabled here. Only existing, approved admin accounts can sign in.
                </p>
                <p>
                  `Sign in` unlocks the blog editor only if the email is both an existing Supabase Auth user and present in `public.admin_emails`.
                </p>
                <p>
                  To approve a new admin, create or invite that user manually in Supabase Auth and then add the same email address to `public.admin_emails`.
                </p>
              </div>

              <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Required Supabase Step</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Turn off public email signups in Supabase Auth, then approve new admins manually by creating the auth user yourself and allowlisting their email.
                </p>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[#101b32]/90 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.25)] backdrop-blur-xl">
              <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                <Mail size={16} className="mr-2 inline-block text-blue-200" />
                Approved admins only
              </div>

              {authError && (
                <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
                  {authError}
                </div>
              )}

              {!authError && authNotice && (
                <div className="mb-4 rounded-2xl border border-blue-400/15 bg-blue-500/10 p-4 text-sm text-blue-100">
                  {authNotice}
                </div>
              )}

              {session && !isAdminAllowed && (
                <div className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-50">
                  This account is authenticated, but Supabase is still denying admin access because the email is not on the allowlist.
                </div>
              )}

              {isBootstrapping ? (
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300">
                  <Loader2 size={18} className="animate-spin" />
                  Restoring admin session...
                </div>
              ) : (
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
                      Admin Email
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@yourdomain.com"
                      className="w-full rounded-2xl border border-white/10 bg-[#0b1427]/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/40"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
                      <Lock size={14} />
                      Password
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full rounded-2xl border border-white/10 bg-[#0b1427]/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/40"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={!supabaseReady || isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-900/50 disabled:text-blue-200/60"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                    Sign In to Blog Admin
                  </button>

                  {session && (
                    <button
                      type="button"
                      onClick={() => void handleSignOut()}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  )}
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminBlog;
