import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import { BlogPost } from '../types';
import {
  getPublishedBlogPostBySlug,
  getSupabaseSetupMessage,
  isSupabaseConfigured,
} from '../lib/blogApi';

const articleDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const formatArticleDate = (value: string | null): string =>
  value ? articleDateFormatter.format(new Date(value)) : 'Date not available';

const InsightArticle: React.FC = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    const loadArticle = async () => {
      if (!slug) {
        setError('This article URL is missing a slug.');
        setIsLoading(false);
        return;
      }

      if (!isSupabaseConfigured()) {
        setError(getSupabaseSetupMessage());
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const nextPost = await getPublishedBlogPostBySlug(slug);
        setPost(nextPost);
      } catch (articleError) {
        setError(articleError instanceof Error ? articleError.message : 'The article could not be loaded.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadArticle();
  }, [slug]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen px-6 pb-20 pt-32"
    >
      <div className="mx-auto max-w-4xl">
        <Link
          to="/insights"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Insights
        </Link>

        {isLoading ? (
          <div className="glass-panel rounded-3xl border border-white/10 p-10 text-center text-slate-300">
            Loading article...
          </div>
        ) : error ? (
          <div className="glass-panel rounded-3xl border border-red-400/20 bg-red-500/10 p-10 text-center text-red-100">
            {error}
          </div>
        ) : !post ? (
          <div className="glass-panel rounded-3xl border border-white/10 p-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/15 text-blue-300">
              <FileText size={28} />
            </div>
            <h1 className="font-display text-3xl font-bold text-white">Article Not Found</h1>
            <p className="mt-3 text-slate-400">
              The requested article is not published or no longer exists.
            </p>
          </div>
        ) : (
          <article>
            <div className="mb-10 text-center">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">
                Insight Article
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-6xl">
                {post.title}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
                {post.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
                <span>{post.authorName}</span>
                <span className="flex items-center gap-2">
                  <Calendar size={15} />
                  {formatArticleDate(post.publishedAt ?? post.createdAt)}
                </span>
              </div>
            </div>

            {post.featureImageUrl && (
              <img
                src={post.featureImageUrl}
                alt={post.title}
                className="mb-10 h-[340px] w-full rounded-[30px] object-cover shadow-[0_24px_90px_rgba(0,0,0,0.35)]"
              />
            )}

            <div
              className="article-content glass-panel rounded-[30px] border border-white/10 p-6 md:p-10"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          </article>
        )}
      </div>
    </motion.div>
  );
};

export default InsightArticle;
