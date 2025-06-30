import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// PDF Export Functions
export const exportToPDF = async (elementId, filename = 'financial-report.pdf') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0f172a'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    return false;
  }
};

export const generateFinancialReportPDF = (data, type = 'comprehensive') => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(51, 51, 51);
  pdf.text('Agency Finance Report', pageWidth / 2, 20, { align: 'center' });
  pdf.setFontSize(12);
  pdf.setTextColor(102, 102, 102);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });

  let yPosition = 50;

  // Financial Metrics
  pdf.setFontSize(16);
  pdf.setTextColor(51, 51, 51);
  pdf.text('Financial Overview', 20, yPosition);
  yPosition += 15;

  pdf.setFontSize(12);
  const metrics = data.calculateMetrics();
  
  const financialData = [
    ['Total Revenue', `£${metrics.totalRevenue.toLocaleString()}`],
    ['Total Costs', `£${metrics.totalCosts.toLocaleString()}`],
    ['Gross Profit', `£${metrics.grossProfit.toLocaleString()}`],
    ['Corporation Tax', `£${metrics.corporationTax.toLocaleString()}`],
    ['Net Profit', `£${metrics.netProfit.toLocaleString()}`],
    ['Profit Margin', `${metrics.profitMargin.toFixed(1)}%`]
  ];

  financialData.forEach(([label, value]) => {
    pdf.text(label, 20, yPosition);
    pdf.text(value, 120, yPosition);
    yPosition += 8;
  });

  const filename = `agency-finance-report-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
  return filename;
};

// CSV Template Generation Functions
export const generateCSVTemplate = (type, fiscalYear, fiscalYearStart) => {
  const startDate = new Date(`${fiscalYearStart} 1, ${fiscalYear}`);
  const endDate = new Date(`${fiscalYearStart} 1, ${fiscalYear + 1}`);
  endDate.setDate(endDate.getDate() - 1);

  switch (type) {
    case 'profitLoss':
      return generateProfitLossTemplate(fiscalYear, startDate, endDate);
    case 'balanceSheet':
      return generateBalanceSheetTemplate(fiscalYear, startDate, endDate);
    case 'bankTransactions':
      return generateBankTransactionTemplate(fiscalYear, startDate, endDate);
    default:
      return '';
  }
};

const generateProfitLossTemplate = (fiscalYear, startDate, endDate) => {
  const template = [
    ['Account', 'Amount', 'Type', 'Notes'],
    ['# REVENUE ITEMS - FY' + fiscalYear, '', '', ''],
    ['Client Services Revenue', '50000', 'revenue', 'Main service revenue'],
    ['Consulting Revenue', '25000', 'revenue', 'Consulting fees'],
    ['Recurring Revenue', '30000', 'revenue', 'Monthly retainers'],
    ['Other Revenue', '5000', 'revenue', 'Miscellaneous income'],
    ['', '', '', ''],
    ['# EXPENSE ITEMS - FY' + fiscalYear, '', '', ''],
    ['Salaries and Wages', '30000', 'expense', 'Employee salaries'],
    ['Office Rent', '12000', 'expense', 'Monthly office rent'],
    ['Marketing and Advertising', '8000', 'expense', 'Marketing campaigns'],
    ['Professional Fees', '5000', 'expense', 'Legal and accounting'],
    ['Utilities', '2400', 'expense', 'Office utilities'],
    ['Insurance', '3000', 'expense', 'Business insurance'],
    ['Travel and Meals', '4000', 'expense', 'Business travel'],
    ['Office Supplies', '1500', 'expense', 'Stationery and supplies'],
    ['Software Subscriptions', '6000', 'expense', 'Business software'],
    ['Equipment Depreciation', '3000', 'expense', 'Equipment depreciation'],
    ['Other Operating Expenses', '2000', 'expense', 'Miscellaneous costs']
  ];

  return template.map(row => row.join(',')).join('\n');
};

const generateBalanceSheetTemplate = (fiscalYear, startDate, endDate) => {
  const template = [
    ['Account', 'Amount', 'Category', 'Notes'],
    ['# CURRENT ASSETS - FY' + fiscalYear, '', '', ''],
    ['Cash and Cash Equivalents', '25000', 'asset', 'Bank accounts and cash'],
    ['Accounts Receivable', '15000', 'asset', 'Outstanding client invoices'],
    ['Prepaid Expenses', '3000', 'asset', 'Prepaid insurance and rent'],
    ['', '', '', ''],
    ['# NON-CURRENT ASSETS', '', '', ''],
    ['Office Equipment', '20000', 'asset', 'Computers and office equipment'],
    ['Furniture and Fixtures', '8000', 'asset', 'Office furniture'],
    ['Software Licenses', '5000', 'asset', 'Intangible assets'],
    ['', '', '', ''],
    ['# CURRENT LIABILITIES', '', '', ''],
    ['Accounts Payable', '8000', 'liability', 'Outstanding supplier bills'],
    ['Accrued Expenses', '4000', 'liability', 'Accrued salaries and utilities'],
    ['Short-term Loans', '5000', 'liability', 'Credit lines and short-term debt'],
    ['', '', '', ''],
    ['# NON-CURRENT LIABILITIES', '', '', ''],
    ['Long-term Debt', '15000', 'liability', 'Business loans and mortgages'],
    ['', '', '', ''],
    ['# EQUITY', '', '', ''],
    ['Share Capital', '10000', 'equity', 'Issued share capital'],
    ['Retained Earnings', '34000', 'equity', 'Accumulated profits']
  ];

  return template.map(row => row.join(',')).join('\n');
};

const generateBankTransactionTemplate = (fiscalYear, startDate, endDate) => {
  const template = [
    ['Date', 'Description', 'Amount', 'Type', 'Category'],
    [`${fiscalYear}-04-01`, 'Client Payment - ABC Corp', '5000', 'credit', 'client_payment'],
    [`${fiscalYear}-04-02`, 'Office Rent Payment', '-1000', 'debit', 'office_expenses'],
    [`${fiscalYear}-04-03`, 'Salary Payment - Team', '-3000', 'debit', 'staff_costs'],
    [`${fiscalYear}-04-05`, 'Google Ads Payment', '-500', 'debit', 'marketing'],
    [`${fiscalYear}-04-10`, 'Client Payment - XYZ Ltd', '3000', 'credit', 'client_payment'],
    [`${fiscalYear}-04-15`, 'Software Subscription - Adobe', '-200', 'debit', 'other'],
    [`${fiscalYear}-04-20`, 'Consulting Fee Received', '2000', 'credit', 'client_payment'],
    [`${fiscalYear}-04-25`, 'Utilities Payment', '-150', 'debit', 'office_expenses'],
    [`${fiscalYear}-04-30`, 'Bank Interest', '25', 'credit', 'other']
  ];

  return template.map(row => row.join(',')).join('\n');
};

export const downloadCSVTemplate = (type, fiscalYear, fiscalYearStart) => {
  const csvContent = generateCSVTemplate(type, fiscalYear, fiscalYearStart);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const typeNames = {
    profitLoss: 'profit-loss',
    balanceSheet: 'balance-sheet',
    bankTransactions: 'bank-transactions'
  };
  
  const filename = `${typeNames[type]}-template-fy${fiscalYear}-${fiscalYear + 1}.csv`;
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Enhanced PDF Import Functions
export const extractTextFromPDF = async (file) => {
  try {
    console.log('Starting PDF text extraction for:', file.name);
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    console.log('PDF has', pdf.numPages, 'pages');
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log('Processing page', pageNum);
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ')
        .replace(/\s+/g, ' ');
      fullText += pageText + '\n';
    }
    
    console.log('Extracted text length:', fullText.length);
    console.log('Sample text:', fullText.substring(0, 500));
    return fullText;
  } catch (error) {
    console.error('PDF text extraction failed:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

// Enhanced CSV parser with MUCH better debugging
export const parseCSVFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        console.log('🔥 RAW CSV TEXT:', text.substring(0, 500));
        
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length === 0) {
          reject(new Error('CSV file is empty'));
          return;
        }

        const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
        console.log('📊 CSV Headers found:', headers);

        const data = [];
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index]?.trim() || '';
          });

          // Skip empty rows and comment rows
          if (Object.values(row).some(val => val && !val.startsWith('#'))) {
            data.push(row);
          }
        }

        console.log('📊 Parsed CSV data rows:', data.length);
        console.log('📊 Sample rows:', data.slice(0, 3));
        resolve(data);
      } catch (error) {
        console.error('❌ CSV parsing error:', error);
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read CSV file'));
    reader.readAsText(file);
  });
};

// Helper function to properly parse CSV lines with quoted values
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
};

// Bank transaction parser
export const parseBankTransactions = (csvData) => {
  console.log('Parsing bank transactions from CSV data');
  const transactions = [];

  csvData.forEach((row, index) => {
    try {
      // Skip comment rows
      if (!row.date || row.date.startsWith('#')) {
        return;
      }

      // Common CSV headers mapping
      const dateField = row.date || row.transaction_date || row['transaction date'] || row.posting_date;
      const descField = row.description || row.memo || row.reference || row.details;
      const amountField = row.amount || row.value || row.transaction_amount;
      const creditField = row.credit || row['credit amount'] || row.deposits;
      const debitField = row.debit || row['debit amount'] || row.withdrawals;
      const typeField = row.type || '';

      if (!dateField && !amountField && !creditField && !debitField) {
        return; // Skip rows with no financial data
      }

      let amount = 0;
      let type = 'unknown';

      // Determine amount and type
      if (amountField) {
        const numericAmount = parseFloat(amountField.replace(/[£$,]/g, ''));
        amount = Math.abs(numericAmount);
        type = numericAmount >= 0 ? 'credit' : 'debit';
      } else if (creditField && parseFloat(creditField.replace(/[£$,]/g, '')) > 0) {
        amount = parseFloat(creditField.replace(/[£$,]/g, '')) || 0;
        type = 'credit';
      } else if (debitField && parseFloat(debitField.replace(/[£$,]/g, '')) > 0) {
        amount = parseFloat(debitField.replace(/[£$,]/g, '')) || 0;
        type = 'debit';
      }

      // Override type if explicitly provided
      if (typeField.toLowerCase().includes('credit')) {
        type = 'credit';
      } else if (typeField.toLowerCase().includes('debit')) {
        type = 'debit';
      }

      if (amount > 0) {
        transactions.push({
          id: `transaction_${index}`,
          date: dateField || new Date().toISOString().split('T')[0],
          description: descField || 'Transaction',
          amount,
          type,
          category: categorizeTransaction(descField || '')
        });
      }
    } catch (error) {
      console.warn('Error parsing transaction row:', row, error);
    }
  });

  console.log('Parsed transactions:', transactions.length);
  return {
    transactions,
    summary: {
      totalTransactions: transactions.length,
      totalCredits: transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0),
      totalDebits: transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0)
    },
    source: 'csv_upload',
    extractedAt: new Date().toISOString()
  };
};

const categorizeTransaction = (description) => {
  const desc = description.toLowerCase();
  if (desc.includes('salary') || desc.includes('wages') || desc.includes('payroll')) {
    return 'staff_costs';
  }
  if (desc.includes('rent') || desc.includes('office') || desc.includes('utilities')) {
    return 'office_expenses';
  }
  if (desc.includes('marketing') || desc.includes('advertising') || desc.includes('google') || desc.includes('facebook')) {
    return 'marketing';
  }
  if (desc.includes('invoice') || desc.includes('payment received') || desc.includes('client')) {
    return 'client_payment';
  }
  if (desc.includes('tax') || desc.includes('hmrc') || desc.includes('vat')) {
    return 'tax';
  }
  return 'other';
};

// Enhanced P&L parser with better pattern recognition
export const parseProfitLossFromText = (text) => {
  console.log('Parsing P&L from text length:', text.length);
  
  const data = {
    revenue: {},
    expenses: {},
    totalRevenue: 0,
    totalExpenses: 0,
    netIncome: 0,
    extractedAt: new Date().toISOString(),
    source: 'pdf_extraction'
  };

  // Clean and normalize text
  const cleanText = text.replace(/\s+/g, ' ').toLowerCase();

  // Enhanced patterns for different document formats
  const revenuePatterns = [
    // Standard patterns
    /(?:total\s+)?(?:gross\s+)?revenue[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /(?:total\s+)?(?:net\s+)?sales[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /turnover[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /(?:gross\s+)?income[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /revenue\s+from\s+operations[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    // UK specific
    /turnover\s+and\s+other\s+income[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /sales\s+revenue[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    // Table format patterns
    /revenue\s+£?\s*([,\d]+(?:\.\d{2})?)/gi,
    /sales\s+£?\s*([,\d]+(?:\.\d{2})?)/gi
  ];

  const expensePatterns = [
    // Standard patterns
    /(?:total\s+)?(?:operating\s+)?expenses[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /(?:total\s+)?costs?[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /cost\s+of\s+(?:goods\s+)?sold[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /cost\s+of\s+sales[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    // Detailed expense categories
    /administrative\s+expenses[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /selling\s+expenses[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /staff\s+costs[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /employee\s+costs[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /wages\s+and\s+salaries[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /depreciation[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /rent[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /utilities[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /professional\s+fees[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /marketing[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /travel[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /insurance[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /other\s+expenses[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi
  ];

  const netIncomePatterns = [
    /net\s+(?:income|profit|earnings)[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /profit\s+(?:before|after)\s+tax[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /(?:total\s+)?comprehensive\s+income[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /profit\s+for\s+the\s+(?:year|period)[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /operating\s+profit[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi
  ];

  // Extract revenue
  let totalRevenue = 0;
  revenuePatterns.forEach((pattern, index) => {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(match => {
      try {
        const value = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(value) && value > 0) {
          const name = `Revenue Item ${Object.keys(data.revenue).length + 1}`;
          data.revenue[`revenue_${index}_${Object.keys(data.revenue).length}`] = { name, value };
          totalRevenue = Math.max(totalRevenue, value); // Take the largest value as total
          console.log('Found revenue:', name, value);
        }
      } catch (e) {
        console.warn('Error parsing revenue value:', match[1]);
      }
    });
  });

  // Extract expenses
  let totalExpenses = 0;
  expensePatterns.forEach((pattern, index) => {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(match => {
      try {
        const value = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(value) && value > 0) {
          const name = `Expense Item ${Object.keys(data.expenses).length + 1}`;
          data.expenses[`expense_${index}_${Object.keys(data.expenses).length}`] = { name, value };
          totalExpenses += value;
          console.log('Found expense:', name, value);
        }
      } catch (e) {
        console.warn('Error parsing expense value:', match[1]);
      }
    });
  });

  // Extract net income
  netIncomePatterns.forEach(pattern => {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(match => {
      try {
        const value = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(value)) {
          data.netIncome = value;
          console.log('Found net income:', value);
        }
      } catch (e) {
        console.warn('Error parsing net income value:', match[1]);
      }
    });
  });

  // Set totals
  data.totalRevenue = totalRevenue;
  data.totalExpenses = totalExpenses;

  console.log('Final P&L data:', {
    revenueItems: Object.keys(data.revenue).length,
    expenseItems: Object.keys(data.expenses).length,
    totalRevenue: data.totalRevenue,
    totalExpenses: data.totalExpenses,
    netIncome: data.netIncome
  });

  return data;
};

// Enhanced Balance Sheet parser
export const parseBalanceSheetFromText = (text) => {
  console.log('Parsing Balance Sheet from text length:', text.length);
  
  const data = {
    assets: {},
    liabilities: {},
    equity: {},
    totalAssets: 0,
    totalLiabilities: 0,
    totalEquity: 0,
    extractedAt: new Date().toISOString(),
    source: 'pdf_extraction'
  };

  // Enhanced patterns for UK balance sheets
  const assetPatterns = [
    /(?:total\s+)?current\s+assets[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /(?:total\s+)?non[.\s-]?current\s+assets[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /(?:total\s+)?fixed\s+assets[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /(?:cash\s+and\s+)?cash\s+equivalents[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /(?:trade\s+)?(?:accounts\s+)?receivables?[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /debtors[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /inventory[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /stock[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /property,?\s*plant\s+and\s+equipment[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /tangible\s+(?:fixed\s+)?assets[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /intangible\s+assets[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /total\s+assets[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi
  ];

  const liabilityPatterns = [
    /(?:total\s+)?current\s+liabilities[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /(?:total\s+)?non[.\s-]?current\s+liabilities[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /(?:total\s+)?long[.\s-]?term\s+(?:debt|liabilities)[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /(?:trade\s+)?(?:accounts\s+)?payables?[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /creditors[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /(?:short[.\s-]?term\s+)?debt[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /accrued\s+liabilities[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /provisions[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /total\s+liabilities[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi
  ];

  const equityPatterns = [
    /(?:shareholders?|stockholders?)\s+(?:equity|funds)[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /(?:total\s+)?equity[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /retained\s+(?:earnings|profits)[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /(?:share\s+|called[.\s-]?up\s+)?capital[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /reserves[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi,
    /profit\s+and\s+loss\s+account[:\s]*[£$]?\s*([,\d]+(?:\.\d{2})?)/gi
  ];

  // Extract assets
  let totalAssets = 0;
  assetPatterns.forEach((pattern, index) => {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(match => {
      try {
        const value = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(value) && value > 0) {
          const name = `Asset Item ${Object.keys(data.assets).length + 1}`;
          data.assets[`asset_${index}_${Object.keys(data.assets).length}`] = { name, value };
          if (match[0].toLowerCase().includes('total assets')) {
            totalAssets = Math.max(totalAssets, value);
          }
          console.log('Found asset:', name, value);
        }
      } catch (e) {
        console.warn('Error parsing asset value:', match[1]);
      }
    });
  });

  // Extract liabilities
  let totalLiabilities = 0;
  liabilityPatterns.forEach((pattern, index) => {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(match => {
      try {
        const value = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(value) && value > 0) {
          const name = `Liability Item ${Object.keys(data.liabilities).length + 1}`;
          data.liabilities[`liability_${index}_${Object.keys(data.liabilities).length}`] = { name, value };
          if (match[0].toLowerCase().includes('total liabilities')) {
            totalLiabilities = Math.max(totalLiabilities, value);
          } else {
            totalLiabilities += value;
          }
          console.log('Found liability:', name, value);
        }
      } catch (e) {
        console.warn('Error parsing liability value:', match[1]);
      }
    });
  });

  // Extract equity
  let totalEquity = 0;
  equityPatterns.forEach((pattern, index) => {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(match => {
      try {
        const value = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(value)) { // Equity can be negative
          const name = `Equity Item ${Object.keys(data.equity).length + 1}`;
          data.equity[`equity_${index}_${Object.keys(data.equity).length}`] = { name, value };
          if (match[0].toLowerCase().includes('total equity') || match[0].toLowerCase().includes('shareholders')) {
            totalEquity = Math.max(totalEquity, Math.abs(value));
          }
          console.log('Found equity:', name, value);
        }
      } catch (e) {
        console.warn('Error parsing equity value:', match[1]);
      }
    });
  });

  // Set totals
  data.totalAssets = totalAssets;
  data.totalLiabilities = totalLiabilities;
  data.totalEquity = totalEquity;

  console.log('Final Balance Sheet data:', {
    assetItems: Object.keys(data.assets).length,
    liabilityItems: Object.keys(data.liabilities).length,
    equityItems: Object.keys(data.equity).length,
    totalAssets: data.totalAssets,
    totalLiabilities: data.totalLiabilities,
    totalEquity: data.totalEquity
  });

  return data;
};