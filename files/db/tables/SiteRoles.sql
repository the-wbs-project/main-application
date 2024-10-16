CREATE TABLE [dbo].[SiteRoles]
(
    [UserId] NVARCHAR(100) NOT NULL,
    [Role] NVARCHAR(100) NOT NULL,
    CONSTRAINT [SiteRoles_PK] PRIMARY KEY CLUSTERED ([UserId] ASC, [Role] ASC),
);
