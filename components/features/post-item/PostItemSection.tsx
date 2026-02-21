import { ReactNode } from 'react';

interface PostItemSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const PostItemSection = ({ title, description, children }: PostItemSectionProps) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
        {description ? <p className="text-sm text-gray-500 mt-1">{description}</p> : null}
      </div>
      {children}
    </section>
  );
};

export default PostItemSection;
