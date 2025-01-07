import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="px-5">
      {/* Budget Progress */}

      {/* Overview */}

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
      </div>
    </div>
  );
};
export default DashboardPage;
