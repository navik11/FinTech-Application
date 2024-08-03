import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "../ui/input"
import { SERVER } from "@/app/constants"
import axios from "axios"
import { Label } from "@radix-ui/react-label"

export function FundTransferDialog({ getUser }: { getUser: () => void }) {
    const [goal, setGoal] = React.useState(500)
    const [password, setPass] = React.useState("")
    const [acno, setAcno] = React.useState<number>()
    const [errmsg, setErrmsg] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    React.useEffect(()=>{
        if(loading)
        setErrmsg(() => "");
        else setPass(() => "")
    }, [loading])

    function onClick(adjustment: number) {
        setGoal(goal + adjustment)
    }

    async function transfer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        if (password === "") {
            setErrmsg("Password is required")
            setLoading(false)
            return
        }

        if (goal <= 0) {
            setErrmsg("Amount must be greater than 0")
            setLoading(false)
            return
        }

        if(acno === undefined || acno < 630700900000 || acno > 630700999999) {
            setErrmsg("Invalid account number")
            setLoading(false)
            return
        }

        const payload = {
            to: acno,
            amount: goal,
            password: password
        }

        await axios.post(SERVER + "/api/v1/users/transfer", payload, { withCredentials: true })
            .then((res) => {
                setErrmsg("Money sent")
                getUser()
                setLoading(false)
            })
            .catch((err) => {
                const msg = err?.response?.data?.message || err?.response?.data?.messege;
                setLoading(false)
                if (msg == "jwt expired") {
                    setErrmsg("Session expired, please login again")
                    return
                }
                setErrmsg(msg || "An error occured")
                console.log(err)
            })
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline" className="w-full">Fund Transfer</Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Fund transfer</DrawerTitle>
                        <DrawerDescription>Send money to other accounts</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="flex items-center justify-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 shrink-0 rounded-full mt-[-28px]"
                                onClick={() => onClick(-25)}
                                disabled={goal <= 100 || loading}
                            >
                                <Minus className="h-4 w-4" />
                                <span className="sr-only">Decrease</span>
                            </Button>
                            <div className="flex-1 text-center">
                                <Input type="number" onChange={(e) => { e.preventDefault(); setGoal(parseInt(e.target.value)); }} value={goal} className="text-2xl font-bold tracking-tighter items-center justify-center text-center" disabled={loading} />
                                <div className="text-[0.70rem] uppercase text-muted-foreground mt-3">
                                    Rs.
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 shrink-0 rounded-full mt-[-28px]"
                                onClick={() => onClick(50)}
                                disabled={loading}
                            >
                                <Plus className="h-4 w-4" />
                                <span className="sr-only">Increase</span>
                            </Button>
                        </div>
                        <div className="my-6 text-center">
                            <span>{errmsg}</span>
                        </div>
                    </div>
                    <DrawerFooter>
                        <form onSubmit={async (e) => await transfer(e)}>
                            <Label htmlFor="ftacno" className="text-sm">Account number</Label>
                            <Input type="number" id='ftacno' placeholder="6307009XXXXX" onChange={(e) => { e.preventDefault(); setAcno(parseInt(e.target.value)); }} value={acno} className="text-sm tracking-tighter items-center justify-center mt-1" required disabled={loading} />
                            <Input type="password" placeholder="password" onChange={(e) => { e.preventDefault(); setPass((e.target.value)); }} value={password} className="text-sm tracking-tighter items-center justify-center mt-2" required disabled={loading} />
                            <Button className="w-full mt-3" type="submit">Send money</Button>
                        </form>
                        <DrawerClose asChild>
                            <Button variant={"destructive"}>Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
