"use client";

import { useEffect, useMemo, useState } from "react";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { buildPostUrl } from "@/lib/task-data";
import { normalizeCategory, isValidCategory } from "@/lib/categories";
import type { TaskKey } from "@/lib/site-config";
import type { SitePost } from "@/lib/site-connector";
import { getLocalPostsForTask } from "@/lib/local-posts";

type Props = {
  task: TaskKey;
  initialPosts: SitePost[];
  category?: string;
};

export function TaskListClient({ task, initialPosts, category }: Props) {
  const [localPosts, setLocalPosts] = useState<Array<SitePost & { localOnly?: boolean; task?: TaskKey }>>([]);

  useEffect(() => {
    setLocalPosts(getLocalPostsForTask(task));
  }, [task]);

  const merged = useMemo(() => {
    const bySlug = new Set<string>();
    const combined: Array<SitePost & { localOnly?: boolean; task?: TaskKey }> = [];

    localPosts.forEach((post) => {
      if (post.slug) {
        bySlug.add(post.slug);
      }
      combined.push(post);
    });

    initialPosts.forEach((post) => {
      if (post.slug && bySlug.has(post.slug)) return;
      combined.push(post);
    });

    const normalizedCategory = category ? normalizeCategory(category) : "all";
    if (normalizedCategory === "all") {
      return combined.filter((post) => {
        const content = post.content && typeof post.content === "object" ? post.content : {};
        const value = typeof (content as any).category === "string" ? (content as any).category : "";
        return !value || isValidCategory(value);
      });
    }

    return combined.filter((post) => {
      const content = post.content && typeof post.content === "object" ? post.content : {};
      const value =
        typeof (content as any).category === "string"
          ? normalizeCategory((content as any).category)
          : "";
      return value === normalizedCategory;
    });
  }, [category, initialPosts, localPosts]);

  if (!merged.length) {
    return (
      <div
        className={
          task === "article"
            ? "rounded-[1.85rem] border border-dashed border-violet-200/60 bg-white/40 p-12 text-center text-slate-500 backdrop-blur-md"
            : "rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground"
        }
      >
        No articles yet. Check back soon for new stories.
      </div>
    );
  }

  if (task === "article") {
    const [lead, second, third, fourth, ...rest] = merged;
    const trio = [second, third, fourth].filter(Boolean) as SitePost[];

    return (
      <div className="space-y-10">
        <TaskPostCard
          key={lead.id}
          post={lead}
          href={
            (lead as SitePost & { localOnly?: boolean }).localOnly
              ? `/local/${task}/${lead.slug}`
              : buildPostUrl(task, lead.slug)
          }
          taskKey={task}
          featured
        />

        {trio.length ? (
          <div>
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-slate-200/60 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Latest picks
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                  More to read
                </h2>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {trio.map((post, index) => {
                const localOnly = (post as SitePost & { localOnly?: boolean }).localOnly;
                const href = localOnly ? `/local/${task}/${post.slug}` : buildPostUrl(task, post.slug);
                return (
                  <div
                    key={post.id}
                    className={index === 0 ? "relative pt-2 before:absolute before:left-0 before:top-0 before:h-0.5 before:w-12 before:rounded-full before:bg-gradient-to-r before:from-violet-500 before:to-indigo-400" : ""}
                  >
                    <TaskPostCard post={post} href={href} taskKey={task} compact />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {rest.length ? (
          <div>
            <h3 className="mb-6 text-lg font-semibold tracking-[-0.02em] text-slate-900">
              Archive
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {rest.map((post) => {
                const localOnly = (post as SitePost & { localOnly?: boolean }).localOnly;
                const href = localOnly ? `/local/${task}/${post.slug}` : buildPostUrl(task, post.slug);
                return <TaskPostCard key={post.id} post={post} href={href} taskKey={task} />;
              })}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {merged.map((post) => {
        const localOnly = (post as any).localOnly;
        const href = localOnly
          ? `/local/${task}/${post.slug}`
          : buildPostUrl(task, post.slug);
        return <TaskPostCard key={post.id} post={post} href={href} taskKey={task} />;
      })}
    </div>
  );
}
