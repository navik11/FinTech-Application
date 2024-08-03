"use client"
import { SERVER } from "@/app/constants"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import { cn } from "@/lib/utils"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LoginBox() {
    const [errMsg, setErrMsg] = useState<string>("")
    const [errMsg2, setErrMsg2] = useState<string>("")
    const router = useRouter()

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrMsg("please wait . .")
        const payload = {
            username: e.currentTarget.username.value,
            password: e.currentTarget.password.value,
        }

        await axios.post(SERVER+"/api/v1/users/login", payload, {withCredentials: true}).then((res) => {
            setErrMsg("")
            router.push("/home")
        }).catch((err) => {
            let msg = err?.response?.data?.message || err?.response?.data?.messege
            if(!msg) msg = "Something went wrong"
            setErrMsg(msg)
        })
    }

    const handleRegister = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrMsg2("please wait . .")
        const payload = {
            name: e.currentTarget.fname.value,
            address: e.currentTarget.address.value,
            username: e.currentTarget.username.value,
            password: e.currentTarget.password.value,
            balance: 0,
        }

        const cpassword = e.currentTarget.cpassword.value
        if(payload.password !== cpassword) {
            setErrMsg2("passwords do not match")
            return
        }

        await axios.post(SERVER+"/api/v1/users/createUser", payload, {withCredentials: true}).then((res) => {
            setErrMsg2("All set, plesae sign in")
        }).catch((err) => {
            let msg = err?.response?.data?.message || err?.response?.data?.messege
            if(!msg) msg = "Something went wrong"
            setErrMsg(msg)
        })
    }

    return (
        <Tabs defaultValue="account" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Sign in</TabsTrigger>
                <TabsTrigger value="password">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <Card>
                    <form onSubmit={handleSignIn}>
                        <CardHeader>
                            <CardTitle>Welcome, back!</CardTitle>
                            <CardDescription>
                                Sign in with your username or account number to continue.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="username">Username or Acc. number</Label>
                                <Input id="username" placeholder="sachida / 6307009XXXXX" required/>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" placeholder="password" type="password" required/>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between w-full">
                            <span className={cn("text-sm text-slate-500 dark:text-slate-400")}>{errMsg}</span>
                            <Button type="submit">Sign in</Button>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>
            <TabsContent value="password">
                <Card>
                    <CardHeader>
                        <CardTitle>Ready to go!</CardTitle>
                        <CardDescription>
                            Just one step to easify your money, please enter your details.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleRegister}>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="fname">Full name</Label>
                                <Input id="fname" placeholder="Sachidanand Navik" required/>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="username">Choose username</Label>
                                <Input id="username" placeholder="sachida" required/>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" placeholder="H78- IIT Kanpur 208016" required/>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Create password</Label>
                                <Input id="password" placeholder="password" type="password" required/>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="cpassword">Confirm password</Label>
                                <Input id="cpassword" placeholder="confirm password" type="password" required/>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between w-full">
                            <span className={cn("text-sm text-slate-500 dark:text-slate-400")}>{errMsg2}</span>
                            <Button type="submit">Register</Button>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
