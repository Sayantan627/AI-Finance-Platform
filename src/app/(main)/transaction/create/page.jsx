import { getUserAccounts } from "@/actions/dashboard";
import AddTransactionForm from "@/components/AddTransactionForm";
import { defaultCategories } from "@/data/categories";

const AddTransactionPage = async () => {
  const accounts = await getUserAccounts();
  return (
    <div className="max-w-3xl mx-auto px-5">
      <h1 className="text-5xl mb-8 gradient-title">Add Transaction</h1>

      <AddTransactionForm accounts={accounts} categories={defaultCategories} />
    </div>
  );
};
export default AddTransactionPage;
