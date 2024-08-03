"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { User } from "@/type/user";
import { DepositDialog } from "../drawer/deposit";
import { WithDrawDialog } from "../drawer/withdraw";
import { FundTransferDialog } from "../drawer/fundtransfer";

export function Dashboard({user, getUser} : {user: User, getUser: ()=>void}) {
    return (
        <Card>
            <div className="flex w-full justify-between items-center pr-6">
                <CardHeader className="flex w-240 justify-between">
                    <div className="w-60">
                        <CardDescription>
                            {user.username}
                        </CardDescription>
                        <CardTitle>Rs. {user.balance}</CardTitle>
                    </div>
                </CardHeader>
                <DepositDialog getUser={getUser}/>
            </div>
            <CardContent className="space-y-2">
                <div className="space-y-1 text-sm">
                    <div className="flex w-full justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">Account Number</span>
                        <span>{user.account_number}</span>
                    </div>
                    <div className="flex w-full justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">Name</span>
                        <span>{user.name}</span>
                    </div>
                    <div className="flex w-full justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">Username</span>
                        <span>{user.username}</span>
                    </div>
                    <div className="flex w-full justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">Address</span>
                        <span>{user.address}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between w-full">
                <WithDrawDialog getUser={getUser}/>
                <div className="w-3"/>
                <FundTransferDialog getUser={getUser}/>
            </CardFooter>
        </Card>
    );
}