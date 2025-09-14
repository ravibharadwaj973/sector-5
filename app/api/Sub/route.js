import {NextResponse} from  "next/server"
import ConnectDB from "../../connection/moongo"
import {User} from "../../model/User"
export async function GET() {
  try {
    await ConnectDB()
    const result=await User.find();
  
    return NextResponse.json({success:true,data:result})

  } catch (err) {
   
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}