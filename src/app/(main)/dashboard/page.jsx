import { getCurrentBudget } from "@/actions/budget";
import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import AccountCard from "@/components/AccountCard";
import BudgetProgress from "@/components/BudgetProgress";
import CreateAccountDrawer from "@/components/create-account-drawer";
import DashboardOverview from "@/components/DashboardOverview";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Suspense } from "react";

const DashboardPage = async () => {
  const accounts = await getUserAccounts();

  const defaultAccount = accounts?.find((account) => account.isDefault);

  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  const transactions = await getDashboardData();

  return (
    <div className="space-y-8">
      {/* Budget Progress */}
      {defaultAccount && (
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}

      {/* Overview */}
      <Suspense fallback={"Loading overview..."}>
        <DashboardOverview
          accounts={accounts}
          transactions={transactions || []}
        />
      </Suspense>

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="border-dashed hover:shadow-md cursor-pointer transition-shadow">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground pt-5 h-full">
              <Plus className="h-10 w-10 mb-2" />
              <p className="font-medium text-sm capitalize">add new account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {accounts.length > 0 &&
          accounts?.map((account) => {
            return <AccountCard key={account.id} account={account} />;
          })}
      </div>
    </div>
  );
};
export default DashboardPage;
