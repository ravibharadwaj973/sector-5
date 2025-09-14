import ConnectDB from "../../connection/moongo";
import {Message} from "../../model/conversation"
import {NextResponse} from "next/server"
export async function GET() {
  try {
    await ConnectDB();
    return NextResponse.json({success:true,data:[]})

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}


export async function Post(req) {
  try {
      const payload=await req.json();
    await ConnectDB();
    const result= new Message(payload);
    await result.save();
    return NextResponse.json({success:true,data:result})

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

