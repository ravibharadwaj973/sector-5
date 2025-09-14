import ConnectDB from "../../connection/moongo";
import { User } from "../../model/User";
import { NextResponse } from "next/server";


export async function GET(req ) {
  try {
    await ConnectDB();
  //  const { username, password } = await req.json();
   

    // const data = await User.find({username});
    const data = await User.find();
    

    return NextResponse.json({ success: true ,data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
export async function POST(req ) {
  try {
    await ConnectDB();
    const { username, password } = await req.json();

    const data = new User({ username, password });
    await data.save();

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
