"use client";

import { ArrowUpRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Switch } from "./ui/switch";
import { ArrowDownRight } from "lucide-react";
import Link from "next/link";
import useFetch from "@/hooks/use-fetch";
import { updateDefaultAccount } from "@/actions/account";
import { toast } from "sonner";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const AccountCard = ({ account }) => {
  const { name, id, type, balance, isDefault } = account;

  const {
    data: updatedAccount,
    error,
    fn: updateDefaultAccountFn,
    loading: updateDefaultAccountLoading,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault();

    if (isDefault) {
      toast.warning("At least 1 account should be default");
      return;
    }

    await updateDefaultAccountFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success && !updateDefaultAccountLoading) {
      toast.success("Your default account updated");
    }
  }, [updatedAccount, updateDefaultAccountLoading]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <Link href={`account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium capitalize">
            {name}
          </CardTitle>
          {updateDefaultAccountLoading ? (
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
          ) : (
            <Switch
              checked={isDefault}
              onClick={handleDefaultChange}
              disabled={updateDefaultAccountLoading}
            />
          )}
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">
            ₹{parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};
export default AccountCard;
