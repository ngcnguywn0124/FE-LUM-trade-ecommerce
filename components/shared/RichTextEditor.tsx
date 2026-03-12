'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-40 w-full animate-pulse bg-gray-100 rounded-lg" />,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }], // Thêm nút indent vào toolbar
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'indent', // Thêm indent vào formats
];

const RichTextEditor = ({ value, onChange, placeholder, error }: RichTextEditorProps) => {
  return (
    <div className="space-y-2">
      <div className={`prose-sm max-w-none ${error ? 'quill-error' : ''}`}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="bg-white rounded-lg overflow-hidden border-gray-200"
        />
      </div>
      
      <style jsx global>{`
        .quill-error .ql-container,
        .quill-error .ql-toolbar {
          border-color: #ef4444 !important;
        }
        .ql-toolbar.ql-snow {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: #e5e7eb;
          background-color: #f9fafb;
        }
        .ql-container.ql-snow {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: #e5e7eb;
          min-height: 180px;
          font-family: inherit;
          font-size: 0.875rem;
          color: #111827;
        }
        .ql-editor {
          min-height: 180px;
          color: #111827 !important;
          line-height: 1.6;
        }
        /* Ép kiểu hiển thị cho list trong editor */
        .ql-editor ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
        }
        .ql-editor ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
        }
        .ql-editor li {
            position: relative;
        }
        .ql-editor.ql-blank::before {
          font-style: normal;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
