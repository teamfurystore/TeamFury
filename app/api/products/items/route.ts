import { supabase } from "@/utils/supabaseClient";
import { NextResponse } from "next/server";

interface ProductItemInput {
  skin_id: string;
  display_name: string;
  display_icon?: string;
}

interface CreateProductItemsPayload {
  parent_product_id: string;
  items: ProductItemInput[];
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as CreateProductItemsPayload;
    const { parent_product_id, items } = body;

    // Validate required fields
    if (!parent_product_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required field: parent_product_id",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Items must be a non-empty array",
        },
        { status: 400 }
      );
    }

    // Validate each item
    for (const item of items) {
      if (!item.skin_id || !item.display_name) {
        return NextResponse.json(
          {
            success: false,
            message: "Each item must have skin_id and display_name",
          },
          { status: 400 }
        );
      }
    }

    console.log("📝 Creating product items for parent_product_id:", parent_product_id);
    console.log("📋 Items count:", items.length);

    // Prepare data for batch insert
    const insertData = items.map((item) => ({
      parent_product_id,
      skin_id: item.skin_id,
      display_name: item.display_name,
      display_icon: item.display_icon || null,
    }));

    // Insert into product_items table
    const { data, error } = await supabase
      .from("product_items")
      .insert(insertData)
      .select();

    if (error) {
      console.error("❌ Insert error:", error);
      throw error;
    }

    console.log("✅ Product items created successfully:", data?.length, "items inserted");

    return NextResponse.json(
      {
        success: true,
        message: `${data?.length || 0} product items created successfully`,
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating product items:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product items",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parentProductId = searchParams.get("parent_product_id");

    if (!parentProductId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing parent_product_id query parameter",
        },
        { status: 400 }
      );
    }

    console.log("🔍 Fetching product items for parent_product_id:", parentProductId);

    const { data, error } = await supabase
      .from("product_items")
      .select("*")
      .eq("parent_product_id", parentProductId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Fetch error:", error);
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        count: data?.length || 0,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching product items:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product items",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, parent_product_id } = body;

    // Allow deletion by id or by parent_product_id
    if (!id && !parent_product_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing id or parent_product_id field",
        },
        { status: 400 }
      );
    }

    console.log("🗑️ Deleting product items:", { id, parent_product_id });

    let query = supabase.from("product_items").delete();

    if (id) {
      query = query.eq("id", id);
    } else if (parent_product_id) {
      query = query.eq("parent_product_id", parent_product_id);
    }

    const { error, count } = await query;

    if (error) {
      console.error("❌ Delete error:", error);
      throw error;
    }

    console.log("✅ Product items deleted successfully:", count, "items deleted");

    return NextResponse.json(
      {
        success: true,
        message: `${count} product item(s) deleted successfully`,
        deletedCount: count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting product items:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product items",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, display_name, display_icon } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing id field",
        },
        { status: 400 }
      );
    }

    console.log("✏️ Updating product item:", id);

    const updateData: Record<string, unknown> = {};
    if (display_name !== undefined) updateData.display_name = display_name;
    if (display_icon !== undefined) updateData.display_icon = display_icon;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No fields to update",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("product_items")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("❌ Update error:", error);
      throw error;
    }

    console.log("✅ Product item updated successfully:", data);

    return NextResponse.json(
      {
        success: true,
        message: "Product item updated successfully",
        data: data?.[0] || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating product item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product item",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
