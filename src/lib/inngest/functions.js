import { db } from "../prisma";
import { inngest } from "./client";

function isNewMonth(lastAlertSent, currentDate) {
  return (
    lastAlertSent.getFullYear() !== currentDate.getFullYear() ||
    lastAlertSent.getMonth() !== currentDate.getMonth()
  );
}

export const helloWorld = inngest.createFunction(
  { name: "Hello World" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const checkBudgetAlerts = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    const budgets = await step.run("fetch-budgets", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });

    console.log(budgets);

    for (const budget of budgets) {
      const defaultAccount = budget.user.accounts[0];
      if (!defaultAccount) continue;

      await step.run(`check-budget-${budget.id}`, async () => {
        // const startDate = new Date();
        // startDate.setDate(1); // Start of current month

        const currentDate = new Date();

        const startMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        const endMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );

        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccount.id, // Only consider default account
            type: "EXPENSE",
            date: {
              gte: startMonth,
              lte: endMonth,
            },
          },
          _sum: {
            amount: true,
          },
        });

        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = budget.amount;
        const percentageUsed = (totalExpenses / budgetAmount) * 100;

        // Check if we should send an alert
        if (
          percentageUsed >= 80 &&
          (!budget.lastAlertSent ||
            isNewMonth(new Date(budget.lastAlertSent), new Date()))
        ) {
          // await sendEmail({
          //   to: budget.user.email,
          //   subject: `Budget Alert for ${defaultAccount.name}`,
          //   react: EmailTemplate({
          //     userName: budget.user.name,
          //     type: "budget-alert",
          //     data: {
          //       percentageUsed,
          //       budgetAmount: parseInt(budgetAmount).toFixed(1),
          //       totalExpenses: parseInt(totalExpenses).toFixed(1),
          //       accountName: defaultAccount.name,
          //     },
          //   }),
          // });

          // Update last alert sent
          await db.budget.update({
            where: { id: budget.id },
            data: { lastAlertSent: new Date() },
          });
        }
      });
    }
  }
);
