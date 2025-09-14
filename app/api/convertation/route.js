import ConnectDB from "../../connection/moongo";
import { Conversation } from "../../model/conversation";
import { NextResponse } from "next/server";

// POST /api/conversation
export async function GET() {
  try {
    await ConnectDB();
    const conversation = await Conversation.find();
    return NextResponse.json({ success: true, conversation });
  } catch (err) {
    console.error("❌ Conversation API Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await ConnectDB();
    const { userId1, userId2 } = await req.json();

    if (!userId1 || !userId2) {
      return NextResponse.json(
        { success: false, error: "Both userId1 and userId2 are required" },
        { status: 400 }
      );
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [userId1, userId2] },
    }).populate("participants");

    if (!conversation) {
      conversation = new Conversation({
        participants: [userId1, userId2],
      });
      await conversation.save();
      conversation = await conversation.populate("participants");
    }

    return NextResponse.json({ success: true ,conversation});
  } catch (err) {
    console.error("❌ Conversation API Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
