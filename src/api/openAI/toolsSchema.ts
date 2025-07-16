export const tools = [
  {
    type: "function" as const,
    function: {
      name: "getBudgets",
      description: "Get a list of all budgets available in YNAB.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "getTransactions",
      description: "Get a list of all transactions for a given budget ID.",
      parameters: {
        type: "object",
        properties: {
          budgetId: {
            type: "string",
            description: "The ID of the budget to retrieve transactions from.",
          },
        },
        required: ["budgetId"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "getCategories",
      description: "Get a list of all categories for a given budget ID.",
      parameters: {
        type: "object",
        properties: {
          budgetId: {
            type: "string",
            description: "The ID of the budget to retrieve categories from.",
          },
        },
        required: ["budgetId"],
      },
    },
  },
];
