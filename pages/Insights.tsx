import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, FileText, Mail } from 'lucide-react';
import { BlogPost } from '../types';
import {
  getSupabaseSetupMessage,
  isSupabaseConfigured,
  listPublishedBlogPosts,
} from '../lib/blogApi';

const insightsDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const formatInsightsDate = (value: string | null): string =>
  value ? insightsDateFormatter.format(new Date(value)) : 'Coming soon';

const getFallbackExcerpt = (post: BlogPost): string => {
  const plainText = post.contentHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return post.excerpt || plainText || 'Read the latest update from Digital Rogue Society Experiment Group.';
};

const Insights: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      if (!isSupabaseConfigured()) {
        setError(getSupabaseSetupMessage());
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const nextPosts = await listPublishedBlogPosts();
        setPosts(nextPosts);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load published posts.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadPosts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen px-6 pb-20 pt-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-blue-300">
            Insights and Updates
          </p>
          <h1 className="font-display text-5xl font-bold text-white md:text-6xl">
            News, analysis, and field updates
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-400">
            Explore published articles, reports, and updates from DRSE.G.
          </p>
        </div>

        {isLoading ? (
          <div className="glass-panel mb-20 rounded-3xl border border-white/10 p-16 text-center text-slate-300">
            Loading published posts...
          </div>
        ) : error ? (
          <div className="glass-panel mb-20 rounded-3xl border border-red-400/20 bg-red-500/10 p-10 text-center text-red-100">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-panel mb-20 rounded-3xl border border-white/10 p-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20 text-blue-300">
              <FileText size={32} />
            </div>
            <h2 className="font-display text-2xl font-bold text-white">Content Coming Soon</h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-slate-400">
              The blog pipeline is ready, but no post is published yet. Use the admin page to create a draft and publish your first article.
            </p>
            <Link
              to="/admin/blog"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-5 py-3 text-sm font-medium text-blue-100 transition hover:bg-blue-500/15"
            >
              Open Blog Admin
              <ArrowUpRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="mb-20 grid gap-6 lg:grid-cols-[1.35fr_1fr_1fr]">
            {posts.map((post, index) => {
              const isFeatured = index === 0;

              return (
                <Link
                  key={post.id}
                  to={`/insights/${post.slug}`}
                  className={`group rounded-[30px] border border-white/10 bg-[#0d1528]/90 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:border-blue-400/30 hover:bg-[#101a31] ${
                    isFeatured ? 'lg:row-span-2 lg:p-7' : ''
                  }`}
                >
                  <div className="overflow-hidden rounded-[24px] bg-white/[0.03]">
                    {post.featureImageUrl ? (
                      <img
                        src={post.featureImageUrl}
                        alt={post.title}
                        className={`w-full object-cover transition duration-500 group-hover:scale-[1.03] ${
                          isFeatured ? 'h-72 lg:h-[370px]' : 'h-52'
                        }`}
                      />
                    ) : (
                      <div className={`flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-slate-900 ${isFeatured ? 'h-72 lg:h-[370px]' : 'h-52'}`}>
                        <FileText className="text-blue-200/80" size={isFeatured ? 48 : 36} />
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-slate-500">
                    <span>{post.authorName}</span>
                    <span className="flex items-center gap-2">
                      <Calendar size={14} />
                      {formatInsightsDate(post.publishedAt ?? post.createdAt)}
                    </span>
                  </div>

                  <h2 className={`mt-4 font-display font-bold text-white transition group-hover:text-blue-100 ${isFeatured ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
                    {post.title}
                  </h2>
                  <p className={`line-clamp-4 mt-4 leading-relaxed text-slate-400 ${isFeatured ? 'text-base' : 'text-sm'}`}>
                    {getFallbackExcerpt(post)}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-100 transition group-hover:border-blue-300/30 group-hover:bg-blue-500/15">
                    Read more
                    <ArrowUpRight size={16} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="glass-panel relative overflow-hidden rounded-3xl border border-white/10 p-12 text-center">
          <div className="absolute inset-0 bg-blue-600/5" />
          <div className="relative z-10 mx-auto max-w-xl">
            <Mail className="mx-auto mb-6 h-12 w-12 text-white" />
            <h2 className="font-display text-3xl font-bold text-white">Subscribe to our Newsletter</h2>
            <p className="mt-4 text-slate-300">
              Get the latest news, events, and resources delivered directly to your inbox.
            </p>
            <form className="mt-8 flex flex-col gap-4 md:flex-row" onSubmit={(event) => event.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-white/20 bg-black/30 px-6 py-3 text-white outline-none focus:border-blue-500"
              />
              <button className="rounded-lg bg-blue-600 px-8 py-3 font-bold text-white transition hover:bg-blue-500">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Insights;
