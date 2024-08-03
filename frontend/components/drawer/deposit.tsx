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

export function DepositDialog({getUser} : {getUser: ()=>void}) {
    const [goal, setGoal] = React.useState(500)
    const [password, setPass] = React.useState("")
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

    async function deposit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        if (password === "") {
            setErrmsg("Password is required")
            setLoading(false)
            return
        } 
        
        if(goal <= 0) {
            setErrmsg("Amount must be greater than 0")
            setLoading(false)
            return
        }

        const payload = {
            amount: goal,
            password: password
        }

        await axios.post(SERVER + "/api/v1/users/deposit", payload, { withCredentials: true })
        .then((res) => {
            setErrmsg("Successfully deposited")
            getUser()
            setLoading(false)
        })
        .catch((err) => {
            const msg = err?.response?.data?.message || err?.response?.data?.messege;
            setLoading(false)
            if(msg == "jwt expired") {
                setErrmsg("Session expired, please login again")
                return
            }
            setErrmsg(msg)
        })
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className="w-12 h-12 rounded-full font-light text-2xl">+</Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Deposit fund</DrawerTitle>
                        <DrawerDescription>Add money to your account</DrawerDescription>
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
                                <Input type="number" onChange={(e) => { e.preventDefault(); setGoal(parseInt(e.target.value)); }} value={goal} className="text-2xl font-bold tracking-tighter items-center justify-center text-center" disabled={loading}/>
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
                        <form onSubmit={async(e) => await deposit(e)}>
                            <Input type="password" placeholder="password" onChange={(e) => { e.preventDefault(); setPass((e.target.value)); }} value={password} className="text-sm tracking-tighter items-center justify-center mt-1" required disabled={loading}/>
                            <Button className="w-full mt-3" type="submit">One click Deposit</Button>
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
