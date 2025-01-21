"use client";

import { createTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import CreateAccountDrawer from "./create-account-drawer";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { Switch } from "./ui/switch";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import ReceiptScanner from "./ReceiptScanner";

const AddTransactionForm = ({ accounts, categories }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: "",
      description: "",
      date: new Date(),
      accountId: accounts.find((acc) => acc.isDefault)?.id,
      isRecurring: false,
    },
  });

  const {
    data: transactionResult,
    loading: transactionLoading,
    fn: transactionFn,
    error,
  } = useFetch(createTransaction);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter((cat) => cat.type === type);

  useEffect(() => {
    if (transactionResult && !transactionLoading) {
      toast.success("New transaction created");
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };
    await transactionFn(formData);
  };

  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* Ai receipt scanner */}
      <ReceiptScanner onScanComplete={handleScanComplete} />

      {/* Type */}
      <div className="space-y-2">
        <label htmlFor="type" className="text-sm font-medium">
          Type
        </label>
        <Select
          defaultValue={type}
          onValueChange={(val) => setValue("type", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Amount */}
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Amount
          </label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.0"
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>

        {/* Account Select */}
        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium">
            Account
          </label>
          <Select
            defaultValue={getValues("accountId")}
            onValueChange={(val) => setValue("accountId", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} (${parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button
                  variant="ghost"
                  className="select-none w-full items-center text-sm outline-none"
                >
                  Create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId && (
            <p className="text-sm text-red-500">{errors.accountId.message}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label htmlFor="type" className="text-sm font-medium">
          Category
        </label>
        <Select
          defaultValue={getValues("category")}
          onValueChange={(val) => setValue("category", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label htmlFor="type" className="text-sm font-medium">
          Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full pl-3 text-left font-normal"
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto w-4 h-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => setValue("date", date)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">
          Description
        </label>
        <Input
          id="description"
          placeholder="Enter description"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* isRecurring */}
      <div className="flex flex-row items-center justify-between p-4 rounded-lg border">
        <div className="space-y-0.5">
          <label
            htmlFor="isRecurring"
            className="text-sm font-medium cursor-pointer"
          >
            Recurring Transaction
          </label>
          <p className="text-sm text-muted-foreground">
            This transaction will be a recurring transaction
          </p>
        </div>
        <Switch
          id="isRecurring"
          onCheckedChange={(checked) => setValue("isRecurring", checked)}
          checked={isRecurring}
        />
      </div>

      {/* Recurring Interval */}
      {isRecurring && (
        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium">
            Recurring Interval
          </label>
          <Select
            defaultValue={getValues("recurringInterval")}
            onValueChange={(val) => setValue("recurringInterval", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Recurring Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && (
            <p className="text-sm text-red-500">
              {errors.recurringInterval.message}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          className="w-full"
          variant="outline"
          type="button"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button className="w-full" type="submit" disabled={transactionLoading}>
          Create Transaction
        </Button>
      </div>
    </form>
  );
};
export default AddTransactionForm;
