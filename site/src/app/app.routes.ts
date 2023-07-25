export const routes = [
  {
    path: '',
    loadChildren: () =>
    import('./main/main.routes').then(
      ({ routes }) => routes
    ),
  }
];
