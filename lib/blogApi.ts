import { BlogImageAsset, BlogPost, BlogPostDraft } from '../types';

type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content_html: string | null;
  feature_image_url: string | null;
  feature_image_path: string | null;
  author_name: string | null;
  published_at: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
};

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
const BLOG_TABLE = import.meta.env.VITE_SUPABASE_BLOG_TABLE ?? 'blog_posts';
const BLOG_BUCKET = import.meta.env.VITE_SUPABASE_BLOG_BUCKET ?? 'blog-images';
const BLOG_SELECT =
  'id,title,slug,excerpt,content_html,feature_image_url,feature_image_path,author_name,published_at,status,created_at,updated_at';

const storagePathPattern = /\/+/g;

export const isSupabaseConfigured = (): boolean => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const getSupabaseSetupMessage = (): string =>
  'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local, then create the blog_posts table and blog-images bucket before using the CMS.';

export const slugifyBlogPost = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

const ensureSupabaseConfig = (): void => {
  if (!isSupabaseConfigured()) {
    throw new Error(getSupabaseSetupMessage());
  }
};

const buildRestQuery = (params: Record<string, string>): string => {
  const search = new URLSearchParams(params);
  return search.toString();
};

const encodeStoragePath = (value: string): string =>
  value
    .replace(storagePathPattern, '/')
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

const toIsoDate = (value: string): string | null => {
  if (!value) {
    return null;
  }

  return `${value}T12:00:00.000Z`;
};

const mapBlogRow = (row: BlogPostRow): BlogPost => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  excerpt: row.excerpt ?? '',
  contentHtml: row.content_html ?? '',
  featureImageUrl: row.feature_image_url ?? '',
  featureImagePath: row.feature_image_path ?? '',
  authorName: row.author_name ?? 'Admin',
  publishedAt: row.published_at,
  status: row.status === 'published' ? 'published' : 'draft',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const buildPayload = (draft: BlogPostDraft) => ({
  title: draft.title.trim(),
  slug: slugifyBlogPost(draft.slug || draft.title),
  excerpt: draft.excerpt.trim(),
  content_html: draft.contentHtml.trim(),
  feature_image_url: draft.featureImageUrl || null,
  feature_image_path: draft.featureImagePath || null,
  author_name: draft.authorName.trim() || 'Admin',
  published_at: toIsoDate(draft.publishedAt),
  status: draft.status,
});

const getErrorMessage = async (response: Response): Promise<string> => {
  const fallback = `Supabase request failed with status ${response.status}.`;
  const responseClone = response.clone();

  try {
    const errorBody = await response.json();

    if (typeof errorBody?.message === 'string') {
      return errorBody.message;
    }

    if (typeof errorBody?.error_description === 'string') {
      return errorBody.error_description;
    }

    if (typeof errorBody?.error === 'string') {
      return errorBody.error;
    }
  } catch {
    const rawText = await responseClone.text();
    if (rawText) {
      return rawText;
    }
  }

  return fallback;
};

const supabaseFetch = async <T>(
  path: string,
  init: RequestInit = {},
  parseJson = true,
  accessToken?: string,
): Promise<T> => {
  ensureSupabaseConfig();

  const headers = new Headers(init.headers);
  headers.set('apikey', SUPABASE_ANON_KEY);
  headers.set('Authorization', `Bearer ${accessToken || SUPABASE_ANON_KEY}`);

  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (!parseJson) {
    return undefined as T;
  }

  if (response.status === 204) {
    return [] as T;
  }

  return (await response.json()) as T;
};

