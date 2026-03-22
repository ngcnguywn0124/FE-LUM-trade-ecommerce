"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import AuthInput from "./AuthInput";

interface VerifyEmailFormProps {
  email: string;
  onBack: () => void;
  onVerified: () => void;
}

const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({ email, onBack, onVerified }) => {
  const { verifyEmail, resendOtp, isLoading } = useAuthStore();
  const [otp, setOtp] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(60);

  useEffect(() => {
    setCooldownSeconds(60);
  }, [email]);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  const otpError = useMemo(() => {
    if (!otp) return "";
    if (!/^\d{6}$/.test(otp)) return "Mã OTP phải gồm đúng 6 chữ số";
    return "";
  }, [otp]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Vui lòng nhập mã OTP hợp lệ gồm 6 chữ số.");
      return;
    }

    try {
      await verifyEmail({ email, otp });
      toast.success("Xác thực email thành công. Bạn có thể đăng nhập ngay.");
      onVerified();
    } catch {
      toast.error("Mã OTP không hợp lệ hoặc đã hết hạn.");
    }
  };

  const handleResendOtp = async () => {
    if (cooldownSeconds > 0) return;
    try {
      await resendOtp({ email });
      setCooldownSeconds(60);
      toast.success("Đã gửi lại mã OTP mới vào email của bạn.");
    } catch (error: unknown) {
      const maybeMessage =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: unknown } } }).response?.data?.message === "string"
          ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message as string)
          : "";
      toast.error(maybeMessage || "Không thể gửi lại OTP. Vui lòng thử lại.");
    }
  };

  return (
    <form className="flex flex-col gap-5 w-full mt-4" onSubmit={handleVerify} noValidate>
      <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-sm text-emerald-700">
        Mã xác thực đã được gửi đến <span className="font-semibold">{email}</span>
      </div>

      <AuthInput
        id="verify-email-otp"
        label="Mã OTP (6 chữ số)"
        placeholder="Nhập mã OTP"
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        error={otpError}
        required
      />

      <div className="flex items-center justify-between w-full text-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
        >
          Quay lại đăng nhập
        </button>
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={isLoading || cooldownSeconds > 0}
          className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors cursor-pointer disabled:opacity-60"
        >
          {cooldownSeconds > 0 ? `Gửi lại OTP (${cooldownSeconds}s)` : "Gửi lại OTP"}
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gray-900 hover:bg-emerald-700 text-[#FFBA00] font-bold py-3 rounded-lg transition-colors shadow-md mt-1 text-base cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "Đang xác thực..." : "Xác thực email"}
      </button>
    </form>
  );
};

export default VerifyEmailForm;
