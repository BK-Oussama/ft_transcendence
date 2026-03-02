export const USERS = [
  { id: 1, name: 'user 1', initials: 'U1', color: 'bg-emerald-500' },
  { id: 2, name: 'user 2', initials: 'U2', color: 'bg-blue-500' },
  { id: 3, name: 'user 3', initials: 'U3', color: 'bg-purple-500' },
  { id: 4, name: 'user 4', initials: 'U4', color: 'bg-amber-500' },
];

export const getUserById = (id: number) => {
  return USERS.find(user => user.id === id);
};
