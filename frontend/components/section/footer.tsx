"use client"
import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from "axios";
import { SERVER } from "@/app/constants";
import { useRouter } from "next/navigation"

export function Footer() {

    const router = useRouter();

    const { setTheme } = useTheme()
    const logout = () => {
        axios.get(SERVER + "/api/v1/users/get_transactions", { withCredentials: true }).then((res) => {
            router.push("/auth");
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <div className="flex justify-between w-[390px]">
            <Button variant="link" className=" text-slate-400">
                @github.com/navik11
            </Button>
            <div className="flex justify-around text-slate-500 dark:text-slate-400">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {/* <Button variant="ghost" size="icon">
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button> */}
                        <Button variant="link" className=" text-slate-400">
                            Theme
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="link" className=" text-slate-400" onClick={logout}>
                    {/* <LogOut className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /> */}
                    Logout
                </Button>
            </div>
        </div>
    )
}