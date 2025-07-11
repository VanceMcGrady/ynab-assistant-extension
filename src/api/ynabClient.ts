const YNAB_API_BASE_URL = "https://api.ynab.com/v1";

async function getYnabAccessToken(): Promise<string | null> {
  // Check for local environment variable first (for development)
  if (import.meta.env.VITE_YNAB_ACCESS_TOKEN) {
    return import.meta.env.VITE_YNAB_ACCESS_TOKEN;
  }

  // Fallback to Chrome storage (for deployed extension)
  return new Promise((resolve) => {
    chrome.storage.sync.get("ynabAccessToken", (result) => {
      resolve(result.ynabAccessToken || null);
    });
  });
}

async function ynabFetch(
  endpoint: string,
  options?: RequestInit
): Promise<any> {
  const accessToken = await getYnabAccessToken();
  console.log("Using YNAB access token:", accessToken);

  if (!accessToken) {
    throw new Error(
      "YNAB access token not found. Please set it in the extension options."
    );
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    ...(options?.headers || {}),
  };

  const response = await fetch(`${YNAB_API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `YNAB API Error: ${response.status} - ${errorData.error.name}: ${errorData.error.detail}`
    );
  }

  return response.json();
}

export async function getBudgets(): Promise<any> {
  try {
    const data = await ynabFetch("/budgets");
    return data.data.budgets;
  } catch (error) {
    console.error("Failed to fetch budgets:", error);
    throw error;
  }
}

export async function getTransactions(
  budgetId: string = getBudgets()[0].id
): Promise<any> {
  console.log(
    `Fetching transactions for budget ID: ${budgetId} from YNAB API...`
  );
  try {
    const data = await ynabFetch(`/budgets/${budgetId}/transactions`);
    return data.data.transactions;
  } catch (error) {
    console.error(
      `Failed to fetch transactions for budget ID ${budgetId}:`,
      error
    );
    throw error;
  }
}
