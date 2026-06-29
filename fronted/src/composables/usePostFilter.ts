/**
 * 帖子筛选与排序 — 纯 TS，可直接迁移到 Vue3
 */

interface Post {
  id: string;
  title: string;
  description: string;
  tags: string[];
  likes: number;
  views: number;
  date: string;
  visibility?: string;
  format?: string;
  [key: string]: any;
}

/** 从帖子列表中提取所有唯一标签 */
export const getAllTags = (posts: Post[]): string[] => {
  const tags = ['全部'];
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  });
  return tags;
};

/** 按条件筛选和排序帖子 */
export const filterPosts = (
  posts: Post[],
  options: {
    selectedTag?: string;
    searchTerm?: string;
    visibilityFilter?: string;
    formatFilter?: string;
    sortBy?: string;
  } = {}
): Post[] => {
  const { selectedTag = '全部', searchTerm = '', visibilityFilter = 'all', formatFilter = 'all', sortBy = 'latest' } = options;

  let result = [...posts];

  if (selectedTag !== '全部') {
    result = result.filter((post) => post.tags.includes(selectedTag));
  }

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter(
      (post) =>
        post.title.toLowerCase().includes(term) ||
        post.description.toLowerCase().includes(term) ||
        post.tags.some((tag) => tag.toLowerCase().includes(term))
    );
  }

  if (visibilityFilter !== 'all') {
    result = result.filter((post) => {
      if (visibilityFilter === 'public') return post.visibility === '公开';
      if (visibilityFilter === 'friends') return post.visibility === '仅好友可见';
      if (visibilityFilter === 'private') return post.visibility === '私密';
      return true;
    });
  }

  if (formatFilter !== 'all') {
    result = result.filter((post) => {
      if (formatFilter === 'raw') return post.format === 'RAW';
      if (formatFilter === 'jpg') return post.format === 'JPG';
      return true;
    });
  }

  if (sortBy === 'latest') {
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else if (sortBy === 'popular') {
    result.sort((a, b) => b.likes - a.likes);
  } else if (sortBy === 'views') {
    result.sort((a, b) => b.views - a.views);
  }

  return result;
};