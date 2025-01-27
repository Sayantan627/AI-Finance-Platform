import { getUserAccounts } from "@/actions/dashboard";
import { getTransaction } from "@/actions/transaction";
import AddTransactionForm from "@/components/AddTransactionForm";
import { defaultCategories } from "@/data/categories";

const AddTransactionPage = async props => {
  const searchParams = await props.searchParams;
  const accounts = await getUserAccounts();
  const editId = await searchParams?.id;

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
