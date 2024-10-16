CREATE TABLE [dbo].[ProjectRoles]
(
    [ProjectId] NVARCHAR(100) NOT NULL,
    [UserId] NVARCHAR(100) NOT NULL,
    [Role] NVARCHAR(100) NOT NULL,
    CONSTRAINT [ProjectRoles_PK] PRIMARY KEY CLUSTERED ([ProjectId] ASC, [UserId] ASC, [Role] ASC),
    CONSTRAINT [ProjectRoles_FK_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [dbo].[Projects]([Id]) ON DELETE CASCADE
);

CREATE TABLE [dbo].[ProjectRoleHistory]
(
    [ProjectId] NVARCHAR(100) NOT NULL,
    [Timestamp] DATETIMEOFFSET NOT NULL,
    [From] NVARCHAR(MAX) NOT NULL,
    [To] NVARCHAR(MAX) NOT NULL,
    CONSTRAINT [ProjectRoleHistory_PK] PRIMARY KEY CLUSTERED ([ProjectId] ASC, [Timestamp] ASC)
);
