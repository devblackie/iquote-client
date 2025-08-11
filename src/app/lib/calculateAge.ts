export const calculateAge = (dob: string | Date): number => {
  const birthDate = new Date(dob);
  const currentDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};