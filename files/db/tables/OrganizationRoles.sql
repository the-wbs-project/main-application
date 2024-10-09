CREATE TABLE [dbo].[OrganizationRoles]
(
    [OrganizationId] NVARCHAR(100) NOT NULL,
    [UserId] NVARCHAR(100) NOT NULL,
    [Role] NVARCHAR(100) NOT NULL,
    CONSTRAINT [OrganizationRoles_PK] PRIMARY KEY CLUSTERED ([OrganizationId] ASC, [UserId] ASC, [Role] ASC),
    CONSTRAINT [OrganizationRoles_FK_OrganizationId] FOREIGN KEY ([OrganizationId]) REFERENCES [dbo].[Organization]([Id]) ON DELETE CASCADE
);

CREATE TABLE [dbo].[OrganizationRoleHistory]
(
    [OrganizationId] NVARCHAR(100) NOT NULL,
    [UserId] NVARCHAR(100) NOT NULL,
    [Timestamp] DATETIMEOFFSET NOT NULL,
    [FromRoles] NVARCHAR(MAX) NOT NULL,
    [ToRoles] NVARCHAR(MAX) NOT NULL,
    CONSTRAINT [OrganizationRoleHistory_PK] PRIMARY KEY CLUSTERED ([OrganizationId] ASC, [UserId] ASC, [Timestamp] ASC)
);
