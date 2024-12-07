import React, { useState, useMemo } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { FileUpload } from './components/FileUpload';
import { ExpenseList } from './components/ExpenseList';
import { Dashboard } from './components/Dashboard';
import { CategoryFilter } from './components/CategoryFilter';
import { parseExcelFile } from './utils/expenseParser';
import { analyzeExpenses } from './utils/expenseAnalytics';
import { Expense } from './types/expense';
import { BarChart3, Upload } from 'lucide-react';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState(analyzeExpenses([]));

  const handleFileUpload = async (file: File) => {
    const parsedExpenses = await parseExcelFile(file);
    setExpenses(parsedExpenses);
    setAnalysis(analyzeExpenses(parsedExpenses));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setExpenses((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = [...items];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);
        return newItems;
      });
    }
  };

  const handleNewFile = () => {
    setExpenses([]);
    setAnalysis(analyzeExpenses([]));
    setSelectedCategory(null);
  };

  const categories = useMemo(() => {
    return Array.from(new Set(expenses.map(expense => expense.category))).sort();
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return selectedCategory
      ? expenses.filter(expense => expense.category === selectedCategory)
      : expenses;
  }, [expenses, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Family Budget Analyzer
              </h1>
            </div>
            {expenses.length > 0 && (
              <button
                onClick={handleNewFile}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload New File
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {expenses.length === 0 ? (
            <FileUpload onFileUpload={handleFileUpload} />
          ) : (
            <>
              <Dashboard analysis={analysis} />
              
              <div className="bg-white rounded-lg shadow p-6">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                />
                
                <h2 className="text-xl font-semibold mb-4">
                  {selectedCategory ? `${selectedCategory} Expenses` : 'All Expenses'}
                </h2>
                
                <DndContext onDragEnd={handleDragEnd}>
                  <ExpenseList expenses={filteredExpenses} />
                </DndContext>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;