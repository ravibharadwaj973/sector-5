import ConnectDB from "../../../connection/moongo";
import { Conversation } from "../../../model/conversation";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await ConnectDB();
    const { id } = params;

    const chat = await Conversation.findById(id).populate("participants");

    if (!chat) {
      return NextResponse.json(
        { success: false, error: "Chat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, chat });
  } catch (err) {
    console.error("❌ Conversation API Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
