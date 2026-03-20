"use client";

import { useRouter } from "next/navigation";

type BlogPostCtaButtonProps = {
  className?: string;
};

export default function BlogPostCtaButton({ className = "" }: BlogPostCtaButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.push("/blog/gui-bai");
      return;
    }

    router.push("/dang-nhap?redirect=/blog/gui-bai");
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      Đăng bài Blog
    </button>
  );
}