export const vecEnCours = [
    {
      id: 1,
      id_user: 1,
      licensePlate: '78945A40',
      timeIn: '2022-01-01T12:00:00Z',
      timeOut: '2022-01-01T14:00:00Z',
    },
    {
      id: 2,
      id_user: 2,
      licensePlate: '526H6',
      timeIn: '2022-01-02T09:00:00Z',
      timeOut: '2022-01-02T11:00:00Z',
    },
  ];

export  const vecHisto =[
    {
      id: 2,
      id_user: 4,
      licensePlate: '526H6',
      timeIn: '2022-01-02T09:00:00Z',
      timeOut: '2022-01-02T11:00:00Z',
    },
    {
      id: 3,
      id_user: 3,
      licensePlate: '15975W6',
      timeIn: '2022-01-03T15:00:00Z',
      timeOut: null,
    },
  ];

    // Tableau des utilisateurs (1=admin, 0=user)
    export  const users = [
        {
          id: 1,
          email: 'user1@example.com',
          password: 'password1',
          type: 1,
        },
        {
          id: 2,
          email: 'user2@example.com',
          password: 'password2',
          type: 0,
        },
        {
          id: 3,
          email: 'user3@example.com',
          password: 'password3',
          type: 1,
        },
        {
          id: 4,
          email: 'user4@example.com',
          password: 'password4',
          type: 0,
        },
      ];