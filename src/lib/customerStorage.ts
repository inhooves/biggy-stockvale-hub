export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  idNumber: string;
  idPhoto: string; // base64
  passportPhoto: string; // base64
  passportNumber: string;
  email: string;
  dateOfBirth: string;
  address: string;
  dateJoined: string;
}

const STORAGE_KEY = 'biggyround_customers';

export const getCustomers = (): Customer[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveCustomers = (customers: Customer[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
};

export const addCustomer = (customer: Omit<Customer, 'id' | 'dateJoined'>): { success: boolean; message: string; customer?: Customer } => {
  const customers = getCustomers();
  
  // Check for duplicate ID number
  if (customers.some(c => c.idNumber === customer.idNumber)) {
    return { success: false, message: 'ID Number already exists in our system.' };
  }

  const newCustomer: Customer = {
    ...customer,
    id: crypto.randomUUID(),
    dateJoined: new Date().toISOString(),
  };

  customers.push(newCustomer);
  saveCustomers(customers);

  return { success: true, message: 'Customer registered successfully!', customer: newCustomer };
};

export const deleteCustomer = (id: string): boolean => {
  const customers = getCustomers();
  const filtered = customers.filter(c => c.id !== id);
  
  if (filtered.length < customers.length) {
    saveCustomers(filtered);
    return true;
  }
  return false;
};

export const getCustomerById = (id: string): Customer | undefined => {
  const customers = getCustomers();
  return customers.find(c => c.id === id);
};

export const getTodayRegistrations = (): number => {
  const customers = getCustomers();
  const today = new Date().toDateString();
  return customers.filter(c => new Date(c.dateJoined).toDateString() === today).length;
};

export const getCompleteProfiles = (): number => {
  const customers = getCustomers();
  return customers.filter(c => c.idPhoto && c.passportPhoto).length;
};

export const exportToCSV = (): string => {
  const customers = getCustomers();
  const headers = ['ID', 'Full Name', 'Phone', 'ID Number', 'ID Photo Filename', 'Passport Photo Filename', 'Passport Number', 'Email', 'Date of Birth', 'Address', 'Date Joined'];
  
  const rows = customers.map(c => [
    c.id,
    c.fullName,
    c.phone,
    c.idNumber,
    c.idPhoto ? `id_${c.idNumber}.jpg` : '',
    c.passportPhoto ? `passport_${c.idNumber}.jpg` : '',
    c.passportNumber || '',
    c.email,
    c.dateOfBirth,
    c.address,
    new Date(c.dateJoined).toLocaleDateString()
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
  return csvContent;
};
