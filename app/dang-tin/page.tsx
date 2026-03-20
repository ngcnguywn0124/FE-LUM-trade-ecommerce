import PostItemPage from '@/components/features/post-item/PostItemPage';
import BlogPostCtaButton from '@/components/features/blog/BlogPostCtaButton';

export const metadata = {
  title: 'Đăng tin',
  description: 'Tạo bài đăng mới để bán đồ cũ tại Lụm.',
};

const DangTinPage = () => {
  return (
    <>
      <section className="pt-24 pb-4 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto rounded-2xl border border-gray-200 bg-[#f8fffb] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Bạn muốn chia sẻ kiến thức thay vì đăng sản phẩm?</h2>
            <p className="text-sm text-gray-700 mt-1">Bạn có thể tạo bài viết tại khu vực Blog sinh viên.</p>
          </div>
          <BlogPostCtaButton
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors"
          />
        </div>
      </section>

      <PostItemPage />
    </>
  );
};

export default DangTinPage;
