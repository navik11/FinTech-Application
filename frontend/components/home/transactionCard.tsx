"use client"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { formatDateTime } from "@/lib/utils";
import { Transaction } from "@/type/transaction";
import { User } from "@/type/user";

export function TransactionCard({transaction, user} : {transaction: Transaction, user: User}) {
    let f = transaction.from === 0 ? "Deposit" : transaction.from.toString();
    let t = transaction.to === 0 ? "Withdraw" : transaction.to.toString();
    f = f === user.account_number.toString() ? user.username : f;
    t = t === user.account_number.toString() ? user.username : t;
    const { time, date } = formatDateTime(transaction.created_at);
    const bt = transaction.from === user.account_number;
    const sign = bt ? "-" : "+";
    const className = bt?"flex w-full justify-between items-center pr-6 bg-slate-100 dark:bg-slate-900":"flex w-full justify-between items-center pr-6";
    return (
        <Card>
            <div className={className}>
                <CardHeader className="flex w-240 justify-between">
                    <div className="w-60">
                        <CardDescription>
                            {f + " - " + t}
                        </CardDescription>
                        <CardDescription>
                            {time + ", " + date}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardTitle className="text-lg">{sign+transaction.amount}</CardTitle>
            </div>
        </Card>
    );
}