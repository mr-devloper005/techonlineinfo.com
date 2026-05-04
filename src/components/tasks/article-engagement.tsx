"use client";

import * as React from "react";
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type RailProps = {
  storageKeyPrefix: string;
  shareUrl: string;
  commentsTargetId?: string;
};

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

export function ArticleEngagementRail({
  storageKeyPrefix,
  shareUrl,
  commentsTargetId = "comments",
}: RailProps) {
  const likeKey = `${storageKeyPrefix}:liked`;
  const saveKey = `${storageKeyPrefix}:saved`;

  const [liked, setLiked] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    setLiked(readJson<boolean>(likeKey, false));
    setSaved(readJson<boolean>(saveKey, false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [likeKey, saveKey]);

  const likeCount = liked ? 1 : 0;

  const onToggleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      writeJson(likeKey, next);
      toast(next ? "Liked" : "Unliked");
      return next;
    });
  };

  const onJumpToComments = () => {
    const element = document.getElementById(commentsTargetId);
    if (!element) {
      toast("Comments section not found.");
      return;
    }
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onToggleSave = () => {
    setSaved((prev) => {
      const next = !prev;
      writeJson(saveKey, next);
      toast(next ? "Saved" : "Removed from saved");
      return next;
    });
  };

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ url: shareUrl });
        return;
      }
    } catch {
      // fall through to clipboard
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast("Link copied.");
    } catch {
      toast("Copy failed. Please copy from the address bar.");
    }
  };

  return (
    <div className="sticky top-28 flex flex-col items-center gap-5 text-muted-foreground">
      <button
        type="button"
        onClick={onToggleLike}
        className="group flex w-14 flex-col items-center gap-2 rounded-2xl border border-white/60 bg-white/55 px-2 py-3 shadow-sm backdrop-blur hover:bg-white/75"
        aria-pressed={liked}
        aria-label="Like"
      >
        <Heart className="h-5 w-5 text-slate-700 group-hover:text-slate-900" />
        <span className="text-xs font-medium text-slate-600">{likeCount}</span>
      </button>
      <button
        type="button"
        onClick={onJumpToComments}
        className="group flex w-14 flex-col items-center gap-2 rounded-2xl border border-white/60 bg-white/55 px-2 py-3 shadow-sm backdrop-blur hover:bg-white/75"
        aria-label="Comments"
      >
        <MessageCircle className="h-5 w-5 text-slate-700 group-hover:text-slate-900" />
        <span className="text-xs font-medium text-slate-600">0</span>
      </button>
      <button
        type="button"
        onClick={onToggleSave}
        className="group flex w-14 flex-col items-center gap-2 rounded-2xl border border-white/60 bg-white/55 px-2 py-3 shadow-sm backdrop-blur hover:bg-white/75"
        aria-pressed={saved}
        aria-label="Save"
      >
        <Bookmark className="h-5 w-5 text-slate-700 group-hover:text-slate-900" />
        <span className="text-xs font-medium text-slate-600">{saved ? "Saved" : "Save"}</span>
      </button>
      <button
        type="button"
        onClick={onShare}
        className="group flex w-14 flex-col items-center gap-2 rounded-2xl border border-white/60 bg-white/55 px-2 py-3 shadow-sm backdrop-blur hover:bg-white/75"
        aria-label="Share"
      >
        <Share2 className="h-5 w-5 text-slate-700 group-hover:text-slate-900" />
        <span className="text-xs font-medium text-slate-600">Share</span>
      </button>
    </div>
  );
}

type FollowProps = {
  storageKeyPrefix: string;
  label?: string;
};

export function FollowButton({ storageKeyPrefix, label = "Follow" }: FollowProps) {
  const followKey = `${storageKeyPrefix}:following`;
  const [following, setFollowing] = React.useState(false);

  React.useEffect(() => {
    setFollowing(readJson<boolean>(followKey, false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followKey]);

  const onToggle = () => {
    setFollowing((prev) => {
      const next = !prev;
      writeJson(followKey, next);
      toast(next ? "Following" : "Unfollowed");
      return next;
    });
  };

  return (
    <Button className="mt-5 w-full" variant="secondary" type="button" onClick={onToggle} aria-pressed={following}>
      {following ? "Following" : label}
    </Button>
  );
}

