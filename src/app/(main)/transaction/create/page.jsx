import { getUserAccounts } from "@/actions/dashboard";
import { getTransaction } from "@/actions/transaction";
import AddTransactionForm from "@/components/AddTransactionForm";
import { defaultCategories } from "@/data/categories";

const AddTransactionPage = async ({ searchParams }) => {
  const accounts = await getUserAccounts();
  const { edit: editId } = await searchParams;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto px-5">
      <h1 className="text-5xl mb-8 gradient-title">
        {editId ? "Edit" : "Add"} Transaction
      </h1>

      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
};
export default AddTransactionPage;
