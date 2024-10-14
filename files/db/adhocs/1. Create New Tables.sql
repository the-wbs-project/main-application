CREATE TABLE [dbo].[SiteRoles]
(
    [UserId] NVARCHAR(100) NOT NULL,
    [Role] NVARCHAR(100) NOT NULL,
    CONSTRAINT [SiteRoles_PK] PRIMARY KEY CLUSTERED ([UserId] ASC, [Role] ASC),
)
GO

CREATE TABLE [dbo].[LibraryEntryVersionEditors]
(
    [EntryId] NVARCHAR(100) NOT NULL,
    [Version] INT NOT NULL,
    [UserId] NVARCHAR(100) NOT NULL,
    CONSTRAINT [LibraryEntryVersionEditors_PK] PRIMARY KEY CLUSTERED ([EntryId] ASC, [Version] ASC, [UserId] ASC),
    CONSTRAINT [LibraryEntryVersionEditors_FK_EntryId] FOREIGN KEY ([EntryId], [Version]) REFERENCES [dbo].[LibraryEntryVersions]([EntryId], [Version]) ON DELETE CASCADE
)
GO

CREATE TABLE [dbo].[Organization]
(
    [Id] NVARCHAR(100) NOT NULL,
    [Name] NVARCHAR(100) NOT NULL,
    [AiModels] NVARCHAR(MAX) NOT NULL,
    [CreatedAt] DATETIME NOT NULL,
    [UpdatedAt] DATETIME NOT NULL,
    CONSTRAINT [Organization_PK] PRIMARY KEY CLUSTERED ([Id] ASC)
)
GO

CREATE TABLE [dbo].[OrganizationRoles]
(
    [OrganizationId] NVARCHAR(100) NOT NULL,
    [UserId] NVARCHAR(100) NOT NULL,
    [Role] NVARCHAR(100) NOT NULL,
    CONSTRAINT [OrganizationRoles_PK] PRIMARY KEY CLUSTERED ([OrganizationId] ASC, [UserId] ASC, [Role] ASC),
    CONSTRAINT [OrganizationRoles_FK_OrganizationId] FOREIGN KEY ([OrganizationId]) REFERENCES [dbo].[Organization]([Id]) ON DELETE CASCADE
)
GO

CREATE TABLE [dbo].[OrganizationRoleHistory]
(
    [OrganizationId] NVARCHAR(100) NOT NULL,
    [UserId] NVARCHAR(100) NOT NULL,
    [Timestamp] DATETIMEOFFSET NOT NULL,
    [FromRoles] NVARCHAR(MAX) NOT NULL,
    [ToRoles] NVARCHAR(MAX) NOT NULL,
    CONSTRAINT [OrganizationRoleHistory_PK] PRIMARY KEY CLUSTERED ([OrganizationId] ASC, [UserId] ASC, [Timestamp] ASC)
)
GO
CREATE TABLE [dbo].[ProjectRoles]
(
    [ProjectId] NVARCHAR(100) NOT NULL,
    [UserId] NVARCHAR(100) NOT NULL,
    [Role] NVARCHAR(100) NOT NULL,
    CONSTRAINT [ProjectRoles_PK] PRIMARY KEY CLUSTERED ([ProjectId] ASC, [UserId] ASC, [Role] ASC),
    CONSTRAINT [ProjectRoles_FK_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [dbo].[Projects]([Id]) ON DELETE CASCADE
)
GO

CREATE TABLE [dbo].[ProjectRoleHistory]
(
    [ProjectId] NVARCHAR(100) NOT NULL,
    [Timestamp] DATETIMEOFFSET NOT NULL,
    [From] NVARCHAR(MAX) NOT NULL,
    [To] NVARCHAR(MAX) NOT NULL,
    CONSTRAINT [ProjectRoleHistory_PK] PRIMARY KEY CLUSTERED ([ProjectId] ASC, [Timestamp] ASC)
)
GO

