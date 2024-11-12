export const formatDate = (dateString: string) => {
  if (!dateString) {
    return;
  }

  const [year, month, day] = dateString.split('-');

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthName = monthNames[parseInt(month, 10) - 1];

  if (!monthName) {
    return;
  }

  return `${monthName} ${parseInt(day, 10)}, ${year}`;
};
