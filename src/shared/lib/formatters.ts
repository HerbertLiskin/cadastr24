// Formatting helpers for Russian cadastr data representation

export const formatDate = (timestamp?: number | null): string => {
  if (!timestamp) return '—';
  try {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (e) {
    return '—';
  }
};

export const formatCurrency = (amount?: string | number | null): string => {
  if (amount === undefined || amount === null) return '—';
  const parsed = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(parsed)) return '—';
  
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(parsed);
};

export const getStatusText = (status?: string): string => {
  if (status === '1') return 'Актуально';
  if (status === '0') return 'В архиве';
  return status || '—';
};

export const getPurposeText = (purpose?: string): string => {
  if (purpose === '206002000000') return 'Жилое';
  if (purpose === '206001000000') return 'Нежилое';
  return 'Нежилое';
};

export const getObjectTypeText = (type?: string): string => {
  if (type === '002001003000') return 'Помещение';
  return 'Помещение';
};
