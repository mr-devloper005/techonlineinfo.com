import { ContentImage } from "@/components/shared/content-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Globe, Phone, Tag, Mail } from "lucide-react";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildPostUrl, fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG, getTaskConfig, type TaskKey } from "@/lib/site-config";
import type { SitePost } from "@/lib/site-connector";
import { TaskImageCarousel } from "@/components/tasks/task-image-carousel";
import { cn } from "@/lib/utils";
import { ArticleComments } from "@/components/tasks/article-comments";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { RichContent, formatRichHtml } from "@/components/shared/rich-content";
import { ArticleEngagementRail, FollowButton } from "@/components/tasks/article-engagement";
import { getFactoryState } from "@/design/factory/get-factory-state";
import { getProductKind } from "@/design/factory/get-product-kind";
import { DirectoryTaskDetailPage } from "@/design/products/directory/task-detail-page";
import { TASK_DETAIL_PAGE_OVERRIDE_ENABLED, TaskDetailPageOverride } from "@/overrides/task-detail-page";

type PostContent = {
  category?: string;
  location?: string;
  address?: string;
  website?: string;
  phone?: string;
  email?: string;
  description?: string;
  body?: string;
  excerpt?: string;
  author?: string;
  highlights?: string[];
  logo?: string;
  images?: string[];
  latitude?: number | string;
  longitude?: number | string;
};

const isValidImageUrl = (value?: string | null) =>
  typeof value === "string" && (value.startsWith("/") || /^https?:\/\//i.test(value));

const absoluteUrl = (value?: string | null) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (!value.startsWith("/")) return null;
  return `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${value}`;
};

const getContent = (post: SitePost): PostContent => {
  const content = post.content && typeof post.content === "object" ? post.content : {};
  return content as PostContent;
};

const formatArticleHtml = (content: PostContent, post: SitePost) => {
  const raw =
    (typeof content.body === "string" && content.body.trim()) ||
    (typeof content.description === "string" && content.description.trim()) ||
    (typeof post.summary === "string" && post.summary.trim()) ||
    "";

  return formatRichHtml(raw, "Details coming soon.");
};

const getImageUrls = (post: SitePost, content: PostContent) => {
  const media = Array.isArray(post.media) ? post.media : [];
  const mediaImages = media
    .map((item) => item?.url)
    .filter((url): url is string => isValidImageUrl(url));
  const contentImages = Array.isArray(content.images)
    ? content.images.filter((url): url is string => isValidImageUrl(url))
    : [];
  const merged = [...mediaImages, ...contentImages];
  if (merged.length) return merged;
  if (isValidImageUrl(content.logo)) return [content.logo as string];
  return ["/placeholder.svg?height=900&width=1400"];
};

const toNumber = (value?: number | string) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const buildMapEmbedUrl = (
  latitude?: number | string,
  longitude?: number | string,
  address?: string
) => {
  const lat = toNumber(latitude);
  const lon = toNumber(longitude);
  const normalizedAddress = typeof address === "string" ? address.trim() : "";
  const googleMapsEmbedApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY?.trim();

  if (googleMapsEmbedApiKey) {
    const query = lat !== null && lon !== null ? `${lat},${lon}` : normalizedAddress;
    if (!query) return null;
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(
      googleMapsEmbedApiKey
    )}&q=${encodeURIComponent(query)}`;
  }

  if (lat !== null && lon !== null) {
    const delta = 0.01;
    const left = lon - delta;
    const right = lon + delta;
    const bottom = lat - delta;
    const top = lat + delta;
    const bbox = `${left},${bottom},${right},${top}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
      bbox
    )}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lon}`)}`;
  }

  if (normalizedAddress) {
    return `https://www.google.com/maps?q=${encodeURIComponent(normalizedAddress)}&output=embed`;
  }

  return null;
};

