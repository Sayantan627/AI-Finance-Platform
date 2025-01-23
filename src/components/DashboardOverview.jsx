"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { format } from "date-fns";
import { ArrowDownRight } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

const DashboardOverview = ({ accounts, transactions }) => {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((acc) => acc.isDefault)?.id || accounts[0]?.id
  );

  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Current month expenses
  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Group expenses by category
  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  const colors = [
    "#FF5733", // Food - Vibrant Red-Orange
    "#33B5E5", // Transport - Bright Blue
    "#FFC300", // Entertainment - Yellow
    "#8D33FF", // Utilities - Purple
    "#33FF57", // Health - Green
    "#FF33A1", // Shopping - Pink
    "#33FFF5", // Travel - Cyan
    "#FF8C33", // Miscellaneous - Orange
    "#A833FF", // Rent - Deep Purple
    "#3377FF", // Savings - Soft Blue
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center pb-4 space-y-0">
          <CardTitle className="text-base font-normal">
            Recent Transactions
          </CardTitle>
          <Select
            value={selectedAccountId}
            onValueChange={setSelectedAccountId}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No recent transactions
              </p>
            ) : (
              recentTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {t.description || "Untitled Transaction"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(t.date), "PP")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex items-center",
                        t.type === "EXPENSE" ? "text-red-500" : "text-green-500"
                      )}
                    >
                      {t.type === "EXPENSE" ? (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      )}
                      ₹{t.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-normal">
            Monthly Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-5">
          {pieChartData.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No expenses this month
            </p>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width={"99%"} height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ₹${value.toFixed(2)}`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default DashboardOverview;
