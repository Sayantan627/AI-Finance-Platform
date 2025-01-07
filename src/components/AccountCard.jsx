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

const AccountCard = ({ account }) => {
  const { name, id, type, balance, isDefault } = account;
  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <Link href={`account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium capitalize">
            {name}
          </CardTitle>
          <Switch checked={isDefault} />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">
            ${parseFloat(balance).toFixed(2)}
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