const editorialDetailSignatures = [
  {
    shell:
      "bg-[radial-gradient(circle_at_80%_12%,rgba(217,70,239,0.12),transparent_38%),radial-gradient(circle_at_8%_0%,rgba(139,92,246,0.12),transparent_34%),linear-gradient(180deg,#f8f5ff_0%,#ffffff_100%)]",
    frame: "border-fuchsia-100/70 bg-white/75 shadow-[0_28px_90px_rgba(139,92,246,0.12)]",
    badge: "border-fuchsia-200/90 bg-fuchsia-50/95 text-fuchsia-700",
    accent: "text-fuchsia-700",
    title: "from-fuchsia-700 via-violet-700 to-indigo-700",
    chip: "border-fuchsia-200/70 bg-fuchsia-50/70 text-fuchsia-700",
  },
  {
    shell:
      "bg-[radial-gradient(circle_at_80%_12%,rgba(16,185,129,0.15),transparent_38%),radial-gradient(circle_at_8%_0%,rgba(45,212,191,0.15),transparent_34%),linear-gradient(180deg,#effcf8_0%,#ffffff_100%)]",
    frame: "border-emerald-100/70 bg-white/76 shadow-[0_28px_90px_rgba(16,185,129,0.12)]",
    badge: "border-emerald-200/90 bg-emerald-50/95 text-emerald-700",
    accent: "text-emerald-700",
    title: "from-emerald-700 via-teal-700 to-cyan-700",
    chip: "border-emerald-200/70 bg-emerald-50/70 text-emerald-700",
  },
  {
    shell:
      "bg-[radial-gradient(circle_at_80%_12%,rgba(251,146,60,0.14),transparent_38%),radial-gradient(circle_at_8%_0%,rgba(244,63,94,0.12),transparent_34%),linear-gradient(180deg,#fff8f2_0%,#ffffff_100%)]",
    frame: "border-amber-100/80 bg-white/78 shadow-[0_28px_90px_rgba(249,115,22,0.12)]",
    badge: "border-amber-200/90 bg-amber-50/95 text-amber-700",
    accent: "text-orange-700",
    title: "from-amber-700 via-orange-700 to-rose-700",
    chip: "border-amber-200/80 bg-amber-50/70 text-orange-700",
  },
] as const;

const pickEditorialDetailSignature = () => {
  const seed = `${SITE_CONFIG.domain}-${SITE_CONFIG.name}`;
  let total = 0;
  for (const char of seed) total += char.charCodeAt(0);
  return editorialDetailSignatures[total % editorialDetailSignatures.length];
};

const formatPostDate = (post: SitePost) => {
  const raw = post.publishedAt || post.createdAt || post.updatedAt;
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
};

const getAuthorInitial = (name?: string | null) => {
  const trimmed = typeof name === "string" ? name.trim() : "";
  if (!trimmed) return "E";
  const letter = trimmed[0]?.toUpperCase();
  return letter && /[A-Z0-9]/.test(letter) ? letter : "E";
};

