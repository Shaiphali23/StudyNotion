import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "All Category retrieved Successfully",
        categories: allCategories,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching categories",
        error: message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = requireRole(req, "Admin");
    if ("error" in auth) return auth.error;

    const { name, description } = await req.json();

    if (!name || !description) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const categoryDetails = await Category.create({
      name,
      description,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category created Successfully",
        category: categoryDetails,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while creating the category",
        error: message,
      },
      { status: 500 }
    );
  }
}
