export interface Customer {
  id: string;
  firstName: string;
  surname: string;
  phone: string;
  idNumber: string;
  idPhoto: string; // base64
  passportPhoto: string; // base64
  passportNumber: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  city: string;
  referralSource: string;
  agentName: string;
  agentPhone: string;
  // Beneficiary/Next of Kin
  beneficiaryName: string;
  beneficiaryIdNumber: string;
  beneficiaryAddress: string;
  beneficiaryPhone: string;
  dateJoined: string;
  // Login credentials
  username: string;
  passwordHash: string;
}

const STORAGE_KEY = 'biggyround_customers';

// Simple hash function for password storage (for demo purposes - in production use proper hashing)
const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16) + '_' + btoa(password.slice(0, 3));
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

export const authenticateMember = (username: string, password: string): { success: boolean; customer?: Customer; message: string } => {
  const customers = getCustomers();
  const customer = customers.find(c => c.username.toLowerCase() === username.toLowerCase());
  
  if (!customer) {
    return { success: false, message: 'Username not found. Please check your username or register.' };
  }
  
  if (!verifyPassword(password, customer.passwordHash)) {
    return { success: false, message: 'Incorrect password. Please try again.' };
  }
  
  return { success: true, customer, message: 'Login successful!' };
};

export const isUsernameTaken = (username: string): boolean => {
  const customers = getCustomers();
  return customers.some(c => c.username.toLowerCase() === username.toLowerCase());
};

export const getHashedPassword = (password: string): string => {
  return hashPassword(password);
};

export const getCustomerByEmail = (email: string): Customer | undefined => {
  const customers = getCustomers();
  return customers.find(c => c.email.toLowerCase() === email.toLowerCase());
};

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
  const headers = [
    'ID', 'First Name', 'Surname', 'Phone', 'ID Number', 'ID Photo Filename', 
    'Passport Photo Filename', 'Passport Number', 'Email', 'Gender', 'Date of Birth', 
    'Address', 'City', 'Referral Source', 'Agent Name', 'Agent Phone',
    'Beneficiary Name', 'Beneficiary ID', 'Beneficiary Address', 'Beneficiary Phone', 'Date Joined'
  ];
  
  const rows = customers.map(c => [
    c.id,
    c.firstName,
    c.surname,
    c.phone,
    c.idNumber,
    c.idPhoto ? `id_${c.idNumber}.jpg` : '',
    c.passportPhoto ? `passport_${c.idNumber}.jpg` : '',
    c.passportNumber || '',
    c.email,
    c.gender,
    c.dateOfBirth,
    c.address,
    c.city,
    c.referralSource,
    c.agentName || '',
    c.agentPhone || '',
    c.beneficiaryName || '',
    c.beneficiaryIdNumber || '',
    c.beneficiaryAddress || '',
    c.beneficiaryPhone || '',
    new Date(c.dateJoined).toLocaleDateString()
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
  return csvContent;
};