export async function TaskDetailPage({ task, slug }: { task: TaskKey; slug: string }) {
  if (TASK_DETAIL_PAGE_OVERRIDE_ENABLED) {
    return await TaskDetailPageOverride({ task, slug });
  }

  const taskConfig = getTaskConfig(task);
  let post: SitePost | null = null;
  try {
    post = await fetchTaskPostBySlug(task, slug);
  } catch (error) {
    console.warn("Failed to load post detail", error);
  }

  if (!post) {
    notFound();
  }

  const content = getContent(post);
  const isClassified = task === "classified";
  const isArticle = task === "article";
  const category = content.category || post.tags?.[0] || taskConfig?.label || task;
  const description = content.description || post.summary || "Details coming soon.";
  const descriptionHtml = !isArticle ? formatRichHtml(description, "Details coming soon.") : "";
  const articleHtml = isArticle ? formatArticleHtml(content, post) : "";
  const articleSummary =
    post.summary ||
    (typeof content.excerpt === "string" ? content.excerpt : "") ||
    "";
  const articleAuthor =
    (typeof content.author === "string" && content.author.trim()) ||
    post.authorName ||
    "Editorial Team";
  const postTags = Array.isArray(post.tags) ? post.tags.filter((tag) => typeof tag === "string") : [];
  const location = content.address || content.location;
  const images = getImageUrls(post, content);
  const mapEmbedUrl = buildMapEmbedUrl(content.latitude, content.longitude, location);
  const isBookmark = task === "sbm" || task === "social";
  const hideSidebar = isClassified || task === "image" || isBookmark;
  const related = (await fetchTaskPosts(task, 6))
    .filter((item) => item.slug !== post.slug)
    .filter((item) => {
      if (!content.category) return true;
      const itemContent = getContent(item);
      return itemContent.category === content.category;
    })
    .slice(0, 3);
  const articleUrl = `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${taskConfig?.route || "/articles"}/${post.slug}`;
  const articleImage = absoluteUrl(images[0]) || absoluteUrl(SITE_CONFIG.defaultOgImage);
  const engagementStorageKeyPrefix = `toi:article:${SITE_CONFIG.domain}:${post.slug}`;
  const articleSchema = isArticle
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: articleSummary || description,
        image: articleImage ? [articleImage] : [],
        author: {
          "@type": "Person",
          name: articleAuthor,
        },
        datePublished: post.publishedAt || undefined,
        dateModified: post.publishedAt || undefined,
        articleSection: category,
        keywords: postTags.join(", "),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
      }
    : null;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_CONFIG.baseUrl.replace(/\/$/, ""),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: taskConfig?.label || "Posts",
        item: `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${taskConfig?.route || "/"}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${taskConfig?.route || "/posts"}/${post.slug}`,
      },
    ],
  };
  const schemaPayload = articleSchema ? [articleSchema, breadcrumbSchema] : breadcrumbSchema;
  const { recipe } = getFactoryState();
  const productKind = getProductKind(recipe);
  const editorialSignature = pickEditorialDetailSignature();

  if (productKind === "directory" && (task === "listing" || task === "classified" || task === "profile")) {
    return (
      <div className="min-h-screen bg-[#f8fbff]">
        <NavbarShell />
        <DirectoryTaskDetailPage
          task={task}
          taskLabel={taskConfig?.label || task}
          taskRoute={taskConfig?.route || "/"}
          post={post}
          description={description}
          category={category}
          images={images}
          mapEmbedUrl={mapEmbedUrl}
          related={related}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", isArticle ? editorialSignature.shell : "bg-background")}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SchemaJsonLd data={schemaPayload} />
        <Link
          href={taskConfig?.route || "/"}
          className={cn("mb-6 inline-flex items-center text-sm hover:text-foreground", isArticle ? editorialSignature.accent : "text-muted-foreground")}
        >
          Back to {taskConfig?.label || "posts"}
        </Link>

        {isArticle ? (
          <div className="grid gap-10 lg:grid-cols-[72px_minmax(0,1fr)_360px] lg:items-start">
            <aside className="hidden lg:block">
              <ArticleEngagementRail storageKeyPrefix={engagementStorageKeyPrefix} shareUrl={articleUrl} commentsTargetId="comments" />
            </aside>

            <article className={`mx-auto w-full max-w-5xl space-y-7 rounded-[2rem] border p-6 sm:p-8 lg:p-10 ${editorialSignature.frame}`}>
              <header className="space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${editorialSignature.badge}`}>
                    <Tag className="h-3.5 w-3.5" />
                    {category}
                  </span>
                  <span className="text-sm text-slate-600">By {articleAuthor}</span>
                </div>
                <h1 className={`bg-gradient-to-r bg-clip-text text-4xl font-semibold leading-tight tracking-[-0.04em] text-transparent sm:text-5xl ${editorialSignature.title}`}>
                  {post.title}
                </h1>
                {articleSummary ? (
                  <p className="max-w-3xl text-base leading-8 text-slate-600">{articleSummary}</p>
                ) : null}
                {postTags.length ? (
                  <div className="flex flex-wrap gap-2">
                    {postTags.map((tag) => (
                      <span key={tag} className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${editorialSignature.chip}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </header>
              {images[0] ? (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/70 bg-slate-100 shadow-[0_20px_55px_rgba(15,23,42,0.16)]">
                  <ContentImage
                    src={images[0]}
                    alt={`${post.title} featured image`}
                    fill
                    className="object-cover"
                    intrinsicWidth={1600}
                    intrinsicHeight={900}
                  />
                </div>
              ) : null}
              <RichContent html={articleHtml} className="leading-8 prose-p:my-6 prose-h2:my-8 prose-h3:my-6 prose-ul:my-6" />
              <div id="comments">
                <ArticleComments slug={post.slug} />
              </div>
            </article>

            <aside className="space-y-6 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-white/60 bg-white/55 p-6 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {getAuthorInitial(articleAuthor)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-slate-900">{articleAuthor}</p>
                  </div>
                </div>
                <FollowButton storageKeyPrefix={`${engagementStorageKeyPrefix}:author:${articleAuthor}`} label="Follow" />
              </div>

              <div className="rounded-2xl border border-white/60 bg-white/55 p-6 shadow-sm backdrop-blur">
                <h2 className="text-base font-semibold text-slate-900">More in {category}</h2>
                <div className="mt-4 space-y-3">
                  {related.length ? (
                    related.map((item) => (
                      <TaskPostCard
                        key={item.id}
                        post={item}
                        href={buildPostUrl(task, item.slug)}
                        taskKey={task}
                        compact
                      />
                    ))
                  ) : (
                    <p className="text-sm text-slate-600">More posts coming soon.</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-10",
              hideSidebar ? "lg:grid-cols-1" : "lg:grid-cols-[2fr_1fr]"
            )}
          >
            <div className={cn(isClassified ? "space-y-8" : "")}>
              {!isBookmark ? (
                <div className={cn(isClassified ? "w-full" : "")}>
                  <TaskImageCarousel images={images} />
                </div>
              ) : null}

              <div className={cn(isClassified ? "mx-auto w-full max-w-4xl" : "mt-6")}>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="inline-flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    {category}
                  </Badge>
                  {location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {location}
                    </span>
                  )}
                </div>
                <h1 className="mt-4 text-3xl font-semibold text-foreground">{post.title}</h1>
                <RichContent html={descriptionHtml} className="mt-3 max-w-3xl" />
              </div>

              {isClassified ? (
              <div className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">Business details</h2>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {content.website && (
                    <div className="flex items-start gap-2">
                      <Globe className="mt-0.5 h-4 w-4" />
                      <a
                        href={content.website}
                        className="break-all text-foreground hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {content.website}
                      </a>
                    </div>
                  )}
                  {content.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4" />
                      <span>{content.phone}</span>
                    </div>
                  )}
                  {content.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="mt-0.5 h-4 w-4" />
                      <a
                        href={`mailto:${content.email}`}
                        className="break-all text-foreground hover:underline"
                      >
                        {content.email}
                      </a>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {content.highlights?.length && !isArticle ? (
              <div className={cn("mt-8 rounded-2xl border border-border bg-card p-6", isClassified ? "mx-auto w-full max-w-4xl" : "")}>
                <h2 className="text-lg font-semibold text-foreground">Highlights</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {content.highlights.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {isClassified && mapEmbedUrl ? (
              <div className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">Location map</p>
                <div className="mt-4 overflow-hidden rounded-xl border border-border">
                  <iframe
                    title="Business location map"
                    src={mapEmbedUrl}
                    className="h-56 w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}

          </div>

          {!hideSidebar ? (
            <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground">Listing details</h2>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {content.website && (
                    <div className="flex items-start gap-2">
                      <Globe className="mt-0.5 h-4 w-4" />
                      <a
                        href={content.website}
                        className="break-all text-foreground hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {content.website}
                      </a>
                    </div>
                  )}
                  {content.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4" />
                      <span>{content.phone}</span>
                    </div>
                  )}
                  {content.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="mt-0.5 h-4 w-4" />
                      <a
                        href={`mailto:${content.email}`}
                        className="break-all text-foreground hover:underline"
                      >
                        {content.email}
                      </a>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>
              {content.website ? (
                <Button className="mt-5 w-full" asChild>
                  <a href={content.website} target="_blank" rel="noreferrer">
                    Visit Website
                  </a>
                </Button>
              ) : null}
            </div>

            {mapEmbedUrl ? (
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">Location map</p>
                <div className="mt-4 overflow-hidden rounded-xl border border-border">
                  <iframe
                    title="Business location map"
                    src={mapEmbedUrl}
                    className="h-56 w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}

          </aside>
          ) : null}
        </div>
        )}

        {!isArticle ? (
          <section className="mt-12">
            {related.length ? (
              <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  More in {category}
                </h2>
                {taskConfig?.route && (
                  <Link
                    href={taskConfig.route}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    View all
                  </Link>
                )}
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <TaskPostCard
                    key={item.id}
                    post={item}
                    href={buildPostUrl(task, item.slug)}
                  />
                ))}
              </div>
              </>
            ) : null}
            <nav className="mt-6 rounded-2xl border border-border bg-card/60 p-4">
              <p className="text-sm font-semibold text-foreground">Related links</p>
              <ul className="mt-2 space-y-2 text-sm">
                {related.map((item) => (
                  <li key={`link-${item.id}`}>
                    <Link
                      href={buildPostUrl(task, item.slug)}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
                {taskConfig?.route ? (
                  <li>
                    <Link
                      href={taskConfig.route}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Browse all {taskConfig.label}
                    </Link>
                  </li>
                ) : null}
                <li>
                  <Link
                    href={`/search?q=${encodeURIComponent(category)}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Search more in {category}
                  </Link>
                </li>
              </ul>
            </nav>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
