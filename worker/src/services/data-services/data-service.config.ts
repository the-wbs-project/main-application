export const DATA_SERVICE_CONFIG = {
  activities: {
    collId: 'Activity',
    pkVariable: 'topLevelId',
  },
  discussions: {
    collId: 'Discussions',
    pkVariable: 'associationId',
  },
  invites: {
    collId: 'Metadata',
    pkVariable: 'type',
  },
  lists: {
    dbId: '_common',
    collId: 'Lists',
    pkVariable: 'type',
  },
  resources: {
    dbId: '_common',
    collId: 'Resources',
    pkVariable: 'language',
  },
  projectNodes: {
    collId: 'ProjectNodes',
    pkVariable: 'projectId',
  },
  projects: {
    collId: 'Projects',
    pkVariable: 'id',
  },
  userActivities: {
    collId: 'ActivityUsers',
    pkVariable: 'userId',
  },
};
