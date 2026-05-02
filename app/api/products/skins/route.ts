import { supabase } from "@/utils/supabaseClient";
import { NextResponse } from "next/server";

/**
 * ProductItemInput - Represents a single skin item input
 */
interface ProductItemInput {
  skin_id: string;
  display_name: string;
  display_icon?: string;
}

/**
 * CreateProductItemsPayload - Payload structure for batch creating product items
 * Contains parent product ID and array of items to insert
 */
interface CreateProductItemsPayload {
  parent_product_id: string;
  items: ProductItemInput[];
}

/**
 * POST /api/products/skins
 * Creates multiple product items (skins) in batch
 * 
 * Request body:
 * {
 *   "parent_product_id": "uuid",
 *   "items": [
 *     { "skin_id": "id", "display_name": "name", "display_icon": "url" }
 *   ]
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json() as CreateProductItemsPayload;
    const { parent_product_id, items } = body;

    // ✅ Validate parent_product_id exists
    if (!parent_product_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field: parent_product_id",
        },
        { status: 400 }
      );
    }

    // ✅ Validate items is a non-empty array
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Items must be a non-empty array",
        },
        { status: 400 }
      );
    }

    // ✅ Validate each item has required fields
    for (const item of items) {
      if (!item.skin_id || !item.display_name) {
        return NextResponse.json(
          {
            success: false,
            error: "Each item must have skin_id and display_name",
          },
          { status: 400 }
        );
      }
    }

    console.log("📝 Creating product items for parent_product_id:", parent_product_id);
    console.log("📋 Items count:", items.length);

    // ✅ Map items to insert format (handle null values for optional fields)
    const insertData = items.map((item) => ({
      parent_product_id,
      skin_id: item.skin_id,
      display_name: item.display_name,
      display_icon: item.display_icon || null,
    }));

    // ✅ Batch insert all items into product_items table
    const { data, error } = await supabase
      .from("product_items")
      .insert(insertData)
      .select();

    if (error) {
      console.error("❌ Insert error:", error);
      throw error;
    }

    console.log("✅ Product items created successfully:", data?.length, "items inserted");

    return NextResponse.json({
      success: true,
      message: `${data?.length || 0} product items created successfully`,
      data,
    });
  } catch (err) {
    console.error("❌ Insert skin error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to insert skins",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/products/skins?parent_product_id=uuid
 * Retrieves all product items (skins) for a specific parent product
 * Results are sorted by creation date (newest first)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parentProductId = searchParams.get("parent_product_id");

    // ✅ Validate query parameter exists
    if (!parentProductId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing parent_product_id query parameter",
        },
        { status: 400 }
      );
    }

    console.log("🔍 Fetching product items for parent_product_id:", parentProductId);

    // ✅ Query all items for the parent product, sorted by newest first
    const { data, error } = await supabase
      .from("product_items")
      .select("*")
      .eq("parent_product_id", parentProductId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Fetch error:", error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      data,
    });
  } catch (err) {
    console.error("❌ Fetch skins error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch skins",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/skins
 * Deletes product items either by:
 * 1. Individual item ID - deletes a single skin
 * 2. Parent product ID - deletes all skins for a product
 * 
 * Request body:
 * { "id": "uuid" } OR { "parent_product_id": "uuid" }
 */
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, parent_product_id } = body;

    // ✅ Validate that either id or parent_product_id is provided
    if (!id && !parent_product_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing id or parent_product_id field",
        },
        { status: 400 }
      );
    }

    console.log("🗑️ Deleting product items:", { id, parent_product_id });

    // ✅ Build dynamic query - start with delete operation
    let query = supabase.from("product_items").delete();

    // ✅ Add condition based on which parameter was provided
    if (id) {
      query = query.eq("id", id);
    } else if (parent_product_id) {
      query = query.eq("parent_product_id", parent_product_id);
    }

    // ✅ Execute delete and get count of deleted rows
    const { error, count } = await query;

    if (error) {
      console.error("❌ Delete error:", error);
      throw error;
    }

    console.log("✅ Product items deleted successfully:", count, "items deleted");

    return NextResponse.json({
      success: true,
      message: `${count} product item(s) deleted successfully`,
      deletedCount: count,
    });
  } catch (err) {
    console.error("❌ Delete skins error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete skins",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/products/skins
 * Updates an existing product item (skin)
 * Can update display_name and/or display_icon
 * 
 * Request body:
 * {
 *   "id": "uuid",
 *   "display_name": "new name",
 *   "display_icon": "new url"
 * }
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, display_name, display_icon } = body;

    // ✅ Validate item ID exists
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing id field",
        },
        { status: 400 }
      );
    }

    console.log("✏️ Updating product item:", id);

    // ✅ Build update object - only include fields that were provided
    const updateData: Record<string, unknown> = {};
    if (display_name !== undefined) updateData.display_name = display_name;
    if (display_icon !== undefined) updateData.display_icon = display_icon;

    // ✅ Ensure at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No fields to update",
        },
        { status: 400 }
      );
    }

    // ✅ Update the product item and fetch the updated data
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

    return NextResponse.json({
      success: true,
      message: "Product item updated successfully",
      data: data?.[0] || null,
    });
  } catch (err) {
    console.error("❌ Update skin error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update skin",
      },
      { status: 500 }
    );
  }
}