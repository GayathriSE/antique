"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@/lib/db";
import { signIn, signOut } from "@/lib/auth";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/validations/auth";
import type { ActionResponse } from "@/types";
import { AuthError } from "next-auth";

export async function registerUser(data: unknown): Promise<ActionResponse> {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return {
      success: false,
      error: "An account with this email already exists.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.user.create({
    data: { name, email, password: hashedPassword, role: "USER" },
  });

  return { success: true, message: "Account created! You can now sign in." };
}

export async function loginUser(data: unknown): Promise<ActionResponse> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password." };
        default:
          return {
            success: false,
            error: "Authentication failed. Please try again.",
          };
      }
    }
    throw error;
  }
}

export async function logoutUser() {
  await signOut({ redirect: false });
}

export async function forgotPassword(data: unknown): Promise<ActionResponse> {
  const parsed = forgotPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { email } = parsed.data;
  const user = await db.user.findUnique({ where: { email } });

  // Always return success to avoid email enumeration
  if (!user) {
    return {
      success: true,
      message: "If the email exists, a reset link has been sent.",
    };
  }

  // Delete any existing token
  await db.passwordResetToken.deleteMany({ where: { email } });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.passwordResetToken.create({ data: { email, token, expires } });

  // In production, send email here using Resend/Nodemailer
  console.log(
    `[DEV] Password reset link: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`,
  );

  return {
    success: true,
    message: "If the email exists, a reset link has been sent.",
  };
}

export async function resetPassword(
  token: string,
  data: unknown,
): Promise<ActionResponse> {
  const parsed = resetPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const resetToken = await db.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.expires < new Date()) {
    return { success: false, error: "Invalid or expired reset link." };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  await db.user.update({
    where: { email: resetToken.email },
    data: { password: hashedPassword },
  });

  await db.passwordResetToken.delete({ where: { token } });

  return {
    success: true,
    message: "Password reset successfully. You can now sign in.",
  };
}
