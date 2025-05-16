import { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ type: "income", category: "", amount: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { type, category, amount } = form;
    if (!category || !amount || isNaN(amount)) return alert("Invalid input");
    setEntries([...entries, { ...form, amount: parseFloat(amount) }]);
    setForm({ type: "income", category: "", amount: "" });
  };

  const income = entries.filter((e) => e.type === "income");
  const expense = entries.filter((e) => e.type === "expense");
  const totalIncome = income.reduce((sum, e) => sum + e.amount, 0);
  const totalExpense = expense.reduce((sum, e) => sum + e.amount, 0);

  const pieData = {
    labels: expense.map((e) => e.category),
    datasets: [
      {
        label: "Expenses",
        data: expense.map((e) => e.amount),
        backgroundColor: ["#f87171", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa"],
      },
    ],
  };

  const barData = {
    labels: [...income.map(e => `${e.category} (Income)`), ...expense.map(e => `${e.category} (Expense)`)],
    datasets: [
      {
        label: "Income & Expense Entries",
        data: [...income.map(e => e.amount), ...expense.map(e => e.amount)],
        backgroundColor: [...income.map(() => "#4ade80"), ...expense.map(() => "#f87171")],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 font-sans">
      <h1 className="text-3xl font-bold text-center mb-6">Budget Visualizer</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-4 max-w-xl mx-auto"
      >
        <div className="flex flex-col gap-2">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Add Entry
          </button>
        </div>
      </form>

      <section className="grid md:grid-cols-2 gap-6 mt-8 max-w-5xl mx-auto">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Expense Breakdown</h2>
          {expense.length > 0 ? <Pie data={pieData} /> : <p>No expenses yet.</p>}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">All Entries Overview</h2>
          <Bar data={barData} />
          <p className="mt-4 font-medium">
            Total Income: ${totalIncome} | Total Expense: ${totalExpense} | Balance: ${totalIncome - totalExpense}
          </p>
        </div>
      </section>
    </main>
  );
}