const sortPosts = (posts: BlogPost[]): BlogPost[] =>
  [...posts].sort(
    (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );

export const listAdminBlogPosts = async (accessToken: string): Promise<BlogPost[]> => {
  const rows = await supabaseFetch<BlogPostRow[]>(
    `/rest/v1/${BLOG_TABLE}?${buildRestQuery({
      select: BLOG_SELECT,
      order: 'updated_at.desc',
    })}`,
    {},
    true,
    accessToken,
  );

  return sortPosts(rows.map(mapBlogRow));
};

export const listPublishedBlogPosts = async (): Promise<BlogPost[]> => {
  const rows = await supabaseFetch<BlogPostRow[]>(
    `/rest/v1/${BLOG_TABLE}?${buildRestQuery({
      select: BLOG_SELECT,
      status: 'eq.published',
      order: 'published_at.desc.nullslast,updated_at.desc',
    })}`,
  );

  return rows.map(mapBlogRow);
};

export const getPublishedBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const rows = await supabaseFetch<BlogPostRow[]>(
    `/rest/v1/${BLOG_TABLE}?${buildRestQuery({
      select: BLOG_SELECT,
      slug: `eq.${slug}`,
      status: 'eq.published',
      limit: '1',
    })}`,
  );

  return rows[0] ? mapBlogRow(rows[0]) : null;
};

export const saveBlogPost = async (draft: BlogPostDraft, accessToken: string): Promise<BlogPost> => {
  const payload = buildPayload(draft);

  if (draft.id) {
    const rows = await supabaseFetch<BlogPostRow[]>(
      `/rest/v1/${BLOG_TABLE}?${buildRestQuery({
        id: `eq.${draft.id}`,
        select: BLOG_SELECT,
      })}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(payload),
      },
      true,
      accessToken,
    );

    if (!rows[0]) {
      throw new Error('The selected post could not be updated.');
    }

    return mapBlogRow(rows[0]);
  }

  const rows = await supabaseFetch<BlogPostRow[]>(
    `/rest/v1/${BLOG_TABLE}?${buildRestQuery({
      select: BLOG_SELECT,
    })}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    },
    true,
    accessToken,
  );

  if (!rows[0]) {
    throw new Error('The post could not be created.');
  }

  return mapBlogRow(rows[0]);
};

export const deleteBlogImage = async (path: string, accessToken?: string): Promise<void> => {
  if (!path || !isSupabaseConfigured()) {
    return;
  }

  await supabaseFetch(
    `/storage/v1/object/${encodeURIComponent(BLOG_BUCKET)}/${encodeStoragePath(path)}`,
    {
      method: 'DELETE',
    },
    false,
    accessToken,
  );
};

export const deleteBlogPost = async (
  post: Pick<BlogPost, 'id' | 'featureImagePath'>,
  accessToken: string,
): Promise<void> => {
  await supabaseFetch(
    `/rest/v1/${BLOG_TABLE}?${buildRestQuery({
      id: `eq.${post.id}`,
    })}`,
    {
      method: 'DELETE',
      headers: {
        Prefer: 'return=minimal',
      },
    },
    false,
    accessToken,
  );

  if (post.featureImagePath) {
    try {
      await deleteBlogImage(post.featureImagePath, accessToken);
    } catch {
      // Do not fail the row delete if the image object is already gone.
    }
  }
};

export const uploadBlogImage = async (
  file: File,
  slugHint: string,
  accessToken: string,
): Promise<BlogImageAsset> => {
  ensureSupabaseConfig();

  const extension = file.name.includes('.') ? file.name.split('.').pop() : 'png';
  const safeBaseName = slugifyBlogPost(slugHint || file.name || 'blog-image') || 'blog-image';
  const datedFolder = new Date().toISOString().slice(0, 10);
  const storagePath = `${datedFolder}/${Date.now()}-${safeBaseName}.${extension}`;

  await supabaseFetch(
    `/storage/v1/object/${encodeURIComponent(BLOG_BUCKET)}/${encodeStoragePath(storagePath)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'true',
      },
      body: file,
    },
    false,
    accessToken,
  );

  return {
    path: storagePath,
    url: `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(BLOG_BUCKET)}/${encodeStoragePath(storagePath)}`,
  };
};
