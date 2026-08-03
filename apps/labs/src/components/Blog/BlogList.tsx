import { useState, useMemo } from 'react';

export type PostSummary = {
  id: string;
  title: string;
  published: string;
  authors: string;
  featuredImage?: { src: string; alt: string };
  categories: string[];
};

const POSTS_PER_PAGE = 9;

export function BlogList({
  posts,
  categories,
}: {
  posts: PostSummary[];
  categories: string[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    if (!selectedCategory) return posts;
    return posts.filter((p) => p.categories.includes(selectedCategory));
  }, [posts, selectedCategory]);

  const pageCount = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const pageItems = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat === selectedCategory ? null : cat);
    setCurrentPage(1);
  };

  const featured = pageItems[0];
  const rest = pageItems.slice(1);

  return (
    <div className="pb-[12.2rem] mx-auto w-[95%] max-w-[83rem] md:w-[85%] xl:w-[70%]">
      <div className="mb-[3.5rem] flex flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`py-[0.7rem] px-[0.8rem] last:mr-0 text-[1.1rem] font-normal leading-[2.7rem] whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-violet text-white'
                : '!text-black !bg-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {featured && (
        <div className="mb-[4.2rem]">
          <PostCard post={featured} variant="horizontal" />
        </div>
      )}

      <div className="flex flex-wrap">
        {rest.map((post) => (
          <div key={post.id} className="odd:mr-[2%] mb-[3.7rem] w-full md:w-[49%]">
            <PostCard post={post} variant="vertical" />
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="flex justify-center mt-[3rem]">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            aria-label="Previous page"
            className="p-[0.8rem] text-[1.4rem] font-normal text-black leading-[2.7rem] hover:underline disabled:opacity-40"
          >
            {'< Previous'}
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`p-[0.8rem] text-[1.4rem] leading-[2.7rem] hover:underline ${
                page === currentPage ? 'font-bold' : 'font-normal text-black'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === pageCount}
            onClick={() => setCurrentPage((p) => p + 1)}
            aria-label="Next page"
            className="p-[0.8rem] text-[1.4rem] font-normal text-black leading-[2.7rem] hover:underline disabled:opacity-40"
          >
            {'Next >'}
          </button>
        </div>
      )}
    </div>
  );
}

function PostCard({
  post,
  variant,
}: {
  post: PostSummary;
  variant: 'horizontal' | 'vertical';
}) {
  const isHorizontal = variant === 'horizontal';
  return (
    <div
      className={`flex border border-gray-300 border-solid h-[400px] ${
        isHorizontal ? 'flex-row' : 'flex-col'
      }`}
    >
      {post.featuredImage && (
        <div
          className={`relative overflow-hidden ${
            isHorizontal ? 'w-1/2 h-full' : 'w-full h-[20rem]'
          }`}
        >
          <img
            src={post.featuredImage.src}
            alt={post.featuredImage.alt}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      )}
      <div
        className={`px-[0.7rem] pb-[3rem] ${
          isHorizontal
            ? 'pr-[4rem] pl-[2rem] w-1/2 flex flex-col justify-center'
            : ''
        }`}
      >
        <h3
          className={`text-[2.4rem] font-extrabold leading-[3rem] text-violet font-heading ${
            isHorizontal ? 'my-[2rem]' : 'mt-[1rem] mb-[1rem]'
          }`}
        >
          <a href={`/blog/${post.id}`}>{post.title}</a>
        </h3>
        <p className="text-[1.2rem] font-normal leading-[2.7rem] text-black">
          By {post.authors}
        </p>
        <p className="text-[1.2rem] font-normal leading-[2.7rem] text-black">
          {post.published}
        </p>
      </div>
    </div>
  );
}
