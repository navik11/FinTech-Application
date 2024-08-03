"use client"
import { Dashboard } from "@/components/home/dashboard";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { User } from "@/type/user";
import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER } from "../constants";
import { useRouter } from "next/navigation";
import { Transaction } from "@/type/transaction";
import { TransactionCard } from "@/components/home/transactionCard";
import { Footer } from "@/components/section/footer";

const dummy_user: User = {
  name: "loading . .",
  username: "loading . .",
  account_number: 0,
  balance: 0,
  address: "loading . .",
}

export default function Home() {

  const [user, setUser] = useState<User>(dummy_user);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();

  const getUser = () => {
    axios.get(SERVER + "/api/v1/users/getUser", { withCredentials: true }).then((res) => {
      setUser(() => res.data.data)
      console.log(res.data.data)
    }).catch((err) => {
      router.push("/session_expired");
    })
  }

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    axios.get(SERVER + "/api/v1/users/get_transactions", { withCredentials: true }).then((res) => {
      console.log(res?.data?.data?.data?.transactions)
      setTransactions(() => (res?.data?.data?.data?.transactions || []))
    }).catch((err) => {
      console.log(err)
    })
  }, [user]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {/* <Topbar /> */}
      <div className="mb-4"></div>
      <Tabs defaultValue="dash" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dash">Dashboard</TabsTrigger>
          <TabsTrigger value="tran">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="dash">
          <Dashboard user={user} getUser={getUser}/>
        </TabsContent>
        <TabsContent value="tran">
          {
            transactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} user={user}/>
            ))
          }
        </TabsContent>
      </Tabs> 
      <Footer />
    </main>
  );
}
