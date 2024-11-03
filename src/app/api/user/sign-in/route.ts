// app/api/user/signin/route.ts
import { upsertUser } from '@/lib/user.service';
import { IUserModel } from '@/models/user.model';
import { ILoggedInUser } from '@/types/shared.types';
import { NextRequest, NextResponse } from 'next/server';
// import { upsertUse r } from '@/lib/userService';
// import { IUserModel } from '@/models/User';



export async function POST(request: NextRequest) {
  try {
    const loggedInUser: ILoggedInUser = await request.json();

    const user: IUserModel = {
      ...loggedInUser,
      modules: {
        BALANCE_SHEET: { preferences: {} },
        // INVOICE_GENERATOR: { preferences: {} },
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const { user: upsertedUser, created } = await upsertUser(user);

    return NextResponse.json({
      success: true,
      data: upsertedUser,
      message: created ? "User created" : "User updated",
    });
  } catch (error) {
    console.error("Error in user sign-in:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sign in user" },
      { status: 500 }
    );
  }
}