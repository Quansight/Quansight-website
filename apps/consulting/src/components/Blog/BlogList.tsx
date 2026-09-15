import { useState } from 'react';

export type PostSummary = {
  id: string;
  title: string;
  published: string;
  authors: string;
  featuredImage?: { src: string; alt: string };
};

// The blog index's post grid, matching the live WordPress "posts" widget
// (Elementor cards skin, 3 columns, 26px/100px gaps): thumbnail on top at
// a 100:55 ratio, then title / "Read More" / a bordered author+date row.
// `pageSize` posts show at once; with `loadMore`, a button reveals the
// next `pageSize` each click (live loads them via AJAX the same way).
export function BlogList({
  posts,
  pageSize,
  loadMore = false,
}: {
  posts: PostSummary[];
  pageSize: number;
  loadMore?: boolean;
}) {
  const [shown, setShown] = useState(pageSize);
  const visible = posts.slice(0, shown);

  return (
    <div className="mx-auto w-full">
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-x-[2.6rem] gap-y-[10rem]"
        role="list"
      >
        {visible.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {loadMore && shown < posts.length && (
        <div className="text-center mt-[5rem]">
          <button
            onClick={() => setShown((n) => n + pageSize)}
            className="inline-block bg-violet text-white font-bold text-[1.6rem] leading-[1.2] px-[4.5rem] py-[2.5rem] hover:bg-pink"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

function PostCard({ post }: { post: PostSummary }) {
  const href = `/blog/${post.id}`;
  return (
    <article className="flex flex-col bg-white" role="listitem">
      {post.featuredImage && (
        <a href={href} tabIndex={-1} className="block w-full">
          <div className="relative w-full" style={{ paddingBottom: '55%' }}>
            <img
              src={post.featuredImage.src}
              alt={post.featuredImage.alt}
              loading="lazy"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        </a>
      )}
      <div className="px-[2.7rem] mt-[2.4rem] mb-[2rem] grow">
        <h4 className="text-[2.2rem] font-bold leading-[2.9rem] tracking-[-0.04rem] capitalize text-black mb-[1.5rem]">
          <a href={href}>{post.title}</a>
        </h4>
        <a
          href={href}
          aria-label={`Read more about ${post.title}`}
          className="inline-block text-[1.4rem] font-bold text-black underline mb-[2rem]"
        >
          Read More
        </a>
      </div>
      <div className="border-t border-[#eaeaea] px-[2.7rem] py-[1rem] text-[1.2rem] text-[#161616] flex gap-[1.5rem]">
        <span>{post.authors}</span>
        <span>{post.published}</span>
      </div>
    </article>
  );
}
